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
  methods: {
    ...mapActions(['load_invoice'])
  },
  computed: {
    ...mapState(['invoices']),

    invoice: function () {
      for (let i = 0; i < this.invoices.length; i++)
        if (this.invoices[i].id === parseInt(this.$route.params.id)) {
          // this.load_invoice({id: this.invoices[i].id});
          return this.invoices[i];
        }
    }
  }
}
</script>

<style scoped>

</style>