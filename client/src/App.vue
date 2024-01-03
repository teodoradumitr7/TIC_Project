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

    </div>
  </nav>
  <RouterView />
</template>
<!-- <template>
  <nav>
    <div id="linkContainer">
      <RouterLink v-if="!user" to="/login" class="link">Login</RouterLink>
      <RouterLink v-if="!user" to="/register" class="link">Register</RouterLink>
      <RouterLink to="/" class="link">Home</RouterLink>
     </div>
  </nav>
  <RouterView />
</template> -->

<!-- <script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["isAuthenticated"]),
  },
};
</script> -->

<!-- <script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  setup() {
    const store = useStore();

    const user = computed(() => {
      return store.state.user.loggedIn;
    });

    return { user };
  },
};
</script> -->

<script>

export default {

  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
}
  </script>

<style>
nav {
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 40px;
  background-color: #A0085F;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  transition: all 0.2s ease-in-out;
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

.link:hover {
  background-color: #f56457;
  color: white;
}
</style>
