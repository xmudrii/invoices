<template>
  <b-container fluid>
    <b-row class="mb-4">
      <b-col class="text-left">Invoice number: {{ invoice.number }}</b-col>
    </b-row>
    <b-row class="mb-4">
      <b-col class="text-left">Invoice date: {{ invoice.date }}</b-col>
    </b-row>
    <b-row class="mb-4">
      <b-col class="text-left">Date from {{ invoice.date_from }} to {{ invoice.date_to }}</b-col>
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
    <div class="mb-5">
      <p class="text-left">Remarks: {{ invoice.remarks }}</p>
    </div>
    <div class="mb-5">
      <b-button variant="primary" size="lg" @click="editInvoice">Edit invoice</b-button>
      <b-button variant="primary" size="lg" @click="deleteInvoice">Delete invoice</b-button>
    </div>
  </b-container>
</template>

<script>
import router from "@/router";
import { mapState, mapActions } from 'vuex';

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

    editInvoice: function (item, index, event) {
      router.push({path: `/invoice/edit/${this.invoice.id}`});
    },

    deleteInvoice: function (item, index, event) {
      this.delete_invoice({id: this.invoice.id});
      router.push({path: `/`});
    },

    editInvoiceItem: function (item, index, event) {
      // router.push({path: `/invoice/${item.id}`});
    }
  },
  data() {
    return {
      fields: [
        { key: 'description', label: 'Description' },
        { key: 'unit', label: 'Unit' },
        { key: 'count', label: 'Count' },
        { key: 'price', label: 'Price' },
        { key: 'base_total', label: 'Base' },
        { key: 'tax_value', label: 'Tax Percent' },
        { key: 'tax_total', label: 'Tax Total' },
        { key: 'total', label: 'Total' },
      ]
    }
  }
}
</script>

<style scoped>

</style>