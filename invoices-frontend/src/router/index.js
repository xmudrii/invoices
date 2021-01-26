import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Invoice from "@/views/Invoice";
import InvoiceForm from "@/views/InvoiceForm";
import InvoiceItemForm from "@/views/InvoiceItemForm";

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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
