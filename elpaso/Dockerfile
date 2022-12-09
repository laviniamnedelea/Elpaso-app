FROM python:3.8
WORKDIR /elpaso
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN apt-get update \
    && apt-get install -y postgresql-server-dev-all gcc python3-dev musl-dev 
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt
RUN mkdir buffer_migrations
COPY . .
