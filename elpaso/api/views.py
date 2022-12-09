import base64
import csv
import os
import random
import re
from collections import defaultdict
from datetime import datetime
from pprint import pprint
import ast

from google.cloud import storage
import firebase_admin
import requests
from django.contrib.auth import authenticate, login, logout
from django.db.models.fields import json
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from psycopg2.extensions import JSON
from rest_framework import status
from .models import Client, Product
from rest_framework.utils import json
from firebase_admin import credentials
from firebase_admin import auth
from django.conf import settings
from datetime import datetime
from calendar import monthrange
from rapidfuzz.distance import Levenshtein

firebase_credentials = credentials.Certificate(settings.FIREBASE_CONFIG)
firebase_app = firebase_admin.initialize_app(firebase_credentials)

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/run/secrets/google_cloud_secret'

client = storage.Client()
bucket_name = settings.BUCKET_NAME
bucket = client.bucket(bucket_name)
bucket.location = 'US'

categories_products = []


def home(request):
    return JsonResponse({'status': str(status.HTTP_200_OK)})


def verify_google_token(token):
    GOOGLE_ID_TOKEN_INFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo'

    response = requests.get(
        GOOGLE_ID_TOKEN_INFO_URL,
        params={'id_token': token}
    )
    if not response.ok:
        print(" response not ok ")
        return False

    audience = response.json()['aud']
    if audience != settings.GOOGLE_OAUTH2_CLIENT_ID:
        print(" audience not ok")
        return False

    # try:
    data = response.json()
    email = data['email']
    print("EMail o current user: " + email)

    existing_user = Client.objects.filter(email=email).values(
        'id').first()

    if existing_user is None:
        print(" user is none ")
        return False

    print("Google id successfully verified.")
    return existing_user  # <QuerySet [{'id': 2}]>
    # except:
    #     print(" error ")
    #     return False


def verify_user_token(token):
    try:
        decoded_token = auth.verify_id_token(token)
        print("Decoded token "+ str(decoded_token))
        email = decoded_token['email']
        username = decoded_token['name']
        print("veriffy user token: " + str(email) + str(username))
        existing_user = Client.objects.filter(email=email, username=username).values('id').first()
        if existing_user is None:
            print(" user not found ")
            return False
        print(" id successfully verified.")
        print(existing_user)
        return existing_user
    except:
        return False


def strip_of_empty_lines(strg):
    lines = strg.split("\n")
    lines_non_empty = [line for line in lines if line.strip() != ""]

    final_strg = ""
    for line in lines_non_empty:
        final_strg += line + "\n"
    return final_strg

