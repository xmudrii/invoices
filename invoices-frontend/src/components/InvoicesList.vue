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
import { mapState, mapActions } from 'vuex';

export default {
  name: "InvoicesList",
  computed: {
    ...mapState(['invoices']),
  },
  data() {
    return {
      fields: [
        { key: 'number', label: 'Invoice No.' },
        { key: 'date', label: 'Invoice Date' },
        { key: 'company_name', label: 'Company' },
        { key: 'total', label: 'Total', type: 'Double' },
      ]
    }
  },
  methods: {
    editInovice: function (item, index, event) {
      router.push({path: `/invoice/${item.id}`});
    }
  }
}
</script>

<style scoped>

</style>