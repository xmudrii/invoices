<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <CitiesList/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header";
import CitiesList from "@/components/CitiesList";
import {mapActions} from "vuex";

export default {
  name: "Cities",
  components: {
    Header,
    CitiesList
  },
  methods: {
    ...mapActions(['load_cities'])
  },
  mounted: function() {
    this.load_cities();
  }
}
</script>

<style scoped>

</style>