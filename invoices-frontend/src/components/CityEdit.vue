<template>
  <b-container fluid>
    <b-form>
      <b-row class="mt-2">
        <b-col sm="2" class="text-left">
          <label for="post_code">Post code:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="post_code" v-model="city.post_code" class="text-right"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errPostCode">
        <b-col class="text-left text-danger">
          Post code is required and must have maximum 5 characters.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" class="text-left">
          <label for="city">City:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="city" v-model="city.city" class="text-left"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errCity">
        <b-col class="text-left text-danger">
          City is required and must have maximum 50 characters.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" class="text-left">
          <label for="country">Country:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="country" v-model="city.country" class="text-left"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errCountry">
        <b-col class="text-left text-danger">
          Country is required and must have maximum 50 characters.
        </b-col>
      </b-row>

      <b-row class="mt-5">
        <b-col>
          <b-button variant="primary" size="lg" @click="commit">Save</b-button>
        </b-col>
        <b-col>
          <b-button variant="danger" size="lg" @click="deleteCity" v-if="city.id">Delete city</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import { mapActions } from 'vuex';
import router from "@/router";

export default {
    name: "CityEdit",
    props: {
      city: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        newCity: {
          id: ''
        },
        errPostCode: false,
        errCity: false,
        errCountry: false
      }
    },
    mounted: function () {
      this.newCity = this.city;
    },
    methods: {
        ...mapActions(['new_city', 'change_city', 'delete_city']),

        commit: function () {
          let err = false;
          if(this.city.post_code === undefined || this.city.post_code.length === 0 || this.city.post_code.length > 5) {
            this.errPostCode = true;
            err = true;
          } else {
            this.errPostCode = false;
          }
          if(this.city.city === undefined || this.city.city.length === 0 || this.city.city.length > 50) {
            this.errCity = true;
            err = true;
          } else {
            this.errCity = false;
          }
          if(this.city.country === undefined || this.city.country.length === 0 || this.city.country.length > 50) {
            this.errCountry = true;
            err = true;
          } else {
            this.errCountry = false;
          }
          if(err)
            return;

          let req = {
            post_code: this.city.post_code,
            city: this.city.city,
            country: this.city.country
          }
          const r = JSON.stringify(req, (key, value) => {
            if(value === null) return "";
            else if(value === undefined) return null;
            return value;
          });

          if (!this.$route.params.id)
            this.new_city(r).then(() => {
              router.push({path: '/cities'});
            });
          else
            this.change_city({id: this.$route.params.id, city: r}).then(() => {
              router.push({path: '/cities'});
            });
        },

        deleteCity: function () {
          this.delete_city({id: this.city.id}).then(() => {
            router.push({path: '/cities'});
          });
        }
    }
}
</script>

<style scoped>

</style>