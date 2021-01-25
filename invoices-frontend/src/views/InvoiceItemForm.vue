<template>
  <div>
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <InvoiceItemEdit :invoice="invoice" :invoice_item="invoice_item"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import InvoiceItemEdit from "@/components/InvoiceItemEdit";
import Header from "@/components/Header";
import { mapState } from 'vuex';

export default {
  name: "InvoiceItemForm",
  components: {
    Header,
    InvoiceItemEdit
  },
  computed: {
    ...mapState(['invoices', 'invoice_items']),

    invoice_item: function () {
      for (let i = 0; i < this.invoice_items.length; i++)
        if (this.invoice_items[i].id === parseInt(this.$route.params.id))
          return this.invoice_items[i];
    },

    invoice: function () {
      for (let i = 0; i < this.invoices.length; i++)
        if (this.invoices[i].id === parseInt(this.$route.params.invoice))
          return this.invoices[i];
    }
  },
}
</script>

<style scoped>

</style>