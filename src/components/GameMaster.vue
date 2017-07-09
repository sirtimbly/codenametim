<template>
<div>
  <div>Game Master Controls for {{username}} (You are the {{ myColor }} spymaster!)</div>
  <input type="text" v-model="clue" /><button @click="share">Set Clue</button>
  
</div>
</template>


<script lang="ts">
import Vue from "vue";
import {ComponentOptions} from 'vue/types/options'

export default Vue.extend(<ComponentOptions<any, any, any, any>>{
    props: ['id', 'username', 'game'],
    data() { return {
        clue: ''
      }
    },
    computed: {
      myColor: function() {
        if (this.game.redSpymaster === this.username) return 'red';
        else if (this.game.blueSpymaster === this.username) return 'blue';
        else return '';
      }
    },
    methods: {
      share: function() {
        let update = this.game;

        update[this.myColor+'Clues'].push(this.clue);

        this.$pouch.put('codename', update);
      }
    }
});
</script>

