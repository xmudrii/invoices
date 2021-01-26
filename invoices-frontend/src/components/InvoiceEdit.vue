<template>
  <b-container fluid>
    <b-form>
      <b-row class="mt-2">
        <b-col sm="2" class="text-left">
          <label for="number">Invoice number:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="number" v-model="invoice.number" class="text-right"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errInvoiceNumber">
        <b-col class="text-left text-danger">
          Invoice number is required and must have maximum 5 characters.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" class="text-left">
          <label for="date">Invoice date:</label>
        </b-col>
        <b-col sm="3">
          <b-form-datepicker
              id="date"
              v-model="invoice.date"
              :date-format-options="{ day: '2-digit', month: '2-digit', year: 'numeric' }"
          ></b-form-datepicker>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col sm="2" class="text-left">
          <label for="date_from">Date from:</label>
        </b-col>
        <b-col sm="3">
          <b-form-datepicker
              id="date_from"
              v-model="invoice.date_from"
              :date-format-options="{ day: '2-digit', month: '2-digit', year: 'numeric' }"
          ></b-form-datepicker>
        </b-col>
        <b-col md="auto" class="text-left">
          <label for="date_to">to:</label>
        </b-col>
        <b-col sm="3">
            <b-form-datepicker
              id="date_to"
              v-model="invoice.date_to"
              :date-format-options="{ day: '2-digit', month: '2-digit', year: 'numeric' }"
          ></b-form-datepicker>
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="12" class="text-left">
          <label for="company">Company:</label>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12" class="text-left">
          <b-form-select id="company" v-model="invoice.company_id">
            <option v-for="selected in companies"
                    :key="selected.id"
                    :value="selected.id"
            >
              {{ selected.name }}, National ID: {{ selected.national_id }}, Tax ID: {{ selected.tax_number }}
            </option>
          </b-form-select>
        </b-col>
      </b-row>
      <b-row v-if="errCompany">
        <b-col class="text-left text-danger">
          Company is required.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="12" class="text-left">
          <label for="remarks">Remarks:</label>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12" class="text-left">
          <b-form-textarea id="remarks" v-model="invoice.remarks"></b-form-textarea>
        </b-col>
      </b-row>

      <b-row class="mt-5">
        <b-col>
          <b-button variant="primary" size="lg" @click="commit">Save</b-button>
        </b-col>
        <b-col></b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import router from "@/router";

export default {
    name: "InvoiceEdit",
    props: {
      invoice: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        newInvoice: {
          id: ''
        },
        errInvoiceNumber: false,
        errCompany: false
      }
    },
    mounted: function () {
      this.newInvoice = this.invoice;
      this.load_companies();
    },
    computed: {
      ...mapState(['companies']),
    },
    methods: {
        ...mapActions(['new_invoice', 'change_invoice', 'load_companies']),

        commit: function () {
          let err = false;
          if(this.invoice.number === undefined || this.invoice.number.length === 0 || this.invoice.number.length > 5) {
            this.errInvoiceNumber = true;
            err = true;
          } else {
            this.errInvoiceNumber = false;
          }
          if(this.invoice.company_id === undefined) {
            this.errCompany = true;
            err = true;
          } else {
            this.errCompany = false;
          }
          if(err)
            return;

          let req = {
            number: this.invoice.number,
            date: this.invoice.date,
            date_from: this.invoice.date_from,
            date_to: this.invoice.date_to,
            company_id: this.invoice.company_id,
            remarks: this.invoice.remarks,
          }
          const r = JSON.stringify(req, (key, value) => {
            if(value === null) return "";
            else if(value === undefined) return null;
            return value;
          });

          if (!this.$route.params.id)
            this.new_invoice(r);
          else
            this.change_invoice({id: this.$route.params.id, invoice: r});

          if(this.invoice.id === undefined)
            router.push({path: `/`});
          else
            router.push({path: `/invoice/${this.invoice.id}`});
        },
    }
}
</script>

<style scoped>

</style>