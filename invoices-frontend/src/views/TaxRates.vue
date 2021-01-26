<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <TaxRatesList/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header";
import TaxRatesList from "@/components/TaxRatesList";
import {mapActions} from "vuex";

export default {
  name: "TaxRates",
  components: {
    Header,
    TaxRatesList
  },
  methods: {
    ...mapActions(['load_tax_rates'])
  },
  mounted: function() {
    this.load_tax_rates();
  }
}
</script>

<style scoped>

</style>