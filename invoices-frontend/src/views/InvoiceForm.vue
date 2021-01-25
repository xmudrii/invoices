<template>
  <div>
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <InvoiceEdit :invoice="invoice"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import InvoiceEdit from "@/components/InvoiceEdit";
import Header from "@/components/Header";
import { mapState, mapActions } from 'vuex';

export default {
  name: "InvoiceForm",
  components: {
    Header,
    InvoiceEdit
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