<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <nav>
    <div id="linkContainer">
      <RouterLink v-if="!isAuthenticated" to="/login" class="link"
        >Login</RouterLink
      >
      <RouterLink v-if="!isAuthenticated" to="/register" class="link"
        >Register</RouterLink
      >
      <RouterLink to="/" class="link">Home</RouterLink>
      <RouterLink v-if="isAuthenticated" to="/rentCar" class="link"
        >Add Rental</RouterLink
      >
    </div>
  </nav>
  <RouterView />
</template>

<script>
import { useStore} from "vuex";
import { useRouter } from "vue-router";
import {computed} from "vue";
import { auth ,onAuthStateChanged} from './firebaseConfig'


export default {

  setup() {

const store = useStore()
const router = useRouter()

auth.onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
  isAuthenticated=true;
  console.log(user)
});

const user = computed(() => {
  return store.getters.user;
});


  return {user,}}


};
</script>
<style>
nav {
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 40px;
  background-color: #A0085F;
  border-radius: 5px;
}

.link {
  width: max-content;
  text-decoration: none;
  color: whitesmoke;
  margin: 2px;
  padding: 5px;
  border: 2px solid#f56457;
  border-radius: 5px;
  text-align: center;
}
#logoutBtn {
  background-color: #862E42;
  color: whitesmoke;
  border-radius: 5px;
  border-color: #f56457;
  height: 30px;
  margin-top: 10px;
}

#linkContainer {
  display: flex;
  flex-direction: row;
  justify-items: center;
}
</style>
