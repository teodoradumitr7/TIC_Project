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
          <label class="label">Starting from[mm/dd/yyyy]:</label>
          <div class="control">
            <input class="input" v-model="dateStart" type="date" required />
          </div>
        </div>
        <div class="form-group">
          <label class="label">To[mm/dd/yyyy]:</label>
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
          <button type="submit" @click="getLogin()" class="activeButtons">
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requestOptions, base_url } from "@/requestOptions";
import { ref, watch } from "vue";
export default {
  computed: {
    isAuthenticated() {
      console.log("is auth=", this.$store.state.isAuthenticated);
      return this.$store.state.isAuthenticated;
    },
  },
  data() {
    //formateaza data si o arata userului ca sa vada pe aia veche cu ce schimba
    const formatDate = (date) => {
      const [day, month, year] = date.split("/");
      return `${year}-${month}-${day}`;
    };

    return {
      dateStart: this.$route.query.dateStart
        ? formatDate(this.$route.query.dateStart)
        : null,
      dateEnd: this.$route.query.dateEnd
        ? formatDate(this.$route.query.dateEnd)
        : null,
    };
  },
  //watcher ca sa vad ca se schimba
  watch: {
    dateStart(newVal, oldVal) {
      console.log("Old start date:", oldVal);
      console.log("New start date:", newVal);
    },
    dateEnd(newVal, oldVal) {
      console.log("Old end date:", oldVal);
      console.log("New end date:", newVal);
    },
  },
  methods: {
    //verifica data sa fie dupa cea curenta
    //si data de returnare sa fie mai mare decat cea de inchiriere
    checkDate(start, end) {
      const [day1, month1, year1] = start.split("/");
      const [day2, month2, year2] = end.split("/");
      const current = new Date();
      const dateObj1 = new Date(`${year1}-${month1}-${day1}`);
      const dateObj2 = new Date(`${year2}-${month2}-${day2}`);
      let diffInMs = dateObj2 - dateObj1;
      console.log("data din front");
      console.log(start);
      console.log(end);

      if (current > dateObj1 || current > dateObj2) {
        return false;
      } else if (diffInMs <= 0) {
        return false;
      }
      return true;
    },
    //pt editare se trimite la back doar daca e data buna
    //daca nu se arata notificare
    editRental() {
      let requestParams = { ...requestOptions };
      requestParams.method = "PUT";
      let rental = {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        user: this.$route.query.user,
        vin: this.$route.query.vin,
        price: this.$route.query.price,
        rentalId: this.$route.query.id,
        days: this.$route.query.days,
      };
      let bool = this.checkDate(rental.dateStart, rental.dateEnd);
      if (bool) {
        requestParams.body = JSON.stringify(rental);
        requestParams.headers.authorization =
          window.localStorage.getItem("JWTtk");
        requestParams.headers.email = rental.user;
        requestParams.headers.vin = rental.vin;
        let priceNew = rental.price / rental.days;
        console.log(priceNew);
        requestParams.headers.price = priceNew;
        console.log(rental.rentalId);
        fetch(base_url + "rentals/" + this.$route.query.id, requestParams)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res === "User is not auth" || res === "Date not good") {
              console.log("Error");
              this.$notify({
                type: "error",
                text: "Car is already booked. Change date!",
              });
            } else {
              let rentals = fetch(base_url + "rentals", requestOptions);
              let emailVal = {};
              emailVal.email = rental.user;
              console.log(emailVal);
              this.$router.push({ path: "/dashboard", query: emailVal });
            }
          });
      } else {
        console.log("NU e buna data");
        this.$notify({ type: "error", text: "Date is not properly inserted" });
      }
    },
    getLogin() {
      this.$router.push("/login");
    },
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

.containerEditRent {
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
