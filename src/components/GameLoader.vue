<template>
    <div>
        <div class="top-bar">
          <div class="blue top-bar-left"> <i class="fa fa-user" v-if="currentGame.blueSpymaster !== 'pending'"></i> Blue Spymaster says: <strong>"{{latestClue('blue')}}"</strong> </div>
          <div class="red top-bar-right"> <i class="fa fa-user" v-if="currentGame.redSpymaster !== 'pending'"></i> Red Spymaster says: <strong>"{{latestClue('red')}}"</strong> </div>
      </div>
  
  <div class="gameboard">
    <router-view :game="currentGame" :username="username" :showType="isMaster" @show="showCard"></router-view>
    <div v-if="isMaster">
        <game-master :game="currentGame" :username="username" :showType="isMaster"></game-master>
        <button type="button" class="button warning" @click="resign">Resign as Spy Master</button>
    </div>
    
    <div v-else-if="currentGame.redSpymaster == 'pending' || currentGame.blueSpymaster == 'pending'">
        <label for="">My Username is</label><input type="text" v-model="username" /> and 
        <button type="button" class="button primary" @click="setMaster('red')" v-if="currentGame.redSpymaster == 'pending'">I'm the Red Spymaster</button>    
        <button type="button" class="button primary" @click="setMaster('blue')" v-if="currentGame.blueSpymaster == 'pending'">I'm the Blue Spymaster</button>    
    </div>
    <div v-else>
        <div v-if="loggingIn">
            Spymaster Re-connect: No Cheating!
            <button type="button" class="button alert" @click="login('red')">Red</button>
            <button type="button" class="button primary" @click="login('blue')">Blue</button>
        </div>
        <button type="button" class="button secondary" v-else @click="loggingIn = true">Spymaster Re-connect</button>
    </div>
    
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
// @import '~foundation-sites/scss/foundation.scss';

h1 {
        font-family: Arial, Helvetica, sans-serif;
}

.gameboard {
        font-family: Arial, Helvetica, sans-serif;
        padding: 2em;
         @media only screen and (max-width: 480px)  {
            padding: 2px;
        }
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


