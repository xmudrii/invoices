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
          state.invoices[r].number = payload.invoice.number;
          state.invoices[r].date = payload.invoice.date;
          state.invoices[r].date_from = payload.invoice.date_from;
          state.invoices[r].date_to = payload.invoice.date_to;
          state.invoices[r].company_id = payload.invoice.company_id;
          state.invoices[r].remarks = payload.invoice.remarks;
          state.invoices[r].created_at = payload.invoice.created_at;
          state.invoices[r].updated_at = payload.invoice.updated_at;
          state.invoices[r].company_name = payload.invoice.company_name;
          state.invoices[r].total = payload.invoice.total;
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
          state.invoice_items[r].description = payload.invoice_item.description;
          state.invoice_items[r].unit = payload.invoice_item.unit;
          state.invoice_items[r].count = payload.invoice_item.count;
          state.invoice_items[r].price = payload.invoice_item.price;
          state.invoice_items[r].tax_rate_id = payload.invoice_item.tax_rate_id;
          state.invoice_items[r].created_at = payload.invoice_item.created_at;
          state.invoice_items[r].updated_at = payload.invoice_item.updated_at;
          state.invoice_items[r].base_total = payload.invoice_item.base_total;
          state.invoice_items[r].tax_value = payload.invoice_item.tax_value;
          state.invoice_items[r].tax_total = payload.invoice_item.tax_total;
          state.invoice_items[r].total = payload.invoice_item.total;
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
            alert(errorMessage);
          });
        else {
          alert(error);
        }
      });
    },

    load_invoice: function ({ commit }, payload) {
      fetch(`${this._vm.$apiEndpoint}api/invoices/${payload.id}`, { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('update_invoice', {id: payload.id, invoice: jsonData});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
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
            alert(errorMessage);
          });
        else {
          alert(error);
        }
      });
    },

    load_companies: function ({ commit }) {
      fetch(`${this._vm.$apiEndpoint}api/companies`, { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('set_companies', jsonData)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else {
          alert(error);
        }
      });
    },

    load_tax_rates: function ({ commit }) {
      fetch(`${this._vm.$apiEndpoint}api/taxrates`, { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('set_taxrates', jsonData)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else {
          alert(error);
        }
      });
    },

    new_invoice: function({ commit }, invoice) {
      // TODO: Validation
      fetch(`${this._vm.$apiEndpoint}api/invoices`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: invoice
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('add_invoice', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    change_invoice: function({ commit }, payload) {
      // TODO: Validation
      fetch(`${this._vm.$apiEndpoint}api/invoices/${payload.id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload.invoice
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('update_invoice', {id: payload.id, invoice: jsonData});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    delete_invoice: function({ commit }, payload) {
      // TODO: Validation
      fetch(`${this._vm.$apiEndpoint}api/invoices/${payload.id}`, {
        method: 'delete',
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('remove_invoice', payload.id);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    new_invoice_item: function({ commit }, payload) {
      // TODO: Validation
      fetch(`${this._vm.$apiEndpoint}api/invoices/${payload.invoice_id}/items`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload.invoice_item
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('add_invoice_item', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    change_invoice_item: function({ commit }, payload) {
      // TODO: Validation
      fetch(`${this._vm.$apiEndpoint}api/invoices/item/${payload.id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload.invoice_item
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('update_invoice_item', {id: payload.id, invoice_item: jsonData});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    delete_invoice_item: function({ commit }, payload) {
      // TODO: Validation
      fetch(`${this._vm.$apiEndpoint}api/invoices/item/${payload.id}`, {
        method: 'delete',
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('delete_invoice_item', payload.id);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
  }
})
