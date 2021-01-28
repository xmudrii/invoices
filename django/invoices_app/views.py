from django.shortcuts import render
from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce
from .forms import InvoicesForm
from .models import *


def invoices(req):
    inv = Invoice.objects.all()
    inv = inv.annotate(
        net_price=Coalesce(
            Sum(F('invoiceitem__count') * F('invoiceitem__price')),
            Value(0)
        ),
        tax_total=Coalesce(
            Sum(F('invoiceitem__count') * F('invoiceitem__price') * F('invoiceitem__tax_rate__value') / 100),
            Value(0)
        ),
        total=Coalesce(
            Sum(F('invoiceitem__count') * F('invoiceitem__price')) + Sum(
                F('invoiceitem__count') * F('invoiceitem__price') * F('invoiceitem__tax_rate__value') / 100),
            Value(0)
        ),
    )

    sum_net_price = inv.aggregate(sum_net_price=Sum('net_price'))
    sum_tax_total = inv.aggregate(sum_tax_total=Sum('tax_total'))
    sum_total = inv.aggregate(sum_total=Sum('total'))

    if req.method == 'POST':
        invoices_form = InvoicesForm(req.POST)

        if invoices_form.is_valid():
            print(inv.query)
            # TODO: Proveri da li je date_from manji od date_to i obrnuto, isto i za total.
            if invoices_form.cleaned_data['date_from']:
                inv = inv.filter(date__gte=invoices_form.cleaned_data['date_from'])
            if invoices_form.cleaned_data['date_to']:
                inv = inv.filter(date__lte=invoices_form.cleaned_data['date_to'])
            if invoices_form.cleaned_data['company']:
                inv = inv.filter(company=invoices_form.cleaned_data['company'])
            if invoices_form.cleaned_data['city']:
                inv = inv.filter(company__city=invoices_form.cleaned_data['city'])
            if invoices_form.cleaned_data['total_from']:
                inv = inv.filter(total__gte=invoices_form.cleaned_data['total_from'])
            if invoices_form.cleaned_data['total_to']:
                inv = inv.filter(total__lte=invoices_form.cleaned_data['total_to'])

            return render(req, 'invoices.html', {
                'form': invoices_form,
                'invoices': inv,
                'sum_net_price': sum_net_price,
                'sum_tax_total': sum_tax_total,
                'sum_total': sum_total
            })
        else:
            return render(req, 'invoices.html', {'form': invoices_form})
    else:
        invoices_form = InvoicesForm()
        return render(req, 'invoices.html', {
            'form': invoices_form,
            'invoices': inv,
            'sum_net_price': sum_net_price,
            'sum_tax_total': sum_tax_total,
            'sum_total': sum_total
        })
