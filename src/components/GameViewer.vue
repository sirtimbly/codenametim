<template>
  <div>
    <ul class="wordlist" v-if="game" >
      <li class="tile-cell" v-for="tile in game.tiles" :key="tile.word">
        <div class="tile" :class="getStyle(tile)" >
          {{tile.word}} <span v-if="!tile.hidden"><i class="fa fa-check"></i></span>
          <div v-if="isMaster"><button type="button" class="button secondary" @click="showing(tile)">reveal</button></div>
        </div>
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
      getStyle: function(value:Tile):string {
        let result = 'hidden';
        if (this.isMaster || this.showType || value.hidden == false) {
          result = TileType[value.type];
          if (!value.hidden) {
            result += ' revealed';
          }
        }
        return result;
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
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 20px;
    height: 100%;
    opacity: 0.8;

    @media only screen and (max-width: 480px)  {
        font-size: 15px;
        padding: 10px 4px;
    }

    &-cell {
      box-sizing: border-box;
      width: 20%;
      margin: 0;
      padding: .5em;


      @media only screen and (max-width: 480px)  {

        padding: 4px;
      }
    }
}

.hidden {
  background-color: #dedede;
}

.revealed {
  font-weight: bold;
  border-width: 3px;
  opacity: 1;
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

