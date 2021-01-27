from django.shortcuts import render
from .forms import InvoicesForm


def index(req):
    invoices_form = InvoicesForm()
    return render(req, 'invoices.html', {'form': invoices_form})
