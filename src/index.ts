// require('./index.scss');
import Vue from "vue";
import VueRouter from 'vue-router';
import * as PouchDB from "pouchdb";
import * as pouchdbFind from 'pouchdb-find';
import * as pouchdbLifeFind from 'pouchdb-live-find';
import * as vuePouch from 'vue-pouch';
import {Game, Tile, TileType} from './models/Game';

import GameLoader from './components/GameLoader.vue';
import GameMenu from './components/GameMenu.vue';
import GameCreator from './components/GameCreator.vue';
import GameViewer from './components/GameViewer.vue';
import GameMaster from './components/GameMaster.vue';

const router = new VueRouter({
  routes: [
      {
        path: '/',
        component: GameMenu,
      },
    // dynamic segments start with a colon
    {
        path: '/new',
        component: GameCreator
    },
    { path: '/game/:id', 
        name: 'game',
        component: GameLoader, 
        props: true,
        children: [
            {
                path: '',
                name: 'default',
                redirect: '/game/:id/view'
            },
            {
                path: 'view',
                name: 'view',
                component: GameViewer,
                props: true
            },
        ] }
  ]
})

Vue.use(VueRouter);

// var db = new PouchDB("https://couchdb.timbly.com:5984/codename");
import {ComponentOptions} from 'vue/types/options';
PouchDB.plugin(pouchdbFind);
PouchDB.plugin(pouchdbLifeFind);

Vue.use(vuePouch, {
  pouch: PouchDB,    // optional if `PouchDB` is available on the global object
  defaultDB: 'codename'        // the database to use if none is specified in the pouch setting of the vue component
});

let v = new Vue(<ComponentOptions<any, any, any, any>>{
    el: "#app",
    template: `
    <div>
        
        <h5>Pick The Code-Words</h5>
        <router-view></router-view>
    </div>
    `,
    data: { 
        name: "",
    },
    components: {
        GameViewer,
        GameLoader,
        GameCreator,
        GameMaster,
        GameMenu
    },
    router

});
