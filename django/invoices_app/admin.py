from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(City)
admin.site.register(MyCompany)
admin.site.register(Company)
admin.site.register(TaxRate)
admin.site.register(Invoice)
admin.site.register(InvoiceItem)
admin.site.register(User)
