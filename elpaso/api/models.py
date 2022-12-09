from django.db import models
from django.contrib.auth.models import AbstractUser, AbstractBaseUser


# Create your models here.

class Client(models.Model):
    email = models.EmailField("email address", unique=True)
    username = models.CharField(unique=True, max_length=50)
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

    class Meta:
        # name for table
        db_table = 'Client'


class Product(models.Model):
    name = models.CharField(max_length=50)
    price = models.FloatField()
    quantity = models.FloatField()
    date = models.DateField()
    clientId = models.ForeignKey(Client, on_delete=models.DO_NOTHING)
    category = models.CharField(max_length=70, default="")

    class Meta:
        db_table = 'Product'