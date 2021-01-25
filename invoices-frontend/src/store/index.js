import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    invoices: [],
    invoice_items: [],
    companies: [],
    mycompany: [],
    cities: [],
    taxrates: []
  },
  mutations: {
    /**
     * Invoices mutations
     */
    set_invoices: function (state, invoices) {
      state.invoices = invoices;
    },
    add_invoice: function (state, invoice) {
      state.invoices.push(invoice);
    },
    remove_invoice: function (state, id) {
      for (let r = 0; r < state.invoices.length; r++) {
        if (state.invoices[r].id === id) {
          state.invoices.splice(r, 1);
          break;
        }
      }
    },
    update_invoice: function (state, payload) {
      for (let r = 0; r < state.invoices.length; r++) {
        if (state.invoices[r].id === parseInt(payload.id)) {
          // TODO: Implement.
          //state.racuni[r].RacunID = payload.racun.RacunID;
          break;
        }
      }
    },

    /**
     * Invoices mutations
     */
    set_invoice_items: function (state, invoice_items) {
      state.invoice_items = invoice_items;
    },
    add_invoice_item: function (state, invoice_item) {
      state.invoice_items.push(invoice_item);
    },
    remove_invoice_item: function (state, id) {
      for (let r = 0; r < state.invoice_items.length; r++) {
        if (state.invoice_items[r].id === id) {
          state.invoice_items.splice(r, 1);
          break;
        }
      }
    },
    update_invoice_item: function (state, payload) {
      for (let r = 0; r < state.invoice_items.length; r++) {
        if (state.invoice_items[r].id === parseInt(payload.id)) {
          // TODO: Implement.
          //state.racuni[r].RacunID = payload.racun.RacunID;
          break;
        }
      }
    },

    /**
     * Companies mutations
     */
    set_companies: function (state, companies) {
      state.companies = companies;
    },
    add_company: function (state, company) {
      state.companies.push(company);
    },
    remove_company: function (state, id) {
      for (let r = 0; r < state.companies.length; r++) {
        if (state.companies[r].id === id) {
          state.companies.splice(r, 1);
          break;
        }
      }
    },
    update_company: function (state, payload) {
      for (let r = 0; r < state.companies.length; r++) {
        if (state.companies[r].id === parseInt(payload.id)) {
          // TODO: Implement.
          //state.companies[r].RacunID = payload.company.RacunID;
          break;
        }
      }
    },

    /**
     * My Commpany mutations
     */
    set_mycompany: function (state, mycompany) {
      state.mycompany = mycompany;
    },
    update_mycompany: function (state, payload) {
      // TODO: Implement.
    },

    /**
     * Cities mutations
     */
    set_cities: function (state, cities) {
      state.cities = cities;
    },
    add_city: function (state, city) {
      state.cities.push(city);
    },
    remove_city: function (state, id) {
      for (let r = 0; r < state.cities.length; r++) {
        if (state.cities[r].id === id) {
          state.cities.splice(r, 1);
          break;
        }
      }
    },
    update_city: function (state, payload) {
      for (let r = 0; r < state.cities.length; r++) {
        if (state.cities[r].id === parseInt(payload.id)) {
          // TODO: Implement.
          //state.cities[r].RacunID = payload.company.RacunID;
          break;
        }
      }
    },

    /**
     * Tax rates mutations
     */
    set_taxrates: function (state, taxrates) {
      state.taxrates = taxrates;
    },
    add_taxrate: function (state, taxrate) {
      state.taxrates.push(taxrate);
    },
    remove_taxrate: function (state, id) {
      for (let r = 0; r < state.taxrates.length; r++) {
        if (state.taxrates[r].id === id) {
          state.taxrates.splice(r, 1);
          break;
        }
      }
    },
    update_taxrate: function (state, payload) {
      for (let r = 0; r < state.taxrates.length; r++) {
        if (state.taxrates[r].id === parseInt(payload.id)) {
          // TODO: Implement.
          //state.taxrates[r].RacunID = payload.company.RacunID;
          break;
        }
      }
    },
  },
  actions: {
    load_invoices: function ({ commit }) {
      fetch(`${this._vm.$apiEndpoint}api/invoices`, { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('set_invoices', jsonData)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            // TODO: Alert umesto console.log.
            console.log(errorMessage);
            // alert(errorMessage);
          });
        else {
          // TODO: Alert umesto console.log.
          console.log(error);
          // alert(error);
        }
      });
    },

    load_invoice_items: function ({ commit }, payload) {
      fetch(`${this._vm.$apiEndpoint}api/invoices/${payload.invoice.id}/items`, { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('set_invoice_items', jsonData)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            // TODO: Alert umesto console.log.
            console.log(errorMessage);
            // alert(errorMessage);
          });
        else {
          // TODO: Alert umesto console.log.
          console.log(error);
          // alert(error);
        }
      });
    },
  }
})
