<template>
  <b-container fluid>
    <b-form>
      <b-row class="mt-2">
        <b-col sm="2" class="text-left">
          <label for="username">Username:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="username" v-model="newLogin.username" class="text-left"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errUsername">
        <b-col class="text-left text-danger">
          Username is required.
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col sm="2" class="text-left">
          <label for="password">Password:</label>
        </b-col>
        <b-col sm="3">
          <b-input id="password" v-model="newLogin.password" class="text-left" type="password"></b-input>
        </b-col>
      </b-row>
      <b-row v-if="errPassword">
        <b-col class="text-left text-danger">
          Password is required.
        </b-col>
      </b-row>

      <b-row class="mt-5">
        <b-col>
          <b-button variant="primary" size="lg" @click="onLogin">Login</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import { mapActions } from 'vuex';
import router from "@/router";

export default {
    name: "Login",
    data() {
      return {
        newLogin: {
          username: '',
          password: ''
        },
        errUsername: false,
        errPassword: false
      }
    },
    methods: {
        ...mapActions(['login']),

        onLogin: function () {
          let err = false;
          if(this.newLogin.username === undefined || this.newLogin.username.length === 0) {
            this.errUsername = true;
            err = true;
          } else {
            this.errUsername = false;
          }
          if(this.newLogin.password === undefined || this.newLogin.password.length === 0) {
            this.errPassword = true;
            err = true;
          } else {
            this.errPassword = false;
          }
          if(err)
            return;

          let req = {
            username: this.newLogin.username,
            password: this.newLogin.password
          }
          const r = JSON.stringify(req, (key, value) => {
            if(value === null) return "";
            else if(value === undefined) return null;
            return value;
          });

          this.login(r);
        }
    }
}
</script>

<style scoped>

</style>