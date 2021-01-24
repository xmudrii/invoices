<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <InvoiceView :invoice="invoice"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header";
import InvoiceView from "@/components/InvoiceView";
import { mapState, mapActions } from 'vuex';

export default {
  name: "Invoice",
  components: {
    Header,
    InvoiceView
  },
  computed: {
    ...mapState(['invoices']),

    invoice: function () {
      for (let i = 0; i < this.invoices.length; i++)
        if (this.invoices[i].id === parseInt(this.$route.params.id))
          return this.invoices[i];
    }
  },
  methods: {
    ...mapActions(['load_invoices'])
  }
}
</script>

<style scoped>

</style>