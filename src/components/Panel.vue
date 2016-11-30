<template>
  <div class="mdl-layout__drawer">
    <span class="mdl-layout-title">Title</span>
    <nav class="mdl-navigation">
      <!--<a class="mdl-navigation__link" href="">Link</a>-->
      <place-input  @place_changed="start = $event" className="controls" label="Add a marker at this place" :select-first-on-enter="true" ></place-input>
      <place-input @place_changed="end = $event"  className="controls" label="Add a marker at this place" :select-first-on-enter="true" ></place-input>
      <button v-on:click="addWay"> Add </button>
      <button v-on:click="reset"> Reset </button>

    </nav>
  </div>
</template>


<script>
  import {PlaceInput} from 'vue2-google-maps'
  export default {
    name: 'panel',
    components: {
      placeInput: PlaceInput
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
