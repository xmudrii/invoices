<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <InvoicesList/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header";
import InvoicesList from "@/components/InvoicesList";
import {mapActions} from "vuex";

export default {
  name: "Home",
  components: {
    Header,
    InvoicesList
  },
  methods: {
    ...mapActions(['load_invoices'])
  },
  mounted: function() {
    this.load_invoices();
  }
}
</script>

<style scoped>

</style>