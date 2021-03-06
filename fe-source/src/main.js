// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
// import { createProvider } from './vue-apollo'

// todo
// cssVars()

import firebase from "firebase/app";
const config = {
  apiKey: "AIzaSyA_SaxCtCPPEqkpTKdz2yxa1oSySVzLHfw",
  authDomain: "vienvu-7e64f.firebaseapp.com",
  databaseURL: "https://vienvu-7e64f.firebaseio.com",
  projectId: "vienvu-7e64f",
  storageBucket: "vienvu-7e64f.appspot.com",
  messagingSenderId: "236828354"
};

firebase.initializeApp(config);


Vue.use(BootstrapVue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  // apolloProvider: createProvider(),
  components: {
    App
  }
})
