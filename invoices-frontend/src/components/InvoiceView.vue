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
    <b-row class="mb-4">
      <b-col class="text-left">Remarks: {{ invoice.remarks }}</b-col>
    </b-row>
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
  // data() {
  //   return {
  //     newInvoice: {
  //       id: ''
  //     }
  //   }
  // },
  // mounted: function () {
  //   this.newInvoice = this.invoice;
  // },
  methods: {
    // ...mapActions(['new_invoice', 'change_invoice']),

  }
}
</script>

<style scoped>

</style>