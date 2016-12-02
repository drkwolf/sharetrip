<template>
  <div id="map" style="width: 100%">
    <!--<div id="menu">-->
      <!--<place-input  @place_changed="start = $event" className="controls" label="Add a marker at this place" :select-first-on-enter="true" ></place-input>-->
      <!--<place-input @place_changed="end = $event"  className="controls" label="Add a marker at this place" :select-first-on-enter="true" ></place-input>-->
      <!--<button v-on:click="addWay"> Add </button>-->
      <!--<button v-on:click="reset"> Reset </button>-->
    <!--</div>-->

    <div id="map" style="width: 100%">
      <gmap id="map" ref='gmap' :center="center" :zoom="12" @rightclick="newMarker" >
     </gmap>
    </div>
  </div>
</template>

<script>
  import {Map, PlaceInput, loaded} from 'vue2-google-maps'
  import clone from 'lodash/clone'

  export default {
    name: 'gmap-map',
    components: {
      gmap: Map,
      placeInput: PlaceInput
    },
    mounted: function () {
      let vm = this
      this.$nextTick(function () {
        loaded.then(function () {
          let mapObject = vm.$refs.gmap.$mapObject
          let directionsService = new window.google.maps.DirectionsService()
          let directionsDisplay = new window.google.maps.DirectionsRenderer(
            {
              draggable: true
            }
          )
          directionsDisplay.setMap(mapObject)

          vm.$store.commit('SET_MAP', mapObject)
          vm.$store.commit('SET_SERVICE', directionsService)
          vm.$store.commit('SET_DISPLAY', directionsDisplay)
//          console.log(mapObject)
//          vm.showRoute()
        })
      })
    },
    methods: {
      newMarker: function (mouseArgs) {
        this.addMarker(mouseArgs.latLng.lat(), mouseArgs.latLng.lng())
        this.showRoute()
      },
      addMarker: function (lat, lng) {
        let marker = {
          geometry: {
            location: {lat: lat, lng: lng}
          }
        }
        console.log('llll :' + this.markers.length)
        if (this.markers.length === 0) {
          this.markers.push(marker)
          this.marker.start = marker
          if (this.marker.id === 0) {
            this.$store.commit('ADD_WAY', this.marker)
            this.marker.id = this.$store.state.ways.uid
          } else {
            this.$store.commit('UPDATE_WAY', this.marker)
          }
        } else if (this.markers.length === 1) {
          this.markers.push(marker)
          this.marker.end = marker
          if (this.marker.id === 0) {
            this.$store.commit('ADD_WAY', this.marker)
            this.marker.id = this.$store.state.ways.uid
          } else {
            this.$store.commit('UPDATE_WAY', this.marker)
          }
        }
        console.log(this.marker)
//        this.markers.push({
//          position: { lat: 48.8538302, lng: 2.2982161 },
//          draggable: true,
//          enabled: true
//        })
//        return this.markers[this.markers.length - 1]
      },
      showRoute: function () {
        let state = this.$store.state
        let ways = clone(this.$store.state.ways)

        if (!ways.length) {
          state.display.set('directions', null)
          return
        }

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
      }
    },
    data: function () {
      return {
        center: {lat: 46.9480, lng: 7.44},
        marker: {
          id: 0,
          start: null,
          end: null
        },
        markers: []
      }
    }
  }
</script>

<style>
  #map, #app {
    height: 100%;
  }

  .controls {
    margin-top: 10px;
    border: 1px solid transparent;
    border-radius: 2px 0 0 2px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    height: 32px;
    outline: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  input['text'] {
    background-color: #fff;
    font-family: Roboto;
    font-size: 15px;
    font-weight: 300;
    margin-left: 12px;
    padding: 0 11px 0 13px;
    text-overflow: ellipsis;
    width: 180px;
  }

</style>
