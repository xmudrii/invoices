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

    def clean(self):
        form_data = self.cleaned_data
        if form_data['date_from'] is not None and form_data['date_to'] is not None:
            if form_data['date_from'] > form_data['date_to']:
                self._errors['date_from'] = ['Date from must be lower or equal than date to.']
        if form_data['total_from'] is not None and form_data['total_to'] is not None:
            if form_data['total_from'] > form_data['total_to']:
                self._errors['total_from'] = ['Total from must be lower or equal than total to.']
        return form_data