def analyse_data(ocr_text_data):
    pattern_number_pieces = "\d+[.:,; ]*\d{2,3}"
    pattern_pieces = "[ ][a-zA-Z]{2,3}" 
    pattern_multiplied = "[ ][xX][ ]" 
    pattern_price = "\d[.,:; ]\d{2}" 

    patterns = [pattern_number_pieces, pattern_pieces, pattern_multiplied, pattern_price]
    pattern = re.compile(pattern_number_pieces + pattern_pieces + pattern_multiplied + pattern_price)

    pattern_total=re.compile("^TOTAL$")
    pattern_total_price=re.compile("\d*[,.;:'\/!2`~]*\d*")

    text_without_empty_lines = strip_of_empty_lines(ocr_text_data)
    text_without_breaks = text_without_empty_lines.replace('<br />', '')
    lines = text_without_breaks.splitlines()

    filtered_ocr_text_data = []
    # total_price = 0 
    # found = 0 
    skip = 0
    chained_quantities = 1
    current_chained_quantity = 0

    def get_partially_matched(line):
        number_matches = 0
        # match_order = [] 
        for i in patterns:
            current_pattern = re.compile(i)
            current_match = current_pattern.search(line)
            if current_match is not None:
                print("match found" + str(current_match))
                # match_order.append(current_match.span())
                number_matches += 1
        if number_matches >= 3:
            return 1
        return 0



    produce_price_pattern=re.compile("\d[.,:;']\d{1,2}[ ]*[ABC]$")
    produce_discount_pattern=re.compile("\d[.,:;']\d{1,2}[ ]*[-~][ ]*[ABC]$")
    discount_pattern=re.compile(r'\b(?i)(discount|oferta speciala|reducere|oferta|soldare|super weekend)\b')
    currency_pattern=re.compile(r'\b(?i)(Lei|Iei)\b')
    separate_quatity_pattern=re.compile(r'^[ ]*\d*[., ;:]\d{2,3}[ ]*$')
    chained_quantities = 0
    current_chained_quantity = 0
    
    def include_discount(lines,filtered_ocr_text_data):
        discounts=[]
        chained=0
        for _, line in enumerate(lines):
            match = produce_price_pattern.search(line)
            if match is not None:
                chained+=1
            elif chained>0:
                discount = produce_discount_pattern.search(line)
                if discount is not None:
                    print("DISCOUNT --- " + str(discount.group(0)))
                    discounts.append({chained-1:float(discount.group(0)[0:4])})
                elif "%" in line:
                    continue
                else:
                    chained=0
            else:
                chained=0
        print(discounts)
        offset = 1 
        for disc in discounts:
            filtered_ocr_text_data.insert( offset + int(list(disc.items())[0][0]),
            {'product':'DISCOUNT/STORNARE', 'quantity':list(disc.items())[0][1]})
            offset+=1


    separate_quantities_to_match=[]

    for ind, line in enumerate(lines):
        match = pattern.search(line)
        if match is not None or get_partially_matched(line):
            chained_quantities += 1
            if separate_quantities_to_match !=[]:
                line_buf = ""
                line_buf=str(separate_quantities_to_match.pop(0)) + line
                print("inserted quantity -----" + str(line_buf))
                filtered_ocr_text_data.append({'product': "", 'quantity': line_buf})
            else:
                filtered_ocr_text_data.append({'product': "", 'quantity': line})

        elif separate_quatity_pattern.search(line) is not None:
            separate_quantities_to_match.append(line+" ")


    for ind, line in enumerate(lines):
        match = pattern.search(line)
        test = discount_pattern.search(line)

        if match is None and not get_partially_matched(line) and \
        re.search('[a-zA-Z]', line) is not None and \
        produce_price_pattern.search(line) is None and \
        discount_pattern.search(line) is None and \
        produce_discount_pattern.search(line) is None and\
        currency_pattern.search(line) is None and\
        len(line) > 3:
            filtered_ocr_text_data[current_chained_quantity]['product'] = line
            current_chained_quantity += 1
            if current_chained_quantity == chained_quantities:
                break

        # if found==0:
        #     reached_receipt_end = pattern_total.search(line)
        #     if reached_receipt_end is not None:
        #         found = 1
        #         print("total found")
        # else:
        #     found = 0
        #     got_total = pattern_total_price.search(line)
        #     print(str(got_total))
        #     if got_total is not None:
        #         total_price = got_total
        #         print("[TOTAL PRICE OF RECEIPT] : " + str(total_price))
    include_discount(lines,filtered_ocr_text_data)
    return filtered_ocr_text_data


