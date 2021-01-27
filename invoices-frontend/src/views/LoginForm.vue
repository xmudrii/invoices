<template>
  <div>
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <Login/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Login from "@/components/Login";
import Header from "@/components/Header";
import { mapState, mapActions } from 'vuex';

export default {
  name: "LoginForm",
  components: {
    Header,
    Login
  },
  methods: {
    // ...mapActions(['load_city'])
  },
  computed: {
    // ...mapState(['cities'])
  },
}
</script>

<style scoped>

</style>