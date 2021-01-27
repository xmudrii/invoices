from django.urls import path
from . import views

app_name = 'invoices_app'

urlpatterns = [
    path('', views.invoices, name='invoices')
]
