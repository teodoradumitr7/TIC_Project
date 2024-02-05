import { createStore } from "vuex";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut,createUserWithEmailAndPassword} from 'firebase/auth'
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhQ-ZU2HH0LrJkafh1KjeExo8W2K_2dO0",
  authDomain: "projecttic-df3d3.firebaseapp.com",
  projectId: "projecttic-df3d3",
  storageBucket: "projecttic-df3d3.appspot.com",
  messagingSenderId: "537098858888",
  appId: "1:537098858888:web:92bd505550af4f5f2a4a3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firebase auth
const auth = getAuth()

const store= createStore({
  state: {
    user: {
      loggedIn: false,
      data: null
    },
    isAuthenticated:false,
  },
  getters: {
    user(state){
      return state.user
    }
  },
  mutations: {

    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
      state.isAuthenticated = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    }
  },
  //commit triggers mutation
  //dispatch triggers actions
  actions: {
    async register(context, { email, password, name}){
      let url = "http://localhost:3000/"
        const response = await createUserWithEmailAndPassword(auth, email, password)
        if (response) {
            context.commit('SET_USER', response.user)
            localStorage.setItem("JWTtoken", true);
            localStorage.setItem("JWTtk", response.user.uid);
            fetch(url + 'register', {
              method: 'POST',
              mode: 'cors',
              cache: 'no-cache',
              credentials: 'same-origin',
              headers: {
                  'Content-Type': 'application/json'
              },
              redirect: 'follow',
              referrerPolicy: 'no-referrer',
              body: JSON.stringify(response.user)
              })
              .then(res => res.text()
              .then(res => console.log(res))
              )
        } else {
            throw new Error('Unable to register user')
        }
    },

    async logIn(context, { email, password }){
      let url = "http://localhost:3000/"
      const response = await signInWithEmailAndPassword(auth, email, password)
      if (response) {
        //console.log(response.user)
          context.commit('SET_USER', response.user)
          localStorage.setItem("JWTtoken", true);
          localStorage.setItem("JWTtk", response.user.uid);
          fetch(url + 'login', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(response.user) //data format must be the same as in header
            })
            .then(res => res.json())
      } else {
          throw new Error('login failed')
      }
  },

  async logOut(context){
      await signOut(auth)
      context.commit('SET_USER', null)
      localStorage.removeItem("JWTtoken");
      localStorage.removeItem("JWTtk");
      localStorage.clear();
  },

  async fetchUser(context ,user) {
    context.commit("SET_LOGGED_IN", user !== null);
    if (user) {
      context.commit("SET_USER", {
        email: user.email
      });
    } else {
      context.commit("SET_USER", null);
    }
}
},
  modules: {},
});


export default store
