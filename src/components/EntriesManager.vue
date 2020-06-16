<template>
  <div class="w-full px-4 flex justify-between items-start h-full -mt-32 pt-32 py-4">
    <div class="w-2/3 container mx-auto h-full grid grid-rows-6">
      <div class="h-full row-span-2 px-2 text-white">
        <div>
          <best-of-entry class="mx-auto w-1/2 px-2 py-2" category="theme" @selected="selected=$event" :entry.sync="bests.theme" :entries="entries">Best use of Theme</best-of-entry>
        </div>
        <div class="flex flex-row flex-wrap justify-center items-center">
          <best-of-entry class="w-1/2 px-2 py-2" category="concept" :entry.sync="bests.concept" :entries="entries"></best-of-entry>
          <best-of-entry class="w-1/2 px-2 py-2" category="presentation" :entry.sync="bests.presentation" :entries="entries"></best-of-entry>
          <best-of-entry class="w-1/2 px-2 py-2" category="story" :entry.sync="bests.story" :entries="entries"></best-of-entry>
          <best-of-entry class="w-1/2 px-2 py-2" category="devlog" :entry.sync="bests.devlog" :entries="entries"></best-of-entry>
        </div>
      </div>
      <div class="h-full row-span-1 flex flex-col justify-end items-start pb-2">
        <h2 class="text-2xl font-semibold leading-tight text-white">Entries</h2>
        <div class="flex sm:flex-row flex-col">
          <div class="flex flex-row mb-1 sm:mb-0">
            <div class="relative">
              <select v-model="filterGroup"
                      class="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
                <option value="all">All</option>
                <option value="played">Played</option>
                <option value="unplayed">Unplayed</option>
                <option value="ranked">Ranked</option>
                <option value="unranked">Unranked</option>
              </select>
              <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="block relative">
                            <span class="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current text-gray-500">
                                    <path
                                            d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                                    </path>
                                </svg>
                            </span>
            <input placeholder="Search"
                   name="search"
                   v-model="search"
                   class="appearance-none rounded-r rounded-l sm:rounded-l-none sm:rounded-r-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
          </div>
          <div class="block relative">
            <button v-bind:class="[sortMethod === 1 ? sortClass : '']" @click="sortDirection *= -1; sortMethod = 1;" class="flex flex-row justify-center items-center appearance-none rounded-r rounded-l sm:rounded-l-none sm:rounded-r-none border border-gray-400 border-b block px-3 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" >
              <span class="pr-2"><svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M1 4h2v2H1V4zm4 0h14v2H5V4zM1 9h2v2H1V9zm4 0h14v2H5V9zm-4 5h2v2H1v-2zm4 0h14v2H5v-2z"/></svg></span>
              {{ sortDirection == -1 ? "A-Z" : "Z-A" }}</button>
          </div>
          <div class="block relative">
            <button v-bind:class="[sortMethod === -1 ? sortClass : '']" @click="rankDirection *= -1; sortMethod = -1;" class="flex flex-row justify-center items-center appearance-none rounded-r rounded-l sm:rounded-l-none sm:rounded-r border border-gray-400 border-b block px-3 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" >
              <span class="pr-2"><svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M15 9a3 3 0 0 0 3-3h2a5 5 0 0 1-5.1 5 5 5 0 0 1-3.9 3.9V17l5 2v1H4v-1l5-2v-2.1A5 5 0 0 1 5.1 11H5a5 5 0 0 1-5-5h2a3 3 0 0 0 3 3V4H2v2H0V2h5V0h10v2h5v4h-2V4h-3v5z"/></svg></span>
              {{ rankDirection == -1 ? "1-100" : "100-1" }}</button>
          </div>
        </div>
      </div>
      <div class="h-full row-span-3 pr-8">
        <div class="w-full h-full pr-8 pb-2 overflow-auto">
          <div class="w-full flex flex-row flex-wrap h-full py-4justify-start items-start content-start">
            <div v-for="entry in filteredEntries" :key="entry.name" class="w-1/3 pr-2 py-2">
              <div draggable @dragstart="startDrag($event, entry)" @click="selected = entry" class="box-content rounded text-center select-none" v-bind:class="[entry == selected ? activeClass : 'bg-blue-100 m-1']" >
                <div class="grid grid-rows-2">
                  <div class="py-2 h-16 flex justify-start items-center flex-col row-span-1">
                    <h2 class="text-xs font-semibold">{{ entry.name }}</h2>
                    <span class="text-xs text-gray-600">by&nbsp;{{ entry.author }}</span>
                  </div>
                  <div class="grid grid-cols-6 row-span-1">
                    <div class="flex flex-col justify-center items-start text-xs text-gray-600 pl-3 col-span-5">
                      <span>{{ entry.played ? "Played" : "Unplayed"}}</span>
                      <span class="flex justify-center items-center"><span class="pr-1"><svg class="h-2 w-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M15 9a3 3 0 0 0 3-3h2a5 5 0 0 1-5.1 5 5 5 0 0 1-3.9 3.9V17l5 2v1H4v-1l5-2v-2.1A5 5 0 0 1 5.1 11H5a5 5 0 0 1-5-5h2a3 3 0 0 0 3 3V4H2v2H0V2h5V0h10v2h5v4h-2V4h-3v5z"/></svg></span>{{ entry.ranked ? entry.rank  : "Unranked" }}</span>
                    </div>
                    <div class="flex flex-col justify-center items-center text-black col-span-1">
                      <button @click="upvote(entry)"><svg class="text-green-800 h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10.707 7.05L10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z"/></svg></button>
                      <button @click="downvote(entry)"><svg class="text-red-800 h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/3 h-full">
      <div class="bg-white h-full flex flex-col justify-between" v-if="selected !== null">
        <div class="h-full text-center pt-2 grid grid-rows-6 grid-flow-row grid-cols-1">
          <div class="w-full row-span-1 flex justify-center items-center flex-col">
            <h2 class="text-lg font-semibold">{{ selected.name }}</h2>
            <span class="text-xs text-gray-600">{{ selected.author }}</span>
          </div>
          <div class="w-full h-full row-span-2">
            <img class="w-full object-cover h-full" src="https://placehold.it/640x480?text=Screenshot">
          </div>
          <div class="w-full h-full row-span-2 px-4" v-if="selected.readme">
            <h3 class="py-4">Readme</h3>
            <div class="w-full h-full overflow-auto">
              <pre class="text-sm mt-2 border-gray-400 border-t pt-2">{{ selected.readme }}</pre>
            </div>
          </div>
          <div class="h-full row-span-2" v-else>
            <p class="py-4">No Readme found.</p>
          </div>
          <div class="px-4 row-span-1 flex flex-col justify-end items-end pb-4">
            <button class="w-full px-4 py-2 bg-green-500 text-gray-100 rounded" @click="launch(selected)">Launch</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import BestOfEntry from "./BestOfEntry";
