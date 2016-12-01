import Vue from 'vue'
import App from './App'
import * as VueGoogleMaps from 'vue2-google-maps'
import Vuex from 'vuex'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDo2CwK7E9CtZq0mo7gz6PS9ctw7dFKHj0',
    v: '3.26',
    libraries: 'places'
  }
})

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    map: null,
    service: null,
    display: null,
    ways: [],
    uid: 0
  },
  mutations: {
    SET_MAP (state, map) {
      state.map = map
    },
    SET_SERVICE (state, service) {
      state.service = service
    },
    SET_DISPLAY (state, display) {
      state.display = display
    },
    ADD_WAY (state, data) {
      data.id = state.uid + 1
      state.uid += 1
      console.log(state.ways.length)
      state.ways.push(data)
      console.log(state.ways.length)
      console.log(data.id)
    },
    DEL_WAY (state, way) {
      state.ways.splice(this.ways.indexOf(way), 1)
      state.uid -= 1
    },
    RESET_WAY (state) {
      state.uid = 0
      state.ways = []
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
