<template>

  <div class="gameboard">
      
      <div class="topbar">
          <div class="blue">Blue Spymaster says: <strong>"{{latestClue('blue')}}"</strong> </div>
          <div class="red">Red Spymaster says: <strong>"{{latestClue('red')}}"</strong> </div>
      </div>
    <router-view :game="currentGame" :username="username" :showType="isMaster" @show="showCard"></router-view>
    <div v-if="isMaster">
        <game-master :game="currentGame" :username="username" :showType="isMaster"></game-master>
        <button @click="resign">Resign as Spy Master</button>
    </div>
    
    <div v-else-if="currentGame.redSpymaster == 'pending' || currentGame.blueSpymaster == 'pending'">
        My name is <input v-model="username" /> and 
        <button @click="setMaster('red')">I'm the Red Spymaster</button>    
        <button @click="setMaster('blue')">I'm the Blue Spymaster</button>    
    </div>
    <div v-else>
        <div v-if="loggingIn">
            No Cheating!
            <button @click="login('red')">Red</button>
            <button @click="login('blue')">Blue</button>
        </div>
        <button v-else @click="loggingIn = true">Spymaster Section</button>
    </div>
    
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
    props: ['id'],
    data() {
        return {
            allNouns: nouns,
            username: '',
            loggingIn: false,
            // isMaster: false
        }
    },
    computed: {
        isMaster: function() {
            return (this.username === this.currentGame.redSpymaster || this.username === this.currentGame.blueSpymaster);
        },
        myColor: function() {
            return this.currentGame.redSpymaster === this.username ? 'red' : 'blue';
        }
    },
    methods: {
        pickWords: function(num:Number = 25) {
            for (let i; i <= num; i++) {
                let rando = Math.random() * (this.allNouns.length);
                let picked = this.allNouns[rando];
                if (this.pickedWords.indexOf(picked) === -1) {
                    this.pickedWords.push(picked);
                }
            }
        },
        latestClue: function(type:string) {
            let clues = this.currentGame[type+'Clues'];
            return clues[clues.length-1];
        },
        setMaster: function(type:string) {
            // this.isMaster = true;
            let newGame = this.currentGame;
            newGame[type+"Spymaster"] = this.username;
            this.$pouch.put('codename', newGame);
        },
        login: function(type:string) {
            this.loggingIn = false;
            console.log("setting to " + this.currentGame[type+"Spymaster"]);
            this.username = this.currentGame[type+"Spymaster"];
            // this.isMaster = true;
        },
        resign: function() {
            let update = this.currentGame;
            this.username = 'resigned';
            update[this.myColor+"Spymaster"] = 'pending';
            this.$pouch.put('codename', update);
        },
        showCard: function(event) {
            console.log("showing card: " + JSON.stringify(event));
            let update = this.currentGame as Game;
            update.tiles = this.currentGame.tiles.map(t => {
                if (t.word === event.word) {
                    event.hidden = false;
                    return event;
                }
                return t;
            });
            this.$pouch.put('codename', update);
        }
    },
    events: {
        resign: function(event) {
            this.username = '';
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
        games: {},
        currentGame: function() {
            return {
                database: 'codename',
                selector: {_id: this.id},
                first: true
            }
        }
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