def log_in(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION')
        print("Logged user token: " + token)

        # verify token
        try:
            decoded_token = auth.verify_id_token(token)
            email = decoded_token['email']
            username = decoded_token['name']
            try:
                existing_user = Client.objects.filter(email=email, username=username)
                if existing_user is None:
                    print("User was not in database.")
                    return JsonResponse({'status': str(status.HTTP_400_BAD_REQUEST)})
                return JsonResponse({'status': str(status.HTTP_200_OK)})
            except:
                return JsonResponse({'status': str(status.HTTP_400_BAD_REQUEST)})
        except:
            return JsonResponse({'status': str(status.HTTP_400_BAD_REQUEST)})
    return JsonResponse({'status': str(status.HTTP_200_OK)})


def google_log_in(request):
    if request.method == 'POST':
        token = request.headers.get('Authorization')
        print("Logged user token: " + token)

        # verify token
        GOOGLE_ID_TOKEN_INFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo'
        # try:
        response = requests.get(
            GOOGLE_ID_TOKEN_INFO_URL,
            params={'id_token': token}
        )
        print(" response: " + str(response.text))
        if not response.ok:
            return JsonResponse({"status": status.HTTP_400_BAD_REQUEST})

        audience = response.json()['aud']

        if audience != settings.GOOGLE_OAUTH2_CLIENT_ID:
            return JsonResponse({"status": status.HTTP_400_BAD_REQUEST})

        try:
            data = response.json()
            email = data['email']
            print("email " + email)
            username = data['email']
            existing_user = Client.objects.filter(email=email)
            print(existing_user)
            if not existing_user:
                user = Client(email=email, username=username)
                try:
                    user.save()
                    return JsonResponse({'status': str(status.HTTP_201_CREATED)})
                except:
                    return JsonResponse({'status': str(status.HTTP_409_CONFLICT)})
            else:
                print("User already in database.")
        except:
            return JsonResponse({'status': str(status.HTTP_400_BAD_REQUEST)})

    return JsonResponse({'status': str(status.HTTP_200_OK)})


def register(request):  # Shouldn't be accessed if the user is not logged in
    if request.method == 'POST':
        try:
            token = request.META.get('HTTP_AUTHORIZATION')
            print("Logged user token: " + token)
            # verify token
            try:
                decoded_token = auth.verify_id_token(token)
                print("Registering the user: " + str(decoded_token))
                email = decoded_token['email']
                username = decoded_token['name']
                user = Client(email=email, username=username)
                try:
                    user.save()
                    return JsonResponse({'status': str(status.HTTP_201_CREATED)})
                except:
                    return JsonResponse({'status': str(status.HTTP_409_CONFLICT)})
            except:
                return JsonResponse({'status': str(status.HTTP_400_BAD_REQUEST)})
        except:
            return JsonResponse({'status': str(status.HTTP_400_BAD_REQUEST)})


def capture(request):
    def upload_to_storage(blob_name, file, bucket_name):
        try:
            bucket = client.get_bucket(bucket_name)
            blob = bucket.blob(blob_name)
            blob.upload_from_filename(file)
            blob.make_public()
            return blob.public_url
        except Exception as e:
            print(e)
            return

    if request.method == 'POST':
        token = request.headers.get('Authorization').replace("\"", "")
        # try:
        print("Received token: " + token.replace("\"", ""))
        print(type(token))
        user_id = verify_user_token(token)
        print(" \n user id after verification is " + str(user_id))
        google_user_id = verify_google_token(token)

        if user_id is False and google_user_id is False:
            print("BOTH FALSE")
            return JsonResponse({'status': str(status.HTTP_400_BAD_REQUEST)})

        body = request.body
        encoded_photo = json.loads(request.body)
        try:
            encoded_photo = encoded_photo["photo"]
        except:
            try:
                encoded_photo = encoded_photo["content"]
            except:
                return JsonResponse({"status": status.HTTP_400_BAD_REQUEST})

        encoded_photo = encoded_photo[22:]
        imgdata = base64.urlsafe_b64decode(encoded_photo)
        filename = 'receipt' + str(random.randrange(1, 999999)) + '.png'  
        with open(filename, 'wb') as f:
            f.write(imgdata)

        # try:
        public_image_url = upload_to_storage(filename, filename, bucket_name)
        print("Uploaded image " + filename + " to Cloud: " + public_image_url)

        querystring = {"imageurl": public_image_url,
                       "filename": filename + ".png"}
        headers = {
            'x-rapidapi-host': settings.RAPID_API_HOST,
            'x-rapidapi-key': settings.RAPID_API_KEY
        }

        response = requests.request("GET", 'https://' + str(settings.RAPID_API_HOST + '/'), headers=headers, params=querystring)
        analysed_data = analyse_data(response.text)

        bucket = client.get_bucket(bucket_name)
        all_blobs = bucket.list_blobs()
        for blob in all_blobs:
            blob.delete()
        return JsonResponse({"data": analysed_data, "status": status.HTTP_200_OK})
    return JsonResponse({"status": status.HTTP_400_BAD_REQUEST})


def get_products_csv():
    filename = "./data/categories.csv"
    with open(filename, 'r') as csvfile:
        datareader = csv.reader(csvfile)
        for row in datareader:
            categories_products.append(row)


def receipt(request):
    if request.method == 'POST':

        token = request.headers.get('Authorization').replace("\"", "")
        print("Received token: " + token)
        global currentClient

        user_id = verify_user_token(token)
        google_user_id = verify_google_token(token)

        if user_id is False and google_user_id is False:
            return JsonResponse({'status': str(status.HTTP_400_BAD_REQUEST)})

        if google_user_id is not False:
            currentClient = Client.objects.filter(id=google_user_id['id'])[0]
        elif user_id is not False:
            currentClient = Client.objects.filter(id=user_id['id'])[0]

        body = request.body
        received_data = json.loads(request.body)
        encoded_data = received_data[0]
        date = datetime.strptime(str(received_data[1]), '%Y-%m-%d') 

        discounts = defaultdict(int)
        index = 0

        for entry in encoded_data:
            discount = entry['product']
            price_quant = entry['quantity']
            if str(discount) == "DISCOUNT/STORNARE":
                discounts[index-1] = price_quant
            index += 1
        print(discounts)
        index = 0

        for entry in encoded_data:
            product = entry['product']
            if str(product) == "DISCOUNT/STORNARE":
                index+=1
                continue
            price_quant = entry['quantity'].replace(',', '.').replace(':', '.').replace(';', '.')
            quantity = re.findall('^\d+[.:,; ]*\d{0,3} [a-zA-Z]', price_quant)
            price = re.findall(r'\d+[.,:;]\d{2}$', price_quant)

            if quantity!=[] and price!=[]:
                quantity = quantity[0][:-1]
                price = price[0].replace(',', '.').replace(':', '.').replace(';', '.')

                if index in discounts:
                    unitary_discount = float(discounts[index])/float(quantity)
                    price = round(float(price) - unitary_discount,2)
                    print("For " + str (product) + " the price after discount: " + str(price))
                index += 1

            else:
                continue

            match = {'percent': 70, "category": 'Diverse'}

            levenshtein_similarity = 0.0
            get_products_csv()

            if price != 0.0:
                for row in categories_products:
                    check_similarity = Levenshtein.normalized_similarity(str.lower(product), str.lower(row[0]).replace(" ", ""), weights=(1,1,3), score_cutoff=0.55)
                    # print("For product " + str(product) + " bd prod: " + str(row[0]) + " the similarity is: " + str(check_similarity))
                    if check_similarity > levenshtein_similarity:
                        levenshtein_similarity = check_similarity
                        match['category'] = row[1]

                prod = Product(name=product, quantity=float(quantity), price=float(price),
                            date=date,
                            clientId=currentClient, category=match["category"])
                try:
                    prod.save()
                except:
                    return JsonResponse({'status': str(status.HTTP_409_CONFLICT)})
                entry["category"] = match["category"]

        series_data = []
        prices_data = []
        products_prices_data = [] 

        if google_user_id is not False:
            series_data, prices_data = get_statistics(google_user_id['id'], date)
            products_prices_data = products_price_chart(google_user_id['id'], date)

        elif user_id is not False:
            series_data, prices_data = get_statistics(user_id['id'], date)
            products_prices_data = products_price_chart(user_id['id'], date)

        return JsonResponse({'status': str(status.HTTP_201_CREATED), 'data': series_data, 'prices_data': prices_data,
                            'products_prices_data': products_prices_data})

    return JsonResponse({"status": status.HTTP_200_OK})


def get_statistics(id, selectedDate):
    products = Product.objects.filter(date=selectedDate, clientId_id=id).all()
    series = defaultdict(float)  # default dictionary for {category : number}
    prices = defaultdict(float)  # default dictionary for {category: price}

    series_data = []
    prices_data = []

    for i in products:
        series[i.category.replace(" ", "")] += round(i.quantity)
        prices[i.category.replace(" ", "")] += round(i.price, 2)*i.quantity

    for key, value in series.items():
        series_data.append({"name": key, "value": value})

    for key, value in prices.items():
        prices_data.append({"name": key, "value": round(value, 2)})

    # print(str(prices_data)) # what price per each category 
    # print(str(series_data)) # how many of each category 
    return series_data, prices_data

def get_category_products(id, selected_day=None, selected_month=None, selected_year=None):

    series_data = []
    series = defaultdict(float)  # default dictionary for {category : number}

    if selected_day == '':
        selected_day = ast.literal_eval('None')
    if selected_month == '':
        selected_month = ast.literal_eval('None')
    if selected_year == '':
        selected_year = ast.literal_eval('None')

    if selected_day is not None and selected_month is not None and selected_year is not None:
        # print("1st")
        products = Product.objects.filter(date__day = datetime.strptime(selected_day, '%d').day, 
        date__month = datetime.strptime(selected_month, '%m').month, date__year = datetime.strptime(selected_year, '%Y').year, clientId_id=id).all()
        for i in products:
            series[i.category.replace(" ", "")] +=  round(i.price, 2)*i.quantity
        for key, value in series.items():
            series_data.append({"name": key, "value": round(value, 2)})
        return series_data

    if selected_month is not None and selected_year is not None:
        # print("2nd")
        products = Product.objects.filter(date__month = datetime.strptime(selected_month, '%m').month, date__year = datetime.strptime(selected_year, '%Y').year, clientId_id=id).all()
        print(str(products))
        for i in products:
            series[i.category.replace(" ", "")] += round(i.price, 2)*i.quantity
        for key, value in series.items():
            series_data.append({"name": key, "value": round(value, 2)})
        print(str(series_data))
        return series_data

    if selected_year is not None:
        # print("3rd")
        products = Product.objects.filter(date__year = datetime.strptime(selected_year, '%Y').year, clientId_id=id).all()
        for i in products:
            series[i.category.replace(" ", "")] +=  round(i.price, 2)*i.quantity
        for key, value in series.items():
            series_data.append({"name": key, "value": round(value, 2)})
        return series_data


def dashboard(request):
    if request.method == 'POST':

        token = request.headers.get('Authorization').replace("\"", "")
        # print("Received token: " + token + str(type(token)))

        user_id = verify_user_token(token)
        google_user_id = verify_google_token(token)

        if user_id is False and google_user_id is False:
            print("Both false")
            return JsonResponse({'status': str(status.HTTP_400_BAD_REQUEST)})

        body = request.body
        encoded_data = json.loads(request.body)
        print("encoded data " + str(encoded_data))
        selectedDate = datetime.strptime(str(encoded_data), '%Y-%m-%d')

        series_data = []
        prices_data = []
        products_prices_data = []
        # try:
        if google_user_id is not False:
            series_data, prices_data = get_statistics(google_user_id['id'], selectedDate)
            products_prices_data = products_price_chart(google_user_id['id'], selectedDate)
        elif user_id is not False:
            series_data, prices_data = get_statistics(user_id['id'], selectedDate)
            products_prices_data = products_price_chart(user_id['id'], selectedDate)
        # except:
        #     return JsonResponse({'status': str(status.HTTP_400_BAD_REQUEST)})

        return JsonResponse({'status': str(status.HTTP_200_OK), 'data': series_data, 'prices_data': prices_data,
                             'products_prices_data': products_prices_data})
    return JsonResponse({"status": status.HTTP_200_OK})


# return {"nume":product, "pret":price}
def products_price_chart(id, date):
    prods = []
    if id is not False:
        products = Product.objects.filter(date=date, clientId_id=id).all()
        for i in products:
            prods.append({"nume": i.name, "pret": i.price})
    return prods



def general_dashboard(request):
    if request.method == 'POST':
        token = request.headers.get('Authorization').replace("\"", "")
        print("Received token: " + token + str(type(token)))

        user_id = verify_user_token(token)
        google_user_id = verify_google_token(token)

        if user_id is False and google_user_id is False:
            print("Both false")
            return JsonResponse({'status': str(status.HTTP_400_BAD_REQUEST)})
 
        received_data = json.loads(request.body)
        encoded_data = received_data[0]
        day = received_data[1]
        month = received_data[2]
        year = received_data[3]
        delete_id = received_data[4]
        if delete_id != '':
            Product.objects.filter(id=delete_id).delete()
        selected_day=''
        selected_month=''
        selected_year=''
        # print("PRimit argumente " + str(day) + str(month) + str(year))
        if encoded_data != '':
            formatted_date = datetime.strptime(str(encoded_data), '%Y-%m-%d')
            selected_day = formatted_date.day
            selected_month = formatted_date.month
            selected_year = formatted_date.year

        i = 1 
        yearly_expenses = []
        products = []
        selected_day_products = []
        this_month_spendings = []
        total_yearly_expense = 0
        last_4y_expenses = [] 
        category_expenses = []
       
        if encoded_data != '':
            year_iterator = selected_year - 3
            if google_user_id is not False:
                products = Product.objects.filter(date__day = selected_day, date__month=selected_month, date__year = selected_year, clientId_id=google_user_id['id']).all()
                category_expenses = get_category_products(google_user_id['id'], day, month, year)
            elif user_id is not False:
                products = Product.objects.filter(date__day = selected_day, date__month=selected_month, date__year = selected_year, clientId_id=user_id['id']).all()
                category_expenses = get_category_products(user_id['id'], day, month, year)

        for k in products:
            selected_day_products.append({"id":str(k.id), "nume":str(k.name), "data":str(k.date), "pret":str(k.price), "bucati":str(k.quantity), "categorie":str(k.category)}) # produse cumparate astazi

        if selected_month!='':
            while i <= int(selected_month):
                last_4y_expenses.append({"Luna" : i, str(year_iterator): 0, str(year_iterator+1) : 0, str(year_iterator+2) : 0,  str(year_iterator+3) : 0 })
                if selected_year!='':
                    while year_iterator <= selected_year:
                        total_sum = 0
                        if google_user_id is not False:
                            products = Product.objects.filter(date__month=i, date__year = year_iterator, clientId_id=google_user_id['id']).all()
                        elif user_id is not False:
                            products = Product.objects.filter(date__month=i, date__year = year_iterator, clientId_id=user_id['id']).all()

                        for j in products:
                                total_sum+=j.price*j.quantity

                        last_4y_expenses[i-1][str(year_iterator)] = round(total_sum, 2) # cheltuieli ultimii 4 ani

                        if year_iterator == selected_year:   
                            yearly_expenses.append({"luna":i, "suma": round(total_sum, 2)})
                            total_yearly_expense += total_sum # totalul cheltuielilor in anul curent
                        
                        year_iterator += 1
                    i+=1
                    year_iterator = selected_year - 3

        day = 1 
        if selected_year!='':
            while day <= monthrange(selected_year, selected_month)[1]:
                total_sum = 0 
                if google_user_id is not False:
                    this_month_products = Product.objects.filter(date__day = day,date__month=selected_month, date__year = selected_year, clientId_id=google_user_id['id']).all()
                    for j in this_month_products:
                        total_sum+=j.price*j.quantity
                    this_month_spendings.append({"zi":day, "total" : round(total_sum, 2)})

                elif user_id is not False:
                    this_month_products = Product.objects.filter(date__day = day,date__month=selected_month, date__year = selected_year, clientId_id=user_id['id']).all()
                    for j in this_month_products:
                        total_sum+=j.price*j.quantity
                    this_month_spendings.append({"zi":day, "total" : round(total_sum, 2)})
                day+=1

        print(selected_day_products)
        return JsonResponse({"status": status.HTTP_200_OK, 'data': yearly_expenses, "total" : round(total_yearly_expense, 2), 
        "data_past_4y" : last_4y_expenses, "selected_day_products" : selected_day_products, 
        "this_month_spendings" : this_month_spendings, 'category_expenses': category_expenses})
    return JsonResponse({"status": status.HTTP_400_BAD_REQUEST})