export default {
  name: 'EntriesManager',
  components: {BestOfEntry},
  props: {
    entries: Array
  },
  data(){
    return {
      search: '',
      sortMethod: 1,
      sortDirection: -1,
      rankDirection: -1,
      selected: null,
      activeClass: 'border-2 border-green-500 bg-green-200',
      sortClass: 'bg-blue-200 focus:bg-blue-300',
      filterGroup: 'all',
      rankings: [],
      bests: {
        theme: null,
        concept: null,
        presentation: null,
        story: null,
        devlog: null,
      }
    }
  },
  methods:{
    startDrag: (evt, entry) => {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('entry', entry.name)
    },
    launch: function(entry){
      if(entry.bin){
        window.ipcRenderer.sendSync('launch', entry.bin)
        entry.played = true
      }
    },
    sortAlphabetical: function(a, b){
      if(a.name < b.name) { return this.sortDirection }
      if(a.name > b.name) { return this.sortDirection * -1 }
      return 0;
    },
    sortRank: function(a, b){
      if(a.rank < b.rank) { return this.rankDirection }
      if(a.rank > b.rank) { return this.rankDirection * -1 }
      return 0;
    },
    upvote: function(entry){
      if(entry.ranked && entry.rank === 1) return;
      if(entry.ranked){
        this.vote(entry, entry.rank, entry.rank - 1)
      } else {
        this.vote(entry, 0, this.rankings.length > 1 ? this.rankings.length - 1: 1)
        entry.ranked = true
      }
    },
    downvote: function(entry){
      if(entry.ranked && entry.rank === this.rankings.length) return;
      if(entry.ranked){
        this.vote(entry, entry.rank, entry.rank + 1)
      } else {
        this.vote(entry, 0, this.rankings.length > 1 ? this.rankings.length + 1 : 1)
        entry.ranked = true
      }
    },
    vote(entry, from, to){
      let ind = to - 1;
      let oldInd = from - 1;
      if(oldInd === -1){
        this.rankings.splice(ind, 0, entry)
      } else {
        let newRanks = this.rankings.filter((item, index) => index !== oldInd)

        this.rankings = [
            ...newRanks.slice(0, ind),
            entry,
            ...newRanks.slice(ind)
        ]
      }

      for(let i = 0; i < this.rankings.length; i++){
        this.rankings[i].rank = i+1;
      }
    }
  },
  computed: {
    filteredEntries: function(){
      let entries = this.entries.filter(entry => entry.name.toLowerCase().includes(this.search.toLowerCase()))
              .filter((entry) => {
                switch(this.filterGroup){
                  case "all": return true
                  case "played": return entry.played
                  case "unplayed": return !entry.played
                  case "ranked": return entry.ranked
                  case "unranked": return !entry.ranked
                }
              })
      if(this.sortMethod === 1){
        return entries.sort(this.sortAlphabetical);
      } else {
        return entries.sort(this.sortRank)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
