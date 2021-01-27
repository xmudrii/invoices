<template>
  <b-container fluid>
    <b-form>
      <b-row class="mt-2">
        <b-col class="text-left">
          <label for="description">Description:</label>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="text-left">
          <b-form-textarea id="description" v-model="invoice_item.description"></b-form-textarea>
        </b-col>
      </b-row>
      <b-row v-if="errDescription">
        <b-col class="text-left text-danger">
          Description is required.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" style="text-align: left">
          <label for="unit">Unit:</label>
        </b-col>
        <b-col sm="2">
          <b-input id="unit" v-model="invoice_item.unit" class="text-left"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errUnit">
        <b-col class="text-left text-danger">
          Unit is required and must have maximum 4 characters.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" style="text-align: left">
          <label for="count">Quantity:</label>
        </b-col>
        <b-col sm="2">
          <b-input id="count" v-model="invoice_item.count" class="text-right"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errCount">
        <b-col class="text-left text-danger">
          Count is required and must be a number.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" style="text-align: left">
          <label for="price">Unit price:</label>
        </b-col>
        <b-col sm="2">
          <b-input id="price" v-model="invoice_item.price" class="text-right"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errPrice">
        <b-col class="text-left text-danger">
          Price is required and must be a number.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" style="text-align: left">
          <label for="taxrate">Tax rate:</label>
        </b-col>
        <b-col sm="4">
          <b-form-select id="taxrate" v-model="invoice_item.tax_rate_id">
            <option v-for="selected in taxrates"
                    :key="selected.id"
                    :value="selected.id"
            >
              {{ selected.name }} - {{ selected.value }}%
            </option>
          </b-form-select>
        </b-col>
      </b-row>
      <b-row v-if="errTaxRate">
        <b-col class="text-left text-danger">
          Tax rate is required.
        </b-col>
      </b-row>

      <b-row class="mt-5">
        <b-col>
          <b-button variant="primary" size="lg" @click="commit">Save</b-button>
        </b-col>
        <b-col>
          <b-button variant="danger" size="lg" @click="deleteItem" v-if="invoice_item.id">Delete</b-button>
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
        errDescription: false,
        errUnit: false,
        errCount: false,
        errPrice: false,
        errTaxRate: false
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
        ...mapActions(['new_invoice_item', 'change_invoice_item', 'delete_invoice_item', 'load_tax_rates']),

        commit: function() {
          let err = false;
          if(this.invoice_item.description === undefined || this.invoice_item.description.length === 0) {
            this.errDescription = true;
            err = true;
          } else {
            this.errDescription = false;
          }
          if(this.invoice_item.unit === undefined || this.invoice_item.unit.length === 0 || this.invoice_item.unit.length > 4) {
            this.errUnit = true;
            err = true;
          } else {
            this.errUnit = false;
          }
          if(this.invoice_item.count === undefined || this.invoice_item.count.length === 0 || isNaN(this.invoice_item.count)) {
            this.errCount = true;
            err = true;
          } else {
            this.errCount = false;
          }
          if(this.invoice_item.price === undefined || this.invoice_item.price.length === 0 || isNaN(this.invoice_item.price)) {
            this.errPrice = true;
            err = true;
          } else {
            this.errPrice = false;
          }
          if(this.invoice_item.tax_rate_id === undefined) {
            this.errTaxRate = true;
            err = true;
          } else {
            this.errTaxRate = false;
          }
          if(err)
            return;

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
            else if(value === undefined) return null;
            return value;
          });

          if (!this.$route.params.id)
            this.new_invoice_item({invoice_id: this.invoice.id, invoice_item: r}).then(() => {
              router.push({path: `/invoice/${this.invoice.id}`});
            });
          else
            this.change_invoice_item({id: this.$route.params.id, invoice_item: r}).then(() => {
              router.push({path: `/invoice/${this.invoice.id}`});
            });
        },

        deleteItem: function () {
          this.delete_invoice_item({id: this.invoice_item.id}).then(() => {
            router.push({path: `/invoice/${this.invoice.id}`});
          });
        }
    }
}
</script>

<style scoped>

</style>