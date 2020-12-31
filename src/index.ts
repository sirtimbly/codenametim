// require('./index.scss');
import PouchDB from "pouchdb";
import PouchFind from "pouchdb-find";
import * as pouchdbLifeFind from "pouchdb-live-find";
import Vue from "vue";
import * as vuePouch from "vue-pouch";
import VueRouter from "vue-router";

import GameCreator from "./components/GameCreator.vue";
import GameLoader from "./components/GameLoader.vue";
import GameMaster from "./components/GameMaster.vue";
import GameMenu from "./components/GameMenu.vue";
import GameViewer from "./components/GameViewer.vue";

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "home",
      component: GameMenu,
    },
    // dynamic segments start with a colon
    {
      path: "/new",
      name: "new",
      component: GameCreator,
    },
    {
      path: "/game/:id",
      name: "game",
      component: GameLoader,
      props: true,
      children: [
        {
          path: "",
          name: "default",
          redirect: "/game/:id/view",
        },
        {
          path: "view",
          name: "view",
          component: GameViewer,
          props: true,
        },
      ],
    },
  ],
});

Vue.use(VueRouter);

// var db = new PouchDB("https://couchdb.timbly.com/codename");
import { ComponentOptions } from "vue/types/options";
PouchDB.plugin(PouchFind);
PouchDB.plugin(pouchdbLifeFind);

Vue.use(vuePouch, {
  pouch: PouchDB, // optional if `PouchDB` is available on the global object
  defaultDB: "codename", // the database to use if none is specified in the pouch setting of the vue component
});

const v = new Vue({
  el: "#app",
  template: `
    <div>
        <div class="top-bar primary">
            <h5 class="logo"><router-link :to="{name:'home'}">Code-Words</router-link></h5>
        </div>
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
    GameMenu,
  },
  router,
} as ComponentOptions<any, any, any, any>);
