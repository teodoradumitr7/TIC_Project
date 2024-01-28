<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8" :style="{ margin: '20px', padding: '10px' }">
        <div class="card">
          <div v-if="user.loggedIn">
            <div class="card-header">Welcome, {{ user.data.email }}</div>
            <div class="card-body">
              <div id="centerLogOutEdit">
                <div class="alert alert-success" role="alert">
                  You are logged in!
                  <div class="my-4">
                    <button
                      @click.prevent="signOut"
                      class="activeButtonsEdit"
                      id="logOutEdit"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div id="centerCards">
              <template v-for="rental in rentals" max-width="344">
                <v-card
                  v-if="rental.user == user.data.email"
                  class="rentalCard"
                >
                  <v-card-title
                    >Your rentals are: {{ rental.vin }}</v-card-title
                  >
                  <v-card-subtitle>For: {{ rental.days }} days</v-card-subtitle>
                  <v-card-subtitle
                    >From: {{ rental.dateStart }}
                  </v-card-subtitle>
                  <v-card-subtitle>To: {{ rental.dateEnd }} </v-card-subtitle>
                  <v-card-subtitle>Price: {{ rental.price }} </v-card-subtitle>
                  <div class="col-md-8 offset-md-5">
                    <button
                      id="editRental"
                      type="submit"
                      class="activeButtonsEdit"
                      @click="editRental(rental)"
                    >
                      Edit
                    </button>
                  </div>
                  <div class="col-md-8 offset-md-5">
                    <button
                      id="deleteRental"
                      type="submit"
                      class="activeButtonsEdit"
                      @click="deleteRental(rental)"
                    >
                      Delete
                    </button>
                  </div>
                </v-card>
              </template>
            </div>
          </div>
          <div v-else class="alert alert-danger" role="alert">
            You are not logged in!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { auth, onAuthStateChanged } from "../firebaseConfig";
import { requestOptions, base_url } from "@/requestOptions";

export default {
  name: "DashboardComponent",
  mounted() {
    localStorage.clear();
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    auth.onAuthStateChanged((user) => {
      store.dispatch("fetchUser", user);
      // console.log(user);
    });

    const user = computed(() => {
      return store.getters.user;
    });

    const signOut = async () => {
      await store.dispatch("logOut");
      router.push("/");
    };

    return { user, signOut };
  },
  data() {
    return { email: this.$route.query.email, rentals: [] };
  },
  created() {
    if (!this.rentals.length) {
      fetch(
        base_url + "rentals/" + this.$route.query.email,
        requestOptions
      ).then((res) =>
        res.json().then((res) => {
          this.rentals = [...res];
        })
      );
    }
  },
  methods: {
    editRental(rental) {
      this.$router.push({ path: "/editRental", query: rental });
    },
    deleteRental(rental) {
      let requestParams = { ...requestOptions };
      requestParams.method = "DELETE";
      requestParams.headers.authorization =
        window.localStorage.getItem("JWTtk");
      requestParams.headers.email = this.$route.query.email;
      requestParams.headers.vin = rental.vin;
      fetch(base_url + "rentals/" + rental.id, requestParams);
      this.rentals.splice(this.rentals.indexOf(rental), 1);
    },
  },
};
</script>

<style>
#centerCards {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#centerLogOutEdit {
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;
}
#logOutEdit {
  width: 80%;
}
.activeButtonsEdit {
  border: 3px solid;
  border-color: #862e42;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #fff;
  background-color: #a0085f;
  width: 40%;
  margin-bottom: 10px;
  margin-left: 10px;
}

.rentalCard {
  display: block;
  flex-direction: row;
  justify-content: center;
  /* margin: 10px;
  padding: 10px; */
  width: max-content;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.alert {
  height: 100px;
  width: max-content;
}
</style>
