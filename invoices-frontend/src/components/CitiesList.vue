<template>
  <div>
    <b-table
        hover v-if="cities.length"
        sticky-header="800px"
        :items="cities"
        :fields="fields"
        :primary-key="cities.id"
        head-variant="light"
        @row-clicked="editCity"
        >
    </b-table>
    <h1 v-else>No cities.</h1>
  </div>
</template>

<script>
import router from "@/router";
import { mapState } from 'vuex';

export default {
  name: "CitiesList",
  computed: {
    ...mapState(['cities']),
  },
  data() {
    return {
      fields: [
        { key: 'post_code', label: 'Post code', tdClass: "text-right", thClass: "text-center", sortable: true },
        { key: 'city', label: 'City', tdClass: "text-left", thClass: "text-center", sortable: true },
        { key: 'country', label: 'Country', tdClass: "text-left", thClass: "text-center", sortable: true },
      ]
    }
  },
  methods: {
    editCity: function (item, index, event) {
      router.push({path: `/city/${item.id}`});
    }
  }
}
</script>

<style scoped>

</style>