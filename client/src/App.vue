<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <notifications/>
  <div id="nav">
  <nav class="container navbar navbar-expand-md navbar-light bg-light">
    <div>
    <div id="linkContainer">
      <RouterLink v-if="!isAuthenticated" to="/login" class="link"
        >Login</RouterLink
      >
      <RouterLink v-if="!isAuthenticated" to="/register" class="link"
        >Register</RouterLink
      >
      <RouterLink to="/" class="link">Home</RouterLink>
      <RouterLink v-if="isAuthenticated" :to="{path:'/dashboard',query:{email:returnEmail()}}" class="link"
        >Dashboard</RouterLink
      >

    </div>
    </div>
  </nav>
</div>
  <RouterView />
</template>

<script>

export default {

  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    }
    },
    methods:{
      returnEmail(){
      if(this.$store.state.isAuthenticated){
        //console.log(this.$store.state.user.data.email)
      return this.$store.state.user.data.email;
    }
    }
  },
}


  </script>

<style>
nav {
  height: fit-content;
  display:flex;
  justify-content: center;
  background-color: #A0085F;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


#nav {
  padding: 30px;
  text-align: center;
}

#nav a {
  font-weight: bold;
  background: #A0085F;
}

#nav a.router-link-exact-active {
  color:black;
  border-radius: .5rem;
}

.link {
  width: max-content;
  text-decoration: none;
  margin: 2px;
  padding: 5px;
  border: 2px solid#f56457;
  border-radius: 5px;
  text-align: center;
  transition: all 0.2s ease-in-out;
}

#linkContainer {
  display: flex;
  flex-direction: row;
  justify-items: center;
}

#nav a:hover {
  background-color: #f56457;
}
</style>


