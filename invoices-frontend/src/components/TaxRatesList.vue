<template>
  <div>
    <b-table
        hover v-if="taxrates.length"
        sticky-header="800px"
        :items="taxrates"
        :fields="fields"
        :primary-key="taxrates.id"
        head-variant="light"
        @row-clicked="editTaxRate"
        >
    </b-table>
    <h1 v-else>No tax rates.</h1>
  </div>
</template>

<script>
import router from "@/router";
import { mapState } from 'vuex';

export default {
  name: "TaxRatesList",
  computed: {
    ...mapState(['taxrates']),
  },
  methods: {
    editTaxRate: function (item, index, event) {
      router.push({path: `/taxrate/${item.id}`});
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
        { key: 'name', label: 'Name', tdClass: "text-left", thClass: "text-center", sortable: true },
        { key: 'value', label: 'Value', tdClass: "text-right", thClass: "text-center", formatter: "formatTaxValue", sortable: true },
      ]
    }
  }
}
</script>

<style scoped>

</style>