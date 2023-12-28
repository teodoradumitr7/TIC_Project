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
      <RouterLink v-if="isAuthenticated" to="/addRent" class="link"
        >Add Rental</RouterLink
      >
    </div>
  </nav>
  <button v-if="isAuthenticated" @click="logout()" id="logoutBtn">
    Logout
  </button>
  <RouterView />
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      // return this.$store.state.isAuthenticated;
      console.log("Auth")
    },
  },
  methods: {
    logout() {
      this.$store.commit("SET_AUTH", false);
      window.localStorage.removeItem("JWTtoken");
      this.$router.push("/");
    },
  },
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
