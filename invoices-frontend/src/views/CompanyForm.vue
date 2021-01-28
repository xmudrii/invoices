<template>
  <div>
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <CompanyEdit :company="company"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import CompanyEdit from "@/components/CompanyEdit";
import Header from "@/components/Header";
import { mapState, mapActions } from 'vuex';

export default {
  name: "CompanyForm",
  components: {
    Header,
    CompanyEdit
  },
  computed: {
    ...mapState(['companies']),

    company: function () {
      for (let i = 0; i < this.companies.length; i++)
        if (this.companies[i].id === parseInt(this.$route.params.id))
          return this.companies[i];
    }
  },
}
</script>

<style scoped>

</style>