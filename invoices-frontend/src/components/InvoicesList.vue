<template>
  <div>
    <b-table
        hover v-if="invoices.length"
        sticky-header="800px"
        :items="invoices"
        :fields="fields"
        :primary-key="invoices.id"
        head-variant="light"
        @row-clicked="editInovice"
        >
    </b-table>
    <h1 v-else>No invoices.</h1>
  </div>
</template>

<script>
import router from "@/router";
import { mapState } from 'vuex';
import { DateTime } from "luxon";

export default {
  name: "InvoicesList",
  computed: {
    ...mapState(['invoices']),
  },
  data() {
    return {
      fields: [
        { key: 'number', label: 'Invoice No.', tdClass: "text-left", thClass: "text-left" },
        { key: 'date', label: 'Invoice Date', formatter: "formatDate", tdClass: "text-left", thClass: "text-left" },
        { key: 'company_name', label: 'Company', tdClass: "text-left", thClass: "text-left" },
        { key: 'total', label: 'Total', type: 'Double', formatter: "formatDouble", tdClass: "text-right" },
      ]
    }
  },
  methods: {
    editInovice: function (item, index, event) {
      router.push({path: `/invoice/${item.id}`});
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
    }
  }
}
</script>

<style scoped>

</style>