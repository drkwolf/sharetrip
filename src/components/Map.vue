<template>
  <div>
    <div id="menu">
      <place-input  @place_changed="start = $event" className="controls" label="Add a marker at this place" :select-first-on-enter="true" ></place-input>
      <place-input @place_changed="end = $event"  className="controls" label="Add a marker at this place" :select-first-on-enter="true" ></place-input>
      <button v-on:click="addWay"> Add </button>
      <button v-on:click="reset"> Reset </button>
    </div>

    <div style="width: 100%; height: 400px;">
      <gmap ref='gmap' :center="center" :zoom="9" >
        <gmarker
          v-for="m in markers"
          :position="m.position"
          :clickable="true"
          :draggable="true"
          @click="center=m.position"
        ></gmarker>
      </gmap>
    </div>
  </div>
</template>

<script>
  import {Marker, Map, PlaceInput, loaded} from 'vue2-google-maps'

  const STORAGE_KEY = 'stripshare'
  const localStorage = window.localStorage
  let directionsService
  let directionsDisplay
  let mapObject

  let waysStorage = {
    fetch: function () {
      var ways = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      ways.forEach(function (way, index) {
        way.id = index
      })
      waysStorage.uid = ways.length
      return ways
    },
    save: function (ways) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ways))
    }
  }

  export default {
//    name: 'gmap-map',
    components: {
      gmap: Map,
      gmarker: Marker,
      placeInput: PlaceInput
    },
    mounted: function () {
      let vm = this
      this.$nextTick(function () {
        loaded.then(function () {
          mapObject = vm.$refs.gmap.$mapObject
//          console.log(mapObject)
          directionsService = new window.google.maps.DirectionsService()
          directionsDisplay = new window.google.maps.DirectionsRenderer()
          directionsDisplay.setMap(mapObject)
          vm.showRoute()
        })
      })
    },
    data () {
      return {
        center: {lat: 46.9480, lng: 7.44},
        markers: [{ position: {lat: 46, lng: 7.0} }, { position: {lat: 46.1, lng: 7.4} }],
        start: '',
        end: '',
        ways: waysStorage.fetch()
      }
    },
    methods: {
      addWay: function () {
        var start = this.start
        var end = this.end
        console.log('xxx')
        console.log(start)
        if (!start || !end) {
          return
        }
        this.ways.push({
          id: waysStorage.uid++,
          start: start,
          end: end
        })
        waysStorage.save(this.ways)
        // add calculatedirection
        this.showRoute()
        this.start = ''
        this.end = ''
      },
      reset: function () {
        window.localStorage.removeItem(STORAGE_KEY)
      },
      removeWay: function (way) {
        this.ways.splice(this.ways.indexOf(way), 1)
      },
      updateStart (place) {
        this.start = place
//        if (place && place.geometry && place.geometry.location) {
//          var marker = this.addmarker()
//          marker.position.lat = place.geometry.location.lat()
//          marker.position.lng = place.geometry.location.lng()
//        }
      },
      showRoute: function () {
        let waypts = []
        let ways = waysStorage.fetch()
        console.log(ways)
        let startEnd = ways.shift()
        console.log(ways)

        ways.forEach(function (pts) {
          console.log(pts)
          waypts.push({
            location: pts.start.geometry.location,
            stopover: true
          })
          waypts.push({
            location: pts.end.geometry.location,
            stopover: true
          })
        })

        console.log(startEnd)

        directionsService.route({
          origin: startEnd.start.geometry.location,
          destination: startEnd.end.geometry.location,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: 'DRIVING'
        }, function (response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response)
            var route = response.routes[0]
            console.log(route)
          } else {
            window.alert('Directions request failed due to ' + status)
          }
        })
      }
    }
  }
</script>

<style>
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
