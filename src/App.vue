<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
  <header class="mdl-layout__header">
    <div class="mdl-layout__header-row">
      <!-- Title -->
      <span class="mdl-layout-title">Title</span>
      <!-- Add spacer, to align navigation to the right -->
      <div class="mdl-layout-spacer"></div>
      <!-- Navigation. We hide it in small screens. -->
      <nav class="mdl-navigation mdl-layout--large-screen-only">
        <!--<a class="mdl-navigation__link" href="">Link</a>-->
      </nav>
    </div>
  </header>
    <panel></panel>
    <main class="mdl-layout__content">
      <div id="app" class="page-content">
        <!-- Your content goes here -->
        <gmap></gmap>
      </div>
  </main>
</template>

<script>
  import Gmap from './components/Map'
  import Panel from './components/Panel'

  export default {
    name: 'app',
    components: {
      Gmap,
      Panel
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
