<script setup></script>

<template>
  <div v-if="user.loggedIn">
    <div class="card-header">Welcome, {{ user.data.email }}</div>
    <div class="my-4">
      <button @click.prevent="signOut" class="activeButtons">Log Out</button>
      <button @click="getDashboard()" class="activeButtons">Dashboard</button>

    </div>
  </div>
  <h1 id="title">Available cars</h1>
  <div id="carsContainer">
    <v-card v-for="car in cars" max-width="344">
      <v-img
        src="https://img.freepik.com/premium-vector/sketch-hand-drawn-single-line-art-car-use-logo-poster-background_469760-3566.jpg"
        height="200px"
        cover
      ></v-img>
      <v-card-title>Manufacturer: {{ car.manufacturer }}</v-card-title>
      <v-card-subtitle>Model: {{ car.model }}</v-card-subtitle>
      <v-card-subtitle>Price: {{ car.price }} $/day</v-card-subtitle>
      <v-card-actions>
        <v-btn v-if="user.loggedIn" variant="text" @click="rentCar(car)" class="activeButtons">
          Rent car
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn
          :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          @click="show = !show"
        ></v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>

          <v-card-text> VIN: {{ car.vin }} </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
    <v-spacer></v-spacer>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { auth, onAuthStateChanged } from "../firebaseConfig";
import { requestOptions, base_url } from "@/requestOptions";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    auth.onAuthStateChanged((user) => {
      store.dispatch("fetchUser", user);
      console.log(user);
    });

    const user = computed(() => {
      return store.getters.user;
    });

    const signOut = async () => {
        await store.dispatch('logOut')
        router.push('/')
  }

    return {user,signOut}
  },

  data() {
    return { cars: [], show: false };
  },
  created() {
    if (!this.cars.length) {
      fetch(base_url + "cars", requestOptions).then((res) =>
        res.json().then((res) => {
          this.cars = [...res];
        })
      );
    }
  },
  computed: {},
  methods: {
    rentCar(car) {
      this.$router.push({ path: "/rentCar", query: car });
    },
    getDashboard(){
      this.$router.push("/dashboard")
    }
  },
};
</script>

<style>
#title {
  display: flex;
  justify-content: center;
  height: 20px;
}
#carsContainer {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 5px;
  margin-top: 20px;
}

.v-card {
  align-items: center;
  border: 2px solid;
  border-color: #a0085f;
  border-radius: 5px;
  box-shadow: 0px 5px 20px rgba(34, 35, 58, 0.2);
  margin: 5px;
  width: max-content;
}

.activeButtons {
  background-color: #a0085f;
  color: whitesmoke;
  border-radius: 5px;
  border: 3px solid;
  border-color: #862e42;
  height: 30px;
  margin: 3px;
  margin-top: 10px;
}
body {
  background-color: #f7f6f4;
}
</style>
