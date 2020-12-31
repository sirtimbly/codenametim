<template>

  <div class="gamemenu">
      <div class="grid-x menu-header">
          <div class="cell medium-8"><h4>Load a game that's already been created...</h4></div>
          <div class="cell medium-4"><router-link :to="'new'" class="button success expanded"><i class="fa fa-plus"></i> Create New Game</router-link></div>
      </div>


    <ul class="">
        <li v-for="game in codename" :key="game._id" class="card menucard">
            <div class="card-section">
                <router-link :to="{name: 'view', params: {id: game._id}}"> <i class="fa fa-caret-square-o-right"></i> Game "{{game._id}}"</router-link>
            </div>
            <div class="card-divider" v-if="game.isWon">
                Game in Progress
            </div>
            <div class="card-divider" v-else>
                Game won by {{tileType(game.winningTeam)}}
            </div>
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
import {connectionString} from '../connection'

export default Vue.component('game-menu', <ComponentOptions<any, any, any, any>>{
    props: [],
    data() {
        return {
            username: ''
            // isMaster: false
        }
    },
    methods: {
        tileType: function(val:TileType):string {
            return TileType[val];
        }
    },
    mounted: function(){
        // this.pickWords();
        this.$pouch.sync('codename', connectionString);//.then(this.createScopedStyle);
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

<style lang="css">

h1 {
        font-family: Arial, Helvetica, sans-serif;
}

body {
        font-family: Arial, Helvetica, sans-serif;
}


.gamemenu {
    padding: 1rem;
}

.menucard {
    width: 25%;
    display: inline-block;
    margin: 0 1rem 1rem 0;
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


