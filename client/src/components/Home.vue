<script setup></script>

<template>
  <div v-if="user.loggedIn">

    <div class="my-4">
      <div id="centerHome">
        <div class="card-header" >Welcome, {{ user.data.email }}</div>
      </div>
      <div id="centerHome">
      <button @click.prevent="signOut" class="activeButtonsHome" id="logOutHome">Log Out</button>
    </div>
    </div>
  </div>
  <h1 id="titleHome">Available cars</h1>
  <div id="centerHome">
    <v-btn
      variant="text"
      :class="{ 'is-active': !sorted }"
      class="activeButtonsHome"
      @click="setSorted()"
    >
      Order Cars by Manufacturer
    </v-btn>
    <v-btn
      variant="text"
      :class="{ 'is-active': !sorted }"
      class="activeButtonsHome"
      @click="setSorted('price')"
    >
      Order Cars by Price
    </v-btn>
  </div>
  <div id="carsContainerHome">
    <v-card v-for="car in filterCars" :key="car.VIN" max-width="344" class="carCard">
      <v-img
        :src="car.image"
        height="200px"
        cover
      ></v-img>
      <v-card-title>Manufacturer: {{ car.manufacturer }}</v-card-title>
      <v-card-subtitle>Model: {{ car.model }}</v-card-subtitle>
      <v-card-subtitle>Price: {{ car.price }} $/day</v-card-subtitle>
      <v-card-actions>
        <v-btn
          v-if="user.loggedIn"
          variant="text"
          @click="rentCar(car)"
          class="activeButtonsHome"
        >
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
import { getCurrentInstance } from "vue";
import { ref } from "vue";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    auth.onAuthStateChanged((user) => {
      store.dispatch("fetchUser", user);
      //console.log(user);
    });

    const user = computed(() => {
      return store.getters.user;
    });

    const signOut = async () => {
      await store.dispatch("logOut");
      router.push("/");
    };

    // const methodThatForcesUpdate = () => {
    //   const instance = getCurrentInstance();
    //   instance.proxy.forceUpdate();
    // };

/*
    setTimeout(function () {
      location.reload(true);
    }, 1500); // Reloads the current page
*/
    return { user, signOut };
  },

  data() {
    return { cars: [], show: false, sorted: "", order: true };
  },
  orderedCars: function () {
    this.sorted = true;
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

  computed: {
    // sortedList() {
    //   return _.orderBy(this.cars, "manufacturer", this.order ? "desc" : "asc");
    // }
    filterCars() {
      let toSort = Array.from(this.cars);
      if (this.order == true) {
        if (this.sorted === "price") {
          toSort = toSort.sort((a, b) => {
            let ca = a.price,
              cb = b.price;
            if (ca < cb) {
              return -1;
            }
            if (ca > cb) {
              return 1;
            }
            return 0;
          });
        } else {
          toSort = toSort.sort((a, b) => {
            let ca = a.manufacturer.toLowerCase(),
              cb = b.manufacturer.toLowerCase();
            if (ca < cb) {
              return -1;
            }
            if (ca > cb) {
              return 1;
            }
            return 0;
          });
        }
      } else {
        if (this.sorted === "price") {
          toSort = toSort.sort((a, b) => {
            let ca = a.price,
              cb = b.price;
            if (ca < cb) {
              return 1;
            }
            if (ca > cb) {
              return -1;
            }
            return 0;
          });
        } else {
          toSort = toSort.sort((a, b) => {
            let ca = a.manufacturer.toLowerCase(),
              cb = b.manufacturer.toLowerCase();
            if (ca < cb) {
              return 1;
            }
            if (ca > cb) {
              return -1;
            }
            return 0;
          });
        }
      }
      //this.cars={}
      this.cars = toSort;
      return toSort;
    },
  },
  methods: {
    refreshPage() {
      location.reload(true);
    },
    rentCar(car) {
      let info = {};
      info.vin = car.vin;
      info.user = this.user.data.email;
      info.price=car.price;
      console.log("info ", info);
      this.$router.push({ path: "/rentCar", query: info });
    },
    setSorted(type) {
      console.log(this.sorted);
      if (type === "price") {
        this.sorted = "price";
      } else {
        this.sorted = "";
      }
      this.toggleOrder();
    },
    toggleOrder() {
      this.order = !this.order;
    },
  },
};
</script>

<style>
#titleHome {
  display: flex;
  justify-content: center;
  height: 20px;
}
#carsContainerHome {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 5px;
  margin-top: 20px;
}

.carCard {
  align-items: center;
  border: 2px solid;
  border-color: #a0085f;
  border-radius: 5px;
  box-shadow: 0px 5px 20px rgba(34, 35, 58, 0.2);
  margin: 5px;
  width: max-content;
}
/*.v-card {
  align-items: center;
  border: 2px solid;
  border-color: #a0085f;
  border-radius: 5px;
  box-shadow: 0px 5px 20px rgba(34, 35, 58, 0.2);
  margin: 5px;
  width: max-content;

  width: 500px;
  display: block;
  flex-direction: row;
  justify-content: center;
  margin: 10px;
  padding: 10px;
} */

.activeButtonsHome {
  background-color: #a0085f;
  color: whitesmoke;
  border-radius: 5px;
  border: 3px solid;
  border-color: #862e42;
  height: 30px;
  margin: 20px;
  width: 30%;
  display: inline;
}
body {
  background-color: #f7f6f4;
}
#centerHome{
  display: flex;
  justify-content: center;
  align-items: center;
}
#logOutHome{
  width: 20%;
}
</style>
