from django.forms import ModelForm, Form
import django.forms as f
from .models import Company, City


class InvoicesForm(Form):
    date_from = f.DateField(label='Date from', required=False)
    date_to = f.DateField(label='Date to', required=False)
    company = f.ModelChoiceField(label='Company', queryset=Company.objects.all(), required=False)
    city = f.ModelChoiceField(label='City', queryset=City.objects.all(), required=False)
    total_from = f.DecimalField(decimal_places=2, required=False)
    total_to = f.DecimalField(decimal_places=2, required=False)
