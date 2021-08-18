import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'

Vue.use(Vuex, VueCookies)

export default new Vuex.Store({
  state: {
    location: {
      locationKey: $cookies.get("locationKey") ? $cookies.get("locationKey") : null,
      locationName: $cookies.get("locationName") ? $cookies.get("locationName") : null,
      latitude: null,
      longitude: null,
      search: false
    },
    user: {
      ipAddress: null
    },
    notification: {
      error: false,
      succ: false,
      msg: "" 
    },
    api: {
      apiKey: "8gGk3slf4AwwSv9iJ2z875CiJZB5mVd8",
      lang: "fr-fr"
    },
    weather: {
      hourData: null,
      fiveDayData: null
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
