<!-- <template>
  <form @submit.prevent="editRental()">
    <label> DateStart </label>
    <input v-model="dateStart" type="date" required />
    <label> DateEnd </label>
    <input v-model="dateEnd" type="date" required />
    <button type="submit">Save Changes</button>
  </form>
</template> -->

<template>
  <div class="containerEditRent">
    <div v-if="isAuthenticated == true">
      <form class="form" @submit.prevent="editRental()">
        <div class="form-group">
          <label class="label">Starting from:</label>
          <div class="control">
            <input class="input" v-model="dateStart" type="date" required />
          </div>
        </div>
        <div class="form-group">
          <label class="label">To:</label>
          <div class="control">
            <input class="input" v-model="dateEnd" type="date" required />
          </div>
        </div>
        <div class="form-group">
          <button class="button is-primary is-fullwidth" type="submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
    <div v-else class="alert alert-danger" role="alert">
      You are not logged in!
      <div class="form-group">
                <div class="col-md-8 offset-md-5">
                  <button type="submit" @click="getLogin()" class="activeButtons">Login</button>
              </div>
              </div>
    </div>

  </div>
</template>

<script>
import { requestOptions, base_url } from "@/requestOptions";

export default {
  computed: {
    isAuthenticated() {
      console.log("is auth=", this.$store.state.isAuthenticated);
      return this.$store.state.isAuthenticated;
    },
  },
  data() {
    return {
      dateStart: this.$route.query.dateStart,
      dateEnd: this.$route.query.dateEnd,
    };
  },

  methods: {
    editRental() {
      let requestParams = { ...requestOptions };
      requestParams.method = "PUT";
      let rental = {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      };
      requestParams.body = JSON.stringify(rental);
      requestParams.headers.authorization=window.localStorage.getItem("JWTtk");
      fetch(base_url + "rentals/" + this.$route.query.id, requestParams)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res === "Decoding failed!" || res === "Expired token") {
            console.log("Authentification Error");
          } else {
            let rentals = fetch(base_url + "rentals", requestOptions);
            this.$router.push("/dashboard");
          }
        });
    },
    getLogin(){
      this.$router.push("/login")
    }
  },
};
</script>

<style>
.form {
  background-color: #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.containerEditRent{
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.input {
  border: none;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 100%;
}

.button {
  border: 3px solid;
  border-color: #862e42;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #fff;
  padding: 10px 20px;
  background-color: #a0085f;
}

.is-fullwidth {
  width: 100%;
  margin-top: 10px;
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

</style>
