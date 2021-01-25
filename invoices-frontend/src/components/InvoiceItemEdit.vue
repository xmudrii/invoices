<template>
  <b-container fluid>
    <b-form>
      <b-row class="mt-2">
        <b-col sm="2" style="text-align: left">
          <label for="description">Description:</label>
        </b-col>
        <b-col sm="2">
          <b-input id="description" v-model="invoice_item.description"></b-input>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col sm="2" style="text-align: left">
          <label for="unit">Unit:</label>
        </b-col>
        <b-col sm="2">
          <b-input id="unit" v-model="invoice_item.unit"></b-input>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col sm="2" style="text-align: left">
          <label for="count">Count:</label>
        </b-col>
        <b-col sm="2">
          <b-input id="count" v-model="invoice_item.count"></b-input>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col sm="2" style="text-align: left">
          <label for="price">Base price:</label>
        </b-col>
        <b-col sm="2">
          <b-input id="price" v-model="invoice_item.price"></b-input>
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="12" style="text-align: left">
          <b-form-select v-model="invoice_item.tax_rate_id">
            <option v-for="selected in taxrates"
                    :key="selected.id"
                    :value="selected.id"
            >
              {{ selected.name }} - {{ selected.value }}%
            </option>
          </b-form-select>
        </b-col>
      </b-row>

      <b-row class="mt-5">
        <b-col sm="3">
          <b-button variant="primary" size="lg" @click="commit">Save</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import router from "@/router";

export default {
    name: "InvoiceItemEdit",
    props: {
      invoice: {
        type: Object,
      },
      invoice_item: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        newInvoiceItem: {
          id: ''
        },
      }
    },
    mounted: function () {
      this.newInvoiceItem = this.invoice_item;
      this.load_tax_rates();
    },
    computed: {
      ...mapState(['taxrates']),
    },
    methods: {
        ...mapActions(['new_invoice_item', 'change_invoice_item', 'load_tax_rates']),

        commit: function() {
          let req = {
            invoice_id: this.invoice.id,
            description: this.invoice_item.description,
            unit: this.invoice_item.unit,
            count: this.invoice_item.count,
            price: this.invoice_item.price,
            tax_rate_id: this.invoice_item.tax_rate_id,
          }
          const r = JSON.stringify(req, (key, value) => {
            if(value === null) return "";
            return value;
          });

          if (!this.$route.params.id)
            this.new_invoice_item({invoice_id: this.invoice.id, invoice_item: r});
          else
            this.change_invoice_item({id: this.$route.params.id, invoice_item: r});

          // TODO: Better handle this.
          // this.invoice = {};
          router.push({path: `/invoice/${this.invoice.id}`});
        },
    }
}
</script>

<style scoped>

</style>