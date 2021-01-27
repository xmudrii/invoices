# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class City(models.Model):
    id = models.IntegerField(primary_key=True)
    post_code = models.CharField(max_length=5, db_index=True, unique=True)
    city = models.CharField(max_length=50)
    country = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'sys_city'


class TaxRate(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=15)
    value = models.DecimalField(max_digits=4, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'sys_tax_rate'


class MyCompany(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    tax_number = models.CharField(max_length=9)
    national_id = models.CharField(max_length=13)
    address = models.CharField(max_length=50)
    city = models.ForeignKey(City, models.RESTRICT)
    email = models.CharField(max_length=50)
    payment_account = models.CharField(max_length=25, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'sys_company'


class Company(models.Model):
    id = models.IntegerField(primary_key=True)
    number = models.CharField(max_length=4, db_index=True, unique=True)
    name = models.CharField(max_length=50)
    national_id = models.CharField(unique=True, max_length=13)
    tax_number = models.CharField(unique=True, max_length=9)
    address = models.CharField(max_length=50)
    city = models.ForeignKey(City, models.RESTRICT)
    email = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'company'


class Invoice(models.Model):
    id = models.IntegerField(primary_key=True)
    number = models.CharField(max_length=5, db_index=True, unique=True)
    date = models.DateField(auto_now_add=True)
    date_from = models.DateField(auto_now_add=True)
    date_to = models.DateField(auto_now_add=True)
    company = models.ForeignKey(Company, models.RESTRICT)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'invoice'


class InvoiceItem(models.Model):
    id = models.IntegerField(primary_key=True)
    invoice = models.ForeignKey(Invoice, models.CASCADE)
    description = models.TextField()
    unit = models.CharField(max_length=4)
    count = models.DecimalField(max_digits=10, decimal_places=3)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    tax_rate = models.ForeignKey(TaxRate, models.RESTRICT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'invoice_item'


class User(models.Model):
    id = models.IntegerField(primary_key=True)
    username = models.CharField(unique=True, max_length=30)
    password = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=50)
    name = models.CharField(max_length=30)
    surname = models.CharField(max_length=30)
    is_admin = models.IntegerField()
    is_active = models.IntegerField(default=True)

    class Meta:
        managed = False
        db_table = 'sys_user'
