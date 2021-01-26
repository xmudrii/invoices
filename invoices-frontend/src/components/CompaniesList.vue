<template>
  <div>
    <b-table
        hover v-if="companies.length"
        sticky-header="800px"
        :items="companies"
        :fields="fields"
        :primary-key="companies.id"
        head-variant="light"
        @row-clicked="editCompany"
        >
    </b-table>
    <h1 v-else>No companies.</h1>
  </div>
</template>

<script>
import router from "@/router";
import { mapState } from 'vuex';

export default {
  name: "CompaniesList",
  computed: {
    ...mapState(['companies']),
  },
  data() {
    return {
      fields: [
        { key: 'number', label: 'Company No.', tdClass: "text-right", thClass: "text-center", sortable: true },
        { key: 'national_id', label: 'National ID', tdClass: "text-right", thClass: "text-center" },
        { key: 'name', label: 'Name', tdClass: "text-left", thClass: "text-left", sortable: true },
        { key: 'address', label: 'Address', tdClass: "text-left", thClass: "text-left", sortable: true },
        { key: 'city', label: 'City', tdClass: "text-left", thClass: "text-left", sortable: true },
      ]
    }
  },
  methods: {
    editCompany: function (item, index, event) {
      router.push({path: `/company/${item.id}`});
    }
  }
}
</script>

<style scoped>

</style>