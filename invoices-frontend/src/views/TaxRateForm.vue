<template>
  <div>
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <TaxRateEdit :taxrate="taxrate"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import TaxRateEdit from "@/components/TaxRateEdit";
import Header from "@/components/Header";
import { mapState, mapActions } from 'vuex';

export default {
  name: "TaxRateForm",
  components: {
    Header,
    TaxRateEdit
  },
  computed: {
    ...mapState(['taxrates']),

    taxrate: function () {
      for (let i = 0; i < this.taxrates.length; i++)
        if (this.taxrates[i].id === parseInt(this.$route.params.id))
          return this.taxrates[i];
    }
  },
}
</script>

<style scoped>

</style>