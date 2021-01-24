<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <InvoicesList/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header";
import InvoicesList from "@/components/InvoicesList";

export default {
  name: "Home",
  components: {
    Header,
    InvoicesList
  }
}
</script>

<style scoped>

</style>