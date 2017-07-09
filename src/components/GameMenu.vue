<template>

  <div class="gamemenu">
    <h4>Load a game that's already been created.</h4>
    <router-link :to="'new'" class="button success"><i class="fa fa-plus"></i>Create New Game</router-link>
    <ul class="vertical menu">
        <li v-for="game in codename" :key="game._id">
            <router-link :to="{name: 'view', params: {id: game._id}}">{{game._id}}</router-link>
        </li>
    </ul>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import GameViewer from './GameViewer.vue';
import GameMaster from './GameMaster.vue';
import {ComponentOptions} from 'vue/types/options';
import {nouns} from '../nouns';
import {Game,Tile,TileType} from '../models/game';

export default Vue.component('game-loader', <ComponentOptions<any, any, any, any>>{
    props: [],
    data() {
        return {
            username: ''
            // isMaster: false
        }
    },
    
    mounted: function(){
        // this.pickWords();
        this.$pouch.sync('codename', 'http://couchdb.timbly.com:5984/codename');//.then(this.createScopedStyle);
    },
    components: {
        GameViewer,
        GameMaster
    },
    pouch: {
        codename: {}
    }
});
</script>

<style lang="scss">
@import '~foundation-sites/scss/foundation.scss';

h1 {
        font-family: Arial, Helvetica, sans-serif;
}

body {
        font-family: Arial, Helvetica, sans-serif;
}

.red {
    color: #c02c1f;
    border-color: #c02c1f;
}

.blue {
    color: #1768b2;
    border-color: #1768b2;
}
</style>


