<template>
  <div>
    <b-table
        hover v-if="users.length"
        sticky-header="800px"
        :items="users"
        :fields="fields"
        :primary-key="users.id"
        head-variant="light"
        @row-clicked="editUser"
        >
    </b-table>
    <h1 v-else>No users.</h1>
  </div>
</template>

<script>
import router from "@/router";
import { mapState } from 'vuex';

export default {
  name: "UsersList",
  computed: {
    ...mapState(['users']),
  },
  data() {
    return {
      fields: [
        { key: 'username', label: 'Username', tdClass: "text-left", thClass: "text-left", sortable: true },
        { key: 'email', label: 'Email', tdClass: "text-left", thClass: "text-left", sortable: true },
        { key: 'name', label: 'Name', tdClass: "text-left", thClass: "text-left", sortable: true },
        { key: 'surname', label: 'Surname', tdClass: "text-left", thClass: "text-left", sortable: true },
      ]
    }
  },
  methods: {
    editUser: function (item, index, event) {
      // router.push({path: `/user/${item.id}`});
    }
  }
}
</script>

<style scoped>

</style>