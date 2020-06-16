<template>
  <div id="app" class="relative bg-gray-900 h-screen">
    <div class="container mx-auto flex justify-center items-center h-32">
      <img alt="GMC Jam Player" src="./assets/logo.png">
    </div>
    <EntriesManager :entries="entries"/>
  </div>
</template>

<script>
import EntriesManager from './components/EntriesManager.vue'

export default {
  name: 'App',
  data(){
    return {
      entries: []
    }
  },
  components: {
    EntriesManager
  },
  mounted: function(){
    this.entries = window.ipcRenderer.sendSync('synchronous-message', 'ping')
  }
}
</script>

<style>

</style>
