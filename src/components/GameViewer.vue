<template>
  <div>
    <ul class="wordlist" v-if="game" >
      <li class="tile" v-for="tile in game.tiles" :key="tile.word" :class="getStyle(tile)" >
        {{tile.word}} <span v-if="!tile.hidden"><i class="fa fa-check"></i></span>
        <div v-if="isMaster"><button type="button" class="button secondary" @click="showing(tile)">reveal</button></div>
      </li>
    </ul>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import {ComponentOptions} from 'vue/types/options';
import {Game,Tile,TileType} from '../models/game';

export default Vue.component('game-viewer', <ComponentOptions<any, any, any, any>>{
    props: ['game', 'showType', 'isMaster'],
    methods: {
      getStyle: function(value:Tile) {
        if (this.isMaster || this.showType || value.hidden == false) {
          return TileType[value.type];
        } else { 
          return 'hidden';
        }
      },
      showing: function(tile) {
        console.log("showing...");
        this.$emit('show', tile);
      }
    }
});
</script>

<style lang="scss">

.wordlist {
    box-sizing: border-box;
    list-style:none;
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
}
.tile {
    box-sizing: border-box;
    display: block;
    padding: 20px 6px;
    border: 2px solid #444;
    width: 18%;
    margin: 0 5px 5px;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 20px;

    @media only screen and (max-width: 480px)  {
      width: 100%;
    }
}
.hidden {
  background-color: #dedede;
}
.Assassin {
  background-color: #454851;
  color: #eee;
}
.Civilian {
  background-color: #c98d4e;
}
.Red {
  background-color: #c02c1f;
  color: white;
}
.Blue {
  background-color: #1768b2;
  color: white;
}
</style>

