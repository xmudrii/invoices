import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import Home from '../views/Home.vue'
import Invoice from "@/views/Invoice";
import InvoiceForm from "@/views/InvoiceForm";
import InvoiceItemForm from "@/views/InvoiceItemForm";
import Companies from "@/views/Companies";
import CompanyForm from "@/views/CompanyForm";
import Cities from "@/views/Cities";
import TaxRates from "@/views/TaxRates";
import CityForm from "@/views/CityForm";
import TaxRateForm from "@/views/TaxRateForm";
import LoginForm from "@/views/LoginForm";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/invoice/new',
    name: 'NewInvoice',
    component: InvoiceForm
  },
  {
    path: '/invoice/edit/:id',
    name: 'EditInvoice',
    component: InvoiceForm,
    beforeEnter: (to, from, next) => {
      if(Number.isNaN(Number.parseInt(to.params.id)))
        next('/');
      next();
    }
  },
  {
    path: '/invoice/:id',
    name: 'Invoice',
    component: Invoice,
    beforeEnter: (to, from, next) => {
      if(Number.isNaN(Number.parseInt(to.params.id)))
        next('/');
      next();
    }
  },
  {
    path: '/invoice/:invoice/item',
    name: 'NewInvoiceItem',
    component: InvoiceItemForm,
    beforeEnter: (to, from, next) => {
      if(Number.isNaN(Number.parseInt(to.params.invoice)))
        next('/');
      next();
    }
  },
  {
    path: '/invoice/:invoice/item/:id',
    name: 'EditInvoiceItem',
    component: InvoiceItemForm,
    beforeEnter: (to, from, next) => {
      if(Number.isNaN(Number.parseInt(to.params.invoice)))
        next('/');
      if(Number.isNaN(Number.parseInt(to.params.id)))
        next('/');
      next();
    }
  },
  {
    path: '/companies',
    name: 'Companies',
    component: Companies
  },
  {
    path: '/company/new',
    name: 'NewCompany',
    component: CompanyForm
  },
  {
    path: '/company/:id',
    name: 'EditCompany',
    component: CompanyForm,
    beforeEnter: (to, from, next) => {
      if(Number.isNaN(Number.parseInt(to.params.id)))
        next('/');
      next();
    }
  },
  {
    path: '/cities',
    name: 'Cities',
    component: Cities
  },
  {
    path: '/city/new',
    name: 'NewCity',
    component: CityForm
  },
  {
    path: '/city/:id',
    name: 'EditCity',
    component: CityForm,
    beforeEnter: (to, from, next) => {
      if(Number.isNaN(Number.parseInt(to.params.id)))
        next('/');
      next();
    }
  },
  {
    path: '/taxrates',
    name: 'TaxRates',
    component: TaxRates
  },
  {
    path: '/taxrate/new',
    name: 'NewTaxRate',
    component: TaxRateForm
  },
  {
    path: '/taxrate/:id',
    name: 'EditTaxRate',
    component: TaxRateForm,
    beforeEnter: (to, from, next) => {
      if(Number.isNaN(Number.parseInt(to.params.id)))
        next('/');
      next();
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const authCookie = Cookies.get('authorization');
  if (to.name !== 'Login' && (authCookie === undefined || authCookie === null))
    next({ name: 'Login' })
  else
    next()
})

export default router
