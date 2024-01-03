//import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

import router from './router'
import store from './store/store';
// import { createStore } from "vuex";

// import { initializeApp } from "firebase/app";
// import {  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut,createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'


// const firebaseConfig = {
//   apiKey: "AIzaSyDhQ-ZU2HH0LrJkafh1KjeExo8W2K_2dO0",
//   authDomain: "projecttic-df3d3.firebaseapp.com",
//   projectId: "projecttic-df3d3",
//   storageBucket: "projecttic-df3d3.appspot.com",
//   messagingSenderId: "537098858888",
//   appId: "1:537098858888:web:92bd505550af4f5f2a4a3d"
// };

// const appF = initializeApp(firebaseConfig);

// const auth = getAuth()


//  const store= createStore({
//   state: {
//     user: {
//       loggedIn: false,
//       data: null
//     },
//     isAuthenticated: localStorage.getItem("JWTtoken") ? true : false,
//   },
//   getters: {
//     user(state){
//       return state.user
//     }
//   },
//   //Mutations allow us to make changes to our state;
//   mutations: {
//     SET_LOGGED_IN(state, value) {
//       state.user.loggedIn = value;
//       state.isAuthenticated = value;
//     },
//     SET_USER(state, data) {
//       state.user.data = data;
//     }
//   },
//   actions: {
//     async register(context, { email, password, name}){
//         const response = await createUserWithEmailAndPassword(auth, email, password)
//         if (response) {
//             context.commit('SET_USER', response.user)
// //response.user.updateProfile({displayName: name})
// localStorage.setItem("JWTtoken", true);
//         } else {
//             throw new Error('Unable to register user')
//         }
//     },

//     async logIn(context, { email, password }){
//       const response = await signInWithEmailAndPassword(auth, email, password)
//       if (response) {
//           context.commit('SET_USER', response.user)
//           localStorage.setItem("JWTtoken", true);
//       } else {
//           throw new Error('login failed')
//       }
//   },

//   async logOut(context){
//       await signOut(auth)
//       context.commit('SET_USER', null)
//       localStorage.setItem("JWTtoken", false);
//   },

//   async fetchUser(context ,user) {
//     context.commit("SET_LOGGED_IN", user !== null);
//     if (user) {
//       context.commit("SET_USER", {
//         email: user.email
//       });
//     } else {
//       context.commit("SET_USER", null);
//     }
// }
// },
//   modules: {},
// });

// const vuetify = createVuetify({
//   components,
//   directives,
// });

// import Vue from 'vue'
// import Vuetify from 'vuetify'

// Vue.use(Vuetify)


import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App).use(router).use(store).use(vuetify)
//.use(vuetify)
//registerPlugins(app)
app.mount('#app')


// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";
// import store from "./store";

// createApp(App).use(store).use(router).mount("#app");
