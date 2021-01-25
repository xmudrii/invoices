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
    component: InvoiceForm
  },
  {
    path: '/invoice/:id',
    name: 'Invoice',
    component: Invoice
  },
  {
    path: '/invoice/:invoice/item',
    name: 'NewInvoiceItem',
    component: InvoiceItemForm
  },
  {
    path: '/invoice/:invoice/item/:id',
    name: 'EditInvoiceItem',
    component: InvoiceItemForm
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
