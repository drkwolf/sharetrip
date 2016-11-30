import Vue from 'vue'
import App from './App'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDo2CwK7E9CtZq0mo7gz6PS9ctw7dFKHj0',
    v: '3.26',
    libraries: 'places'
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
