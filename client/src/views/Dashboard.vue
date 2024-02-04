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
                  <v-card-title class="scroll-title"
                    >Your rentals are: {{ rental.vin }}</v-card-title
                  >
                  <v-card-subtitle>For: {{ rental.days }} days</v-card-subtitle>
                  <v-card-subtitle
                    >From: {{ rental.dateStart }}
                  </v-card-subtitle>
                  <v-card-subtitle>To: {{ rental.dateEnd }} </v-card-subtitle>
                  <v-card-subtitle>Price: {{ rental.price }} &euro; </v-card-subtitle>
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
                      Cancel rental
                    </button>
                  </div>
                </v-card>
              </template>
            </div>
          </div>
          <div v-else>
            <div id="centerLogIn">
            <div class="alert alert-danger" role="alert">
            <div class="form-group" id="centerLogIn">
              You are not logged in!
                <div class="col-md-8 offset-md-5">
                  <button type="submit" @click="getLogin()" class="activeButtons">Login</button>
              </div>
              </div>
          </div>
          </div>
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
          if(res === "Rentals not found"){
            this.$notify({ type: "warn", text: "At the moment you don't have any rentals!" });

          }
          else{
          this.rentals = [...res];
          }
        })
      );
    }
  },
  methods: {
    checkEditDate(start){
      let day1, month1, year1;
      if(start.includes("/"))
      [day1, month1, year1] = start.split('/');
    else{
      [year1, month1, day1] = doc.data().dateStart.split("-");
    }
  const current=new Date();
  const dateObj1 = new Date(`${year1}-${month1}-${day1}`);
  console.log("data pt edit check")
  console.log(current)
  console.log(dateObj1)
  if(current>dateObj1)
  return false;
return true;
    },
    editRental(rental) {
      let check=this.checkEditDate(rental.dateStart)
      if(check)
      this.$router.push({ path: "/editRental", query: rental });
    else{
      this.$notify({ type: "error", text: "Can't edit a date from the past!" });
    }
    },
    deleteRental(rental) {
      let requestParams = { ...requestOptions };
      requestParams.method = "DELETE";
      requestParams.headers.authorization =
        window.localStorage.getItem("JWTtk");
      requestParams.headers.email = this.$route.query.email;
      requestParams.headers.vin = rental.vin;
      requestParams.headers.start = rental.dateStart;
      console.log("date start to delete:")
      console.log(requestParams.headers.start)
      fetch(base_url + "rentals/" + rental.id, requestParams)
      .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res === "User is not auth" || res === "Cannot cancel date") {
            console.log("Error");
            this.$notify({ type: "error", text: "Cannot cancel date! Time period already passed!" });
          } else {
      this.rentals.splice(this.rentals.indexOf(rental), 1);}
          })
    },
    getLogin(){
      this.$router.push("/login")
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

#centerLogIn{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-direction: columns;
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
  width: 45%;
  margin-bottom: 10px;
  margin-left: 10px;
}

.rentalCard {
  width: 430px;
    display: block;
    flex-direction: row;
    justify-content: center;
    margin: 10px;
    padding: 10px;
}

.scroll-title {
    white-space: nowrap;
    overflow-x: auto;
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
