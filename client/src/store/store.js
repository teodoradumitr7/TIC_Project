import { createStore } from "vuex";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
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
    }
  },
  getters: {
    user(state){
      return state.user
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    }
  },
  actions: {
    async register(context, { email, password, name}){
        const response = await createUserWithEmailAndPassword(auth, email, password)
        if (response) {
            context.commit('SET_USER', response.user)
            response.user.updateProfile({displayName: name})
        } else {
            throw new Error('Unable to register user')
        }
    },

    async logIn(context, { email, password }){
      const response = await signInWithEmailAndPassword(auth, email, password)
      if (response) {
          context.commit('SET_USER', response.user)
      } else {
          throw new Error('login failed')
      }
  },

  async logOut(context){
      await signOut(auth)
      context.commit('SET_USER', null)
  },

  async fetchUser(context ,user) {
    context.commit("SET_LOGGED_IN", user !== null);
    if (user) {
      context.commit("SET_USER", {
        displayName: user.displayName,
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
