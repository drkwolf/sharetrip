<template>
  <div class="mdl-layout__drawer">
    <span class="mdl-layout-title">Tripshare</span>
    <nav class="mdl-navigation">
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <place-input defaultPlace="Zurich, Switzerland" ref=placeStart @place_changed="start=$event"  className="mdl-textfield__input" :select-first-on-enter="true"></place-input>
          <label class="mdl-textfield__label" for="input-origin">Origine</label>
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <place-input defaultPlace="Geneva, Switzerland" ref=placeEnd @place_changed="end=$event"  className="mdl-textfield__input" :select-first-on-enter="true"></place-input>
          <label class="mdl-textfield__label" for="input-dest">Destination</label>
        </div>
        <!-- Raised button with ripple -->
        <button v-on:click="addWay" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
          Add
        </button>
        <button v-on:click="reset" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
          reset
        </button>
    </nav>
    <ul class="demo-list-item mdl-list">
      <li v-for="way in state.ways" class="mdl-list__item">
        <span class="mdl-list__item-primary-content">
          <i class="material-icons mdl-list__item-icon">person</i>user{{ way.id }}
        </span>
        <div style="display=inline;">
          <ul>
            <!--<li> origin: {{ way.start.formatted_address}} </li>-->
            <!--<li> destination: {{ way.end.formatted_address}} </li>-->
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>


<script>
  import {PlaceInput} from 'vue2-google-maps'
  import clone from 'lodash/clone'

  export default {
    name: 'panel',
    components: {
      placeInput: PlaceInput
    },
    data () {
      return {
        start: '',
        end: '',
        state: this.$store.state
//        store: this.$store
      }
    },
    methods: {
      addWay: function () {
        var start = this.start
        var end = this.end
        if (!start || !end) return
        this.$store.commit('ADD_WAY', {start: start, end: end})
        // FIXME update inputs
        this.$refs.placeStart.$el.getElementsByTagName('input')[0].value = ''
        this.$refs.placeEnd.$el.getElementsByTagName('input')[0].value = ''
        this.showRoute()
      },
      reset: function () {
        this.$store.commit('RESET_WAY')
        this.showRoute()
      },
      removeWay: function (way) {
        this.$store.commit('DEL_WAY')
      },
      showRoute: function () {
        let state = this.state
        let ways = clone(this.$store.state.ways)

        if (!ways.length) {
          state.display.set('directions', null)
          return
        }
//        console.log(ways)

        let startEnd = ways.shift()
        let waypts = []
        ways.forEach(function (pts) {
          if (pts.start) {
            waypts.push({
              location: pts.start.geometry.location,
              stopover: true
            })
          }
          if (pts.end) {
            waypts.push({
              location: pts.end.geometry.location,
              stopover: true
            })
          }
        })

        state.service.route({
          origin: startEnd.start.geometry.location,
          destination: startEnd.end.geometry.location,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: 'DRIVING'
        }, function (response, status) {
          if (status === 'OK') {
            state.display.setDirections(response)
            var route = response.routes[0]
            console.log(route)
          } else {
            window.alert('Directions request failed due to ' + status)
          }
        })
      },
      computeTotalDistance: function (result) {
        var total = 0
        var myroute = result.routes[0]
        for (var i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value
        }
        total = total / 1000
        document.getElementById('total').innerHTML = total + ' km'
      }
    }
  }
</script>

<style>
  .mdl-layout__drawer {
    width: 500px;
    left: -250px;
  }

  .mdl-layout__drawer.is-visible {
    left: 0;
  }
</style>
