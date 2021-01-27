from django.shortcuts import render
from .forms import InvoicesForm
from .models import *


def invoices(req):
    if req.method == 'POST':
        invoices_form = InvoicesForm(req.POST)

        if invoices_form.is_valid():
            inv = Invoice.objects.all()
            if invoices_form.cleaned_data['date_from']:
                inv = inv.filter(date__gte=invoices_form.cleaned_data['date_from'])
            if invoices_form.cleaned_data['date_to']:
                inv = inv.filter(date__lte=invoices_form.cleaned_data['date_to'])
            if invoices_form.cleaned_data['company']:
                inv = inv.filter(company=invoices_form.cleaned_data['company'])
            if invoices_form.cleaned_data['city']:
                inv = inv.filter(city=invoices_form.cleaned_data['city'])
            # if invoices_form.cleaned_data['total_from']:
            #     inv.filter(total__gte=invoices_form.cleaned_data['total_from'])
            # if invoices_form.cleaned_data['total_to']:
            #     inv.filter(total__=invoices_form.cleaned_data['city'])

            print(inv)

            return render(req, 'invoices.html', {'form': invoices_form})
        else:
            return render(req, 'invoices.html', {'form': invoices_form})
    else:
        invoices_form = InvoicesForm()
        return render(req, 'invoices.html', {'form': invoices_form})
