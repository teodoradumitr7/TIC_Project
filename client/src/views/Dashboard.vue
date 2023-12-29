<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div v-if="user.loggedIn">

          <div class="card-header">Welcome, {{user.data.email}}</div>
          <div class="card-body">
            <div class="alert alert-success" role="alert">
            You are logged in!
            <div class="my-4">
                  <button  @click.prevent="signOut" class="activeButtons">Log Out</button>
            </div>
             </div>
          </div>
          <template v-for="rental in rentals"  max-width="344" >
            <v-card v-if="rental.user==user.data.email">
            <v-card-title>Your rentals are: {{ rental.vin }}</v-card-title>
      <v-card-subtitle>For: {{ rental.days }} days</v-card-subtitle>
    </v-card>
          </template>

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
import { useStore} from "vuex";
import { useRouter } from "vue-router";
import {computed} from "vue";
import { auth ,onAuthStateChanged} from '../firebaseConfig'
import { requestOptions, base_url } from "@/requestOptions";

export default {
  name: "DashboardComponent",

  setup() {

  const store = useStore()
  const router = useRouter()

  auth.onAuthStateChanged(user => {
    store.dispatch("fetchUser", user);
    console.log(user)
  });

  const user = computed(() => {
    return store.getters.user;
  });

  const signOut = async () => {
        await store.dispatch('logOut')
        router.push('/')
  }

    return {user,signOut}
 }
,
data(){
  return{rentals:[]}
},
created() {
    if (!this.rentals.length) {
      fetch(base_url + "rentals", requestOptions).then((res) =>
        res.json().then((res) => {
          this.rentals = [...res];
        })
      );
    }
  },


};
</script>

<style>
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

.v-card{
  width: 500px;
  display: block;
  flex-direction: row;
  justify-content: center;
}
</style>
