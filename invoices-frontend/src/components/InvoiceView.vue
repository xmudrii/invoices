<template>
  <b-container fluid>
    <b-row class="mb-3">
      <b-col class="text-left" sm="2">Invoice number:</b-col>
      <b-col class="text-left"><b>{{ invoice.number }}</b></b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col class="text-left" sm="2">Invoice date:</b-col>
      <b-col class="text-left"><b>{{ formatDate(invoice.date) }}</b></b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col class="text-left" sm="2">Date from:</b-col>
      <b-col class="text-left" sm="1"><b>{{ formatDate(invoice.date_from) }}</b></b-col>
      <b-col class="text-center" sm="1">to:</b-col>
      <b-col class="text-left" sm="1"><b>{{ formatDate(invoice.date_to) }}</b></b-col>
    </b-row>
    <b-row class="mb-5">
      <b-col class="text-left" sm="2">Company name:</b-col>
      <b-col class="text-left"><b>{{ invoice.company_name }}</b></b-col>
    </b-row>
    <div class="mb-5">
      <b-table
          hover v-if="invoice_items.length"
          sticky-header="800px"
          :items="invoice_items"
          :fields="fields"
          :primary-key="invoice_items.id"
          head-variant="light"
          @row-clicked="editInvoiceItem"
      >
        <template slot="bottom-row"
                  slot-scope="data"
        >
          <td v-for="(field, i) in data.fields" class="text-right">
            <div v-if="i === 0" class="text-left">
              <b>Grand Total</b>
            </div>
            <div v-if="i === 4" class="text-right">
              <b>{{ totalBase() }}</b>
            </div>
            <div v-if="i === 6" class="text-right">
              <b>{{ totalTax() }}</b>
            </div>
            <div v-if="i === 7" class="text-right">
              <b>{{ totalInvoice() }}</b>
            </div>
          </td>
        </template>
      </b-table>
      <p v-else>No items.</p>
    </div>
    <b-row class="mb-5">
      <b-col class="text-left" sm="2">Remarks:</b-col>
      <b-col class="text-left"><b>{{ invoice.remarks }}</b></b-col>
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

    formatCount: function(value) {
      return parseFloat(value).toLocaleString("sr-RS", {
        minimumFractionDigits: 3
      });
    },

    formatTaxValue: function(value) {
      const val = parseFloat(value).toLocaleString("sr-RS", {
        minimumFractionDigits: 2
      });
      return val + "%";
    },

    totalBase: function() {
      let t = 0.00;
      if(this.invoice_items.length !== 0) {
        for (let i = 0; i < this.invoice_items.length; i++) {
          t += parseFloat(this.invoice_items[i].base_total);
        }
      }
      return this.formatDouble(t);
    },

    totalTax: function() {
      let t = 0.00;
      if(this.invoice_items.length !== 0) {
        for (let i = 0; i < this.invoice_items.length; i++) {
          t += parseFloat(this.invoice_items[i].tax_total);
        }
      }
      return this.formatDouble(t);
    },

    totalInvoice: function() {
      let t = 0.00;
      if(this.invoice_items.length !== 0) {
        for (let i = 0; i < this.invoice_items.length; i++) {
          t += parseFloat(this.invoice_items[i].total);
        }
      }
      return this.formatDouble(t);
    }
  },
  mounted: function () {
    this.load_invoice_items({invoice: this.invoice});
  },
  data() {
    return {
      fields: [
        { key: 'description', label: 'Description', tdClass: "text-left", thClass: "text-left" },
        { key: 'unit', label: 'Unit', tdClass: "text-center" },
        { key: 'count', label: 'Quantity', formatter: "formatCount", tdClass: "text-right" },
        { key: 'price', label: 'Unit Price', formatter: "formatDouble", tdClass: "text-right" },
        { key: 'base_total', label: 'Net Price', formatter: "formatDouble", tdClass: "text-right" },
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