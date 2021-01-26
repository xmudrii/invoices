<template>
  <b-container fluid>
    <b-form>
      <b-row class="mt-2">
        <b-col sm="2" class="text-left">
          <label for="name">Name:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="name" v-model="taxrate.name" class="text-left"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errName">
        <b-col class="text-left text-danger">
          Name is required and must have maximum 15 characters.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" class="text-left">
          <label for="value">Value:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="value" v-model="taxrate.value" class="text-right"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errValue">
        <b-col class="text-left text-danger">
          Value is required and must be a number.
        </b-col>
      </b-row>

      <b-row class="mt-5">
        <b-col>
          <b-button variant="primary" size="lg" @click="commit">Save</b-button>
        </b-col>
        <b-col>
          <b-button variant="danger" size="lg" @click="deleteTaxRate" v-if="taxrate.id">Delete tax rate</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import { mapActions } from 'vuex';
import router from "@/router";

export default {
    name: "TaxRateEdit",
    props: {
      taxrate: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        newTaxRate: {
          id: ''
        },
        errName: false,
        errValue: false
      }
    },
    mounted: function () {
      this.newTaxRate = this.taxrate;
    },
    methods: {
        ...mapActions(['new_tax_rate', 'change_tax_rate', 'delete_tax_rate']),

        commit: function () {
          let err = false;
          if(this.taxrate.name === undefined || this.taxrate.name.length === 0 || this.taxrate.name.length > 15) {
            this.errName = true;
            err = true;
          } else {
            this.errName = false;
          }
          if(this.taxrate.value === undefined || this.taxrate.value.length === 0 || isNaN(this.taxrate.value)) {
            this.errValue = true;
            err = true;
          } else {
            this.errValue = false;
          }
          if(err)
            return;

          let req = {
            name: this.taxrate.name,
            value: this.taxrate.value
          }
          const r = JSON.stringify(req, (key, value) => {
            if(value === null) return "";
            else if(value === undefined) return null;
            return value;
          });

          if (!this.$route.params.id)
            this.new_tax_rate(r).then(() => {
              router.push({path: '/taxrates'});
            });
          else
            this.change_tax_rate({id: this.$route.params.id, taxrate: r}).then(() => {
              router.push({path: '/taxrates'});
            });
        },

        deleteTaxRate: function () {
          this.delete_tax_rate({id: this.taxrate.id}).then(() => {
            router.push({path: '/taxrates'});
          });
        }
    }
}
</script>

<style scoped>

</style>