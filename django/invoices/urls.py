"""invoices URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    # TODO: Mislim da ne treba zato sto nemamo authn/authz
    # path('accounts/', include('django.contrib.auth.urls')),
    # TODO: Mislim da ne treba zato sto nemamo authn/authz
    # path('accounts/register/', views.register, name='register'),
    # TODO: Ovo ce trebati kasnije
    # path('', include('invoices_app.urls'))
]