<template>

  <div class="gameboard">
      <div class="callout">
        <h4>Create New Game</h4>
        <div>
            <radiogroup class="grid-x bordered">
                <div class="cell medium-5"><strong>Starting Team:</strong></div>
                <div class="cell medium-1 blue"><input type="radio" id="blue" v-model="startingTeam" value="blue"/> Blue</div>
                <div class="cell medium-1 red"><input type="radio" id="red" v-model="startingTeam" value="red"/> Red</div>
            </radiogroup>
        </div>
        <div class="cell medium-6">
            <label for="">Name your new game  <input type="text" v-model="name" /></label>
        </div>
        <div class="grid-x grid-gutter-x">
            <div class="cell medium-6">
                <button class="button warning" @click="pickWords()"><i class="fa fa-random"></i> Regenerate List</button>
            </div>
            <div class="cell medium-offset-4 medium-2 right">
                <button class="button success expanded" @click="create">Create</button>
            </div>
        </div>
      </div>
      <game-viewer :game="game"></game-viewer>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import {ComponentOptions} from 'vue/types/options';
import {nouns} from '../nouns';
import GameViewer from './GameViewer.vue';
import {Game,Tile,TileType} from '../models/game';
import {connectionString} from '../connection'

export default Vue.extend(<ComponentOptions<any, any, any, any>>{
    props: ['id'],
    data() {
        return {
            name: '',
            pickedWords: [],
            allNouns: nouns,
            startingTeam: 'blue'
        }
    },
    computed: {
        game: function() {
            let game = { wordList: this.pickedWords, tiles: [] };
            game.tiles = game.wordList.map(word => { return <Tile>{ word: word }});
            return game;
        }
    },
    methods: {
        pickWords: function(num:Number = 25) {
            this.pickedWords = [];
            console.log("allNouns:" + this.allNouns.length)
            for (let i = 0; i < num; i++) {
                let rando = this.getRandomInt(0,this.allNouns.length);
                let picked = this.allNouns[rando];
                // console.log(i +" picking word " + rando + ' -- ' + picked)
                if (this.pickedWords.indexOf(picked) === -1) {
                    this.pickedWords.push(picked);
                } else {
                    i--;
                }
            }
        },
        getRandomInt: function(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
        },
        create: function(){
            let assassin = this.getRandomInt(0, 24);
            let reds = new Array<number>();
            let blues = new Array<number>();
            let redCount = 8;
            let blueCount = 8;
            if (this.startingTeam === 'blue') {
                blueCount++;
            }
            if (this.startingTeam === 'red') {
                redCount++;
            }
            while (reds.length < redCount) {
                let x = this.getRandomInt(0, 24);
                if (x !== assassin && reds.indexOf(x) === -1) {
                    reds.push(x);
                }
            }
            while (blues.length < blueCount) {
                let x = this.getRandomInt(0, 24);
                if (x !== assassin && blues.indexOf(x) === -1 && reds.indexOf(x) === -1) {
                    blues.push(x);
                }
            }
            let tiles = new Array<Tile>();
            for (let i = 0; i < this.pickedWords.length; i++) {
                let t = TileType.Civilian;
                if (i === assassin) {
                    t = TileType.Assassin;
                } else if (reds.indexOf(i) > -1) {
                    t = TileType.Red;
                } else if (blues.indexOf(i) > -1) {
                    t = TileType.Blue;
                }
                tiles.push(<Tile>{
                    word: this.pickedWords[i],
                    type: t,
                    position: i,
                    hidden: true
                })
            }



            let newGame = new Game({
                _id: this.name,
                wordList: this.pickedWords,
                tiles: tiles
            });
            console.log("creating new: " + JSON.stringify(newGame));
            this.$pouch.put('codename', newGame, res => {
                this.$router.push({
                    name: 'view',
                    params: {id: this.name}
                });
            });
        }
    },
    mounted: function(){
        this.pickWords();
        this.$pouch.sync('codename', connectionString);//.then(this.createScopedStyle);
    },
    components: {
        GameViewer
    },
    pouch: {
        games: {}
    }
});
</script>

<style lang="scss">
    .gameboard {
        padding: 2em;
    }
</style>
