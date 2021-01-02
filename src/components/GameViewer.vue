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
    padding: 1rem .5rem;
    border: 2px solid #aaaaaa;
    border-radius: 3px;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 2rem;
    font-weight: bold;
    height: 100%;
    opacity: 0.8;
    word-break: break-all;
    box-shadow: 4px 4px 12px rgba(0,0,0,0.2);
    text-transform: uppercase;

    @media only screen and (max-width: 480px)  {
        font-size: 14px;
        padding: 8px 3px;
        border-width: 1px;
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
  font-weight: normal;
  border-width: 2px;
  border-color: #efefef;
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
  background-color: #761c14;
  color: white;
}
.Blue {
  background-color: #0c4172;
  color: white;
}
</style>

