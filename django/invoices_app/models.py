import django.utils.timezone
from django.db import models
from django.contrib.auth.models import User


# Model PTT brojevi

class City(models.Model):
    post_code = models.CharField(max_length=5, db_index=True, unique=True)
    city = models.CharField(max_length=50)
    country = models.CharField(max_length=50)

    def __str__(self):
        return self.post_code + ' ' + self.city


# Model korisnik sistema

class MyCompany(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=50)
    city = models.ForeignKey(City, on_delete=models.RESTRICT)
    tax_number = models.CharField(max_length=9)
    national_id = models.CharField(max_length=13)
    email = models.CharField(max_length=50)
    payment_account = models.CharField(max_length=25, blank=True)
    updated_at = models.DateTimeField(auto_now=True)


# Model komintenta

class Company(models.Model):
    number = models.CharField(max_length=4, db_index=True, unique=True)
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=50)
    city = models.ForeignKey(City, on_delete=models.RESTRICT)
    tax_number = models.CharField(max_length=9)
    national_id = models.CharField(max_length=13)
    email = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.RESTRICT)

    def __str__(self):
        return self.name


# Model poreskih stopa

class TaxRate(models.Model):
    name = models.CharField(max_length=15)
    value = models.DecimalField(max_digits=4, decimal_places=2)

    def __str__(self):
        return self.name


# Model racuna

class Invoice(models.Model):
    number = models.CharField(max_length=5, db_index=True, unique=True)
    date = models.DateField(default=django.utils.timezone.now)
    date_from = models.DateField(default=django.utils.timezone.now)
    date_to = models.DateField(default=django.utils.timezone.now)
    company = models.ForeignKey(Company, on_delete=models.RESTRICT)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.RESTRICT)

    def __str__(self):
        return self.number


class InvoiceItem(models.Model):
    description = models.TextField()
    unit = models.CharField(max_length=4)
    count = models.DecimalField(max_digits=10, decimal_places=3)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    tax_rate = models.ForeignKey(TaxRate, on_delete=models.RESTRICT)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.RESTRICT)

    def __str__(self):
        return self.description
