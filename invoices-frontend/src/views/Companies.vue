<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <CompaniesList/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header";
import CompaniesList from "@/components/CompaniesList";
import {mapActions} from "vuex";

export default {
  name: "Companies",
  components: {
    Header,
    CompaniesList
  },
  methods: {
    ...mapActions(['load_companies'])
  },
  mounted: function() {
    this.load_companies();
  }
}
</script>

<style scoped>

</style>