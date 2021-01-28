import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    invoices: [],
    invoice_items: [],
    companies: [],
    cities: [],
    taxrates: [],
    users: []
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
          state.invoices[r].company_name = payload.invoice.company_name;
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
          state.companies[r].number = payload.company.number;
          state.companies[r].name = payload.company.name;
          state.companies[r].national_id = payload.company.national_id;
          state.companies[r].tax_number = payload.company.tax_number;
          state.companies[r].address = payload.company.address;
          state.companies[r].city_id = payload.company.city_id;
          state.companies[r].email = payload.company.email;
          state.companies[r].created_at = payload.company.created_at;
          state.companies[r].updated_at = payload.company.updated_at;
          state.companies[r].city = payload.company.city;
          state.companies[r].post_code = payload.company.post_code;
          break;
        }
      }
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
          state.cities[r].post_code = payload.city.post_code;
          state.cities[r].city = payload.city.city;
          state.cities[r].country = payload.city.country;
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
          state.taxrates[r].name = payload.taxrate.name;
          state.taxrates[r].value = payload.taxrate.value;
          break;
        }
      }
    },

    /**
     * Users mutations
     */
    set_users: function (state, users) {
      state.users = users;
    },
    add_user: function (state, user) {
      state.users.push(user);
    },
    remove_user: function (state, id) {
      for (let r = 0; r < state.users.length; r++) {
        if (state.users[r].id === id) {
          state.users.splice(r, 1);
          break;
        }
      }
    },
    update_user: function (state, payload) {
      for (let r = 0; r < state.users.length; r++) {
        if (state.users[r].id === parseInt(payload.id)) {
          state.users[r].username = payload.user.username;
          state.users[r].email = payload.user.email;
          state.users[r].name = payload.user.name;
          state.users[r].surname = payload.user.surname;
          state.users[r].is_admin = payload.user.is_admin;
          state.users[r].is_active = payload.user.is_active;
          break;
        }
      }
    }
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

    load_cities: function ({ commit }) {
      fetch(`${this._vm.$apiEndpoint}api/cities`, { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('set_cities', jsonData)
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

    new_company: function({ commit }, company) {
      fetch(`${this._vm.$apiEndpoint}api/companies`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: company
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('add_company', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    change_company: function({ commit }, payload) {
      fetch(`${this._vm.$apiEndpoint}api/companies/${payload.id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload.company
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('update_company', {id: payload.id, company: jsonData});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    delete_company: function({ commit }, payload) {
      fetch(`${this._vm.$apiEndpoint}api/companies/${payload.id}`, {
        method: 'delete',
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('remove_company', payload.id);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    new_city: function({ commit }, city) {
      fetch(`${this._vm.$apiEndpoint}api/cities`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: city
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('add_city', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    change_city: function({ commit }, payload) {
      fetch(`${this._vm.$apiEndpoint}api/cities/${payload.id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload.city
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('update_city', {id: payload.id, city: jsonData});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    delete_city: function({ commit }, payload) {
      fetch(`${this._vm.$apiEndpoint}api/cities/${payload.id}`, {
        method: 'delete',
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('remove_city', payload.id);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    new_tax_rate: function({ commit }, taxrate) {
      fetch(`${this._vm.$apiEndpoint}api/taxrates`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: taxrate
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('add_taxrate', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    change_tax_rate: function({ commit }, payload) {
      fetch(`${this._vm.$apiEndpoint}api/taxrates/${payload.id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload.taxrate
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('update_taxrate', {id: payload.id, taxrate: jsonData});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    delete_tax_rate: function({ commit }, payload) {
      fetch(`${this._vm.$apiEndpoint}api/taxrates/${payload.id}`, {
        method: 'delete',
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('remove_taxrate', payload.id);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    login: function ({ commit }, payload) {
      console.log(`${this._vm.$apiEndpoint}login`);
      console.log(payload);
      fetch(`${this._vm.$apiEndpoint}login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload
      }).then((response) => {
        if (!response.ok)
          throw response;

        console.log(response);
        return response;
      }).then((resp) => {
        // TODO: Implementation.
        // There's a problem with CORS that might be solved by building the app and moving
        // it to the backend.
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    }
  }
})
