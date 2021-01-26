<template>
  <div>
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <CityEdit :city="city"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import CityEdit from "@/components/CityEdit";
import Header from "@/components/Header";
import { mapState, mapActions } from 'vuex';

export default {
  name: "CityForm",
  components: {
    Header,
    CityEdit
  },
  methods: {
    ...mapActions(['load_city'])
  },
  computed: {
    ...mapState(['cities']),

    city: function () {
      for (let i = 0; i < this.cities.length; i++)
        if (this.cities[i].id === parseInt(this.$route.params.id)) {
          this.load_city({id: this.cities[i].id});
          return this.cities[i];
        }
    }
  },
}
</script>

<style scoped>

</style>