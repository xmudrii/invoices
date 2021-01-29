<template>
  <div>
    <Header/>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Cookies from 'js-cookie';
import router from "@/router";

export default {
  name: "LoginForm",
  components: {
    Header
  },
  mounted: function () {
    Cookies.remove('authorization');
    router.push({path: `/login`});
  },
}
</script>

<style scoped>

</style>
