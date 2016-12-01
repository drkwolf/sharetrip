<template>
  <div id="map" style="width: 100%">
    <!--<div id="menu">-->
      <!--<place-input  @place_changed="start = $event" className="controls" label="Add a marker at this place" :select-first-on-enter="true" ></place-input>-->
      <!--<place-input @place_changed="end = $event"  className="controls" label="Add a marker at this place" :select-first-on-enter="true" ></place-input>-->
      <!--<button v-on:click="addWay"> Add </button>-->
      <!--<button v-on:click="reset"> Reset </button>-->
    <!--</div>-->

    <div id="map" style="width: 100%">
      <gmap id="map" ref='gmap' :center="center" :zoom="9" >
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
    name: 'gmap-map',
    components: {
      gmap: Map,
      gmarker: Marker,
      placeInput: PlaceInput
    },
    mounted: function () {
      let vm = this
      this.$nextTick(function () {
        loaded.then(function () {
          let mapObject = vm.$refs.gmap.$mapObject
          let directionsService = new window.google.maps.DirectionsService()
          let directionsDisplay = new window.google.maps.DirectionsRenderer()
          directionsDisplay.setMap(mapObject)

          vm.$store.commit('SET_MAP', mapObject)
          vm.$store.commit('SET_SERVICE', directionsService)
          vm.$store.commit('SET_DISPLAY', directionsDisplay)
//          console.log(mapObject)
//          vm.showRoute()
        })
      })
    },
    data: function () {
      return {
        center: {lat: 46.9480, lng: 7.44},
        markers: [{ position: {lat: 46, lng: 7.0} }, { position: {lat: 46.1, lng: 7.4} }]
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
