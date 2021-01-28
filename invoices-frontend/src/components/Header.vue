<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-navbar-brand to="/">Invoices App</b-navbar-brand>

        <b-nav-item-dropdown text="Invoices">
          <b-dropdown-item to="/">Preview and edit invoices</b-dropdown-item>
          <b-dropdown-item to="/invoice/new">New invoice</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="Companies">
          <b-dropdown-item to="/companies">Preview and edit companies</b-dropdown-item>
          <b-dropdown-item to="/company/new">New company</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="Cities">
          <b-dropdown-item to="/cities">Preview and edit cities</b-dropdown-item>
          <b-dropdown-item to="/city/new">New city</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="Tax rates">
          <b-dropdown-item to="/taxrates">Preview and edit tax rates</b-dropdown-item>
          <b-dropdown-item to="/taxrate/new">New tax rate</b-dropdown-item>
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