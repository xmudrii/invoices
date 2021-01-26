<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-navbar-brand to="/">Invoices App</b-navbar-brand>

        <b-nav-item-dropdown text="Invoices" to="/">
          <b-dropdown-item to="/">Preview all invoices</b-dropdown-item>
          <b-dropdown-item to="/invoice/new">New invoice</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="Companies" to="/">
          <b-dropdown-item>Preview all companies</b-dropdown-item>
          <b-dropdown-item>New company</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="System" to="/">
          <b-dropdown-item>Tax rates</b-dropdown-item>
          <b-dropdown-item>Cities</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <div class="mt-5"></div>
  </div>
</template>

<script>
    export default {
        name: "Header",
        computed: {}
    }
</script>

<style scoped>

</style>