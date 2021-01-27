<template>
  <b-container fluid>
    <b-form>
      <b-row class="mt-2">
        <b-col sm="2" class="text-left">
          <label for="number">Company number:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="number" v-model="company.number" class="text-right"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errCompanyNumber">
        <b-col class="text-left text-danger">
          Company number is required and must have maximum 4 characters.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" class="text-left">
          <label for="national_id">National ID:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="national_id" v-model="company.national_id" class="text-right"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errNationalID">
        <b-col class="text-left text-danger">
          National ID is required and must have maximum 13 characters.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" class="text-left">
          <label for="tax_number">Tax Number:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="tax_number" v-model="company.tax_number" class="text-right"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errTaxNumber">
        <b-col class="text-left text-danger">
          Tax number is required and must have maximum 9 characters.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" class="text-left">
          <label for="name">Name:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="name" v-model="company.name" class="text-left"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errName">
        <b-col class="text-left text-danger">
          Name is required and must have maximum 50 characters.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" class="text-left">
          <label for="address">Address:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="address" v-model="company.address" class="text-left"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errAddress">
        <b-col class="text-left text-danger">
          Address is required and must have maximum 50 characters.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="12" class="text-left">
          <label for="city">City:</label>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12" class="text-left">
          <b-form-select id="city" v-model="company.city_id">
            <option v-for="selected in cities"
                    :key="selected.id"
                    :value="selected.id"
            >
              {{ selected.post_code }} {{ selected.city }}
            </option>
          </b-form-select>
        </b-col>
      </b-row>
      <b-row v-if="errCity">
        <b-col class="text-left text-danger">
          City is required.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" class="text-left">
          <label for="email">Email:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="email" v-model="company.email" class="text-left"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errEmail">
        <b-col class="text-left text-danger">
          Email is required and must have maximum 50 characters.
        </b-col>
      </b-row>

      <b-row class="mt-5">
        <b-col>
          <b-button variant="primary" size="lg" @click="commit">Save</b-button>
        </b-col>
        <b-col>
          <b-button variant="danger" size="lg" @click="deleteCompany" v-if="company.id">Delete company</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import router from "@/router";

export default {
    name: "CompanyEdit",
    props: {
      company: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        newCompany: {
          id: ''
        },
        errCompanyNumber: false,
        errNationalID: false,
        errTaxNumber: false,
        errName: false,
        errAddress: false,
        errCity: false,
        errEmail: false
      }
    },
    mounted: function () {
      this.newCompany = this.company;
      this.load_cities();
    },
    computed: {
      ...mapState(['cities']),
    },
    methods: {
        ...mapActions(['new_company', 'change_company', 'delete_company', 'load_cities']),

        commit: function () {
          let err = false;
          if(this.company.number === undefined || this.company.number.length === 0 || this.company.number.length > 4) {
            this.errCompanyNumber = true;
            err = true;
          } else {
            this.errCompanyNumber = false;
          }
          if(this.company.national_id === undefined || this.company.national_id.length === 0 || this.company.national_id.length > 13) {
            this.errNationalID = true;
            err = true;
          } else {
            this.errNationalID = false;
          }
          if(this.company.tax_number === undefined || this.company.tax_number.length === 0 || this.company.national_id.length > 9) {
            this.errTaxNumber = true;
            err = true;
          } else {
            this.errTaxNumber = false;
          }
          if(this.company.name === undefined || this.company.name.length === 0 || this.company.name.length > 50) {
            this.errName = true;
            err = true;
          } else {
            this.errName = false;
          }
          if(this.company.address === undefined || this.company.address.length === 0 || this.company.address.length > 50) {
            this.errAddress = true;
            err = true;
          } else {
            this.errAddress = false;
          }
          if(this.company.city_id === undefined) {
            this.errCity = true;
            err = true;
          } else {
            this.errCity = false;
          }
          if(this.company.email === undefined || this.company.email.length === 0 || this.company.email.length > 50) {
            this.errEmail = true;
            err = true;
          } else {
            this.errEmail = false;
          }
          if(err)
            return;

          let req = {
            number: this.company.number,
            national_id: this.company.national_id,
            tax_number: this.company.tax_number,
            name: this.company.name,
            address: this.company.address,
            city_id: this.company.city_id,
            email: this.company.email
          }
          const r = JSON.stringify(req, (key, value) => {
            if(value === null) return "";
            else if(value === undefined) return null;
            return value;
          });

          if (!this.$route.params.id)
            this.new_company(r).then(() => {
              router.push({path: '/companies'});
            });
          else
            this.change_company({id: this.$route.params.id, company: r}).then(() => {
              router.push({path: '/companies'});
            });
        },

        deleteCompany: function () {
          this.delete_company({id: this.company.id}).then(() => {
            router.push({path: '/companies'});
          });
        }
    }
}
</script>

<style scoped>

</style>