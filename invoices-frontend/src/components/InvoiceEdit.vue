<template>
  <b-container fluid>
    <b-form>
      <b-row class="mt-2">
        <b-col sm="2" style="text-align: left">
          <label for="number">Invoice number:</label>
        </b-col>
        <b-col sm="2">
          <b-input id="number" v-model="invoice.number"></b-input>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col sm="2" style="text-align: left">
          <label for="date">Invoice date:</label>
        </b-col>
        <b-col sm="2">
          <b-form-datepicker
              id="date"
              v-model="invoice.date"
              :date-format-options="{ day: '2-digit', month: '2-digit', year: 'numeric' }"
          ></b-form-datepicker>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col sm="2" style="text-align: left">
          <label for="date_from">Date from:</label>
        </b-col>
        <b-col sm="2">
          <b-form-datepicker
              id="date_from"
              v-model="invoice.date_from"
              :date-format-options="{ day: '2-digit', month: '2-digit', year: 'numeric' }"
          ></b-form-datepicker>
        </b-col>
        <b-col sm="1"/>
        <b-col sm="2" style="text-align: left">
          <label for="date_to">Date to:</label>
        </b-col>
        <b-col sm="2">
            <b-form-datepicker
              id="date_to"
              v-model="invoice.date_to"
              :date-format-options="{ day: '2-digit', month: '2-digit', year: 'numeric' }"
          ></b-form-datepicker>
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="12" style="text-align: left">
          <b-form-select v-model="invoice.company_id">
            <option v-for="selected in companies"
                    :key="selected.id"
                    :value="selected.id"
            >
              {{ selected.name }}, National ID: {{ selected.national_id }}, Tax ID: {{ selected.tax_number }}
            </option>
          </b-form-select>
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="12" style="text-align: left">
          <b-form-textarea v-model="invoice.remarks" placeholder="Remarks"></b-form-textarea>
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

        commit: function() {
          const r = JSON.stringify(this.invoice, (key, value) => {
            if(key === "id") return undefined;
            // else if(key === "date" || key === "date_from" || key === "date_to") {
            //   if(value.includes("T")) {
            //     value = value.split('T')[0];
            //   }
            //   value = value + " 02:00:00";
            // }
            else if(value === null) return "";
            return value;
          });

          if (!this.$route.params.id)
            this.new_invoice(r);
          else
            this.change_invoice({id: this.$route.params.id, invoice: r});

          // TODO: Better handle this.
          // this.invoice = {};
        },
    }
}
</script>

<style scoped>

</style>