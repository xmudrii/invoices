<template>
  <b-container fluid>
    <b-row class="mb-4">
      <b-col class="text-left">Invoice number: {{ invoice.number }}</b-col>
    </b-row>
    <b-row class="mb-4">
      <b-col class="text-left">Invoice date: {{ formatDate(invoice.date) }}</b-col>
    </b-row>
    <b-row class="mb-4">
      <b-col class="text-left"><b>Date from</b> {{ formatDate(invoice.date_from) }} <b>to</b> {{ formatDate(invoice.date_to) }}</b-col>
    </b-row>
    <b-row class="mb-4">
      <b-col class="text-left">Company name: {{ invoice.company_name }}</b-col>
    </b-row>
    <div>
      <b-table
          hover v-if="invoice_items.length"
          sticky-header="800px"
          :items="invoice_items"
          :fields="fields"
          :primary-key="invoice_items.id"
          head-variant="light"
          @row-clicked="editInvoiceItem"
      >
      </b-table>
      <p v-else>No items.</p>
    </div>
    <b-row class="mb-5">
      <b-col class="text-left">Remarks: {{ invoice.remarks }}</b-col>
    </b-row>
    <b-row class="mb-5">
      <b-col>
        <b-button variant="primary" size="lg" @click="addInvoiceItem">Add invoice item</b-button>
      </b-col>
      <b-col>
        <b-button variant="primary" size="lg" @click="editInvoice">Edit invoice</b-button>
      </b-col>
      <b-col>
        <b-button variant="danger" size="lg" @click="deleteInvoice">Delete invoice</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import router from "@/router";
import { mapState, mapActions } from 'vuex';
import {DateTime} from "luxon";

export default {
  name: "InvoiceView",
  props: {
    invoice: {
      type: Object,
    }
  },
  computed: {
    ...mapState(['invoice_items']),
  },
  mounted: function () {
    this.load_invoice_items({invoice: this.invoice})
  },
  methods: {
    ...mapActions(['load_invoice_items', 'delete_invoice']),

    addInvoiceItem: function (item, index, event) {
      router.push({path: `/invoice/${this.invoice.id}/item`});
    },

    editInvoice: function (item, index, event) {
      router.push({path: `/invoice/edit/${this.invoice.id}`});
    },

    deleteInvoice: function (item, index, event) {
      this.delete_invoice({id: this.invoice.id});
      router.push({path: `/`});
    },

    editInvoiceItem: function (item, index, event) {
      router.push({path: `/invoice/${this.invoice.id}/item/${item.id}`});
    },

    formatDate: function(date) {
      return DateTime.fromSQL(date).setLocale("sr-RS").toLocaleString({
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },

    formatDouble: function(value) {
      return parseFloat(value).toLocaleString("sr-RS", {
        minimumFractionDigits: 2
      });
    },

    formatTaxValue: function(value) {
      const val = parseFloat(value).toLocaleString("sr-RS", {
        minimumFractionDigits: 2
      });
      return val + "%";
    }
  },
  data() {
    return {
      fields: [
        { key: 'description', label: 'Description', tdClass: "text-left", thClass: "text-left" },
        { key: 'unit', label: 'Unit', tdClass: "text-center" },
        { key: 'count', label: 'Count', tdClass: "text-center" },
        { key: 'price', label: 'Price', formatter: "formatDouble", tdClass: "text-right" },
        { key: 'base_total', label: 'Base', formatter: "formatDouble", tdClass: "text-right" },
        { key: 'tax_value', label: 'Tax Percent', formatter: "formatTaxValue", tdClass: "text-right" },
        { key: 'tax_total', label: 'Tax Total', formatter: "formatDouble", tdClass: "text-right" },
        { key: 'total', label: 'Total', formatter: "formatDouble", tdClass: "text-right" },
      ]
    }
  }
}
</script>

<style scoped>

</style>