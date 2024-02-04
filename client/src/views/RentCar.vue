<template>
  <div class="containerAddRent">
    <div v-if="isAuthenticated == true">

      <form class="form" @submit.prevent="addRental()">
        <div class="form-group">
          <label class="label">Starting from: </label>
          <div class="control">
            <input class="input" v-model="dateStart" type="date" :format="dateFormat"   required />
          </div>
        </div>
        <div class="form-group">
          <label class="label">To: </label>
          <div class="control">
            <input class="input" v-model="dateEnd" type="date" :format="dateFormat"   required />
          </div>
        </div>
        <div class="form-group">
          <button class="button is-primary is-fullwidth" type="submit">
            Add rental request
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
  name: "RentCarComponent",
  computed: {
    isAuthenticated() {
      console.log("is auth=", this.$store.state.isAuthenticated);
      return this.$store.state.isAuthenticated;
    },
  },
  data() {
    return {
      dateStart: '',
      dateEnd: '',
      dateFormat: 'dd/MM/yyyy',
      vin: this.$route.query.vin,
      user: this.$route.query.user,
      price:this.$route.query.price
    };
  },

  methods: {
    checkDate(start,end){
      const [day1, month1, year1] = start.split('/');
  const [day2, month2, year2] = end.split('/');
  const current=new Date();
  const dateObj1 = new Date(`${year1}-${month1}-${day1}`);
  const dateObj2 = new Date(`${year2}-${month2}-${day2}`);
  let diffInMs = dateObj2 - dateObj1;
  console.log("data din front")
  console.log(start)
  console.log(end)


  if(current>dateObj1 || current>dateObj2){
    return false;
  }
  else if(diffInMs<=0){
    return false;
  }
 return true;
    },
    addRental() {
      let requestParams = { ...requestOptions };
      requestParams.method = "POST";
      let rental = {
        dateStart: this.dateStart,
        dateEnd:this.dateEnd,
        vin: this.vin,
        user: this.user,
        price:this.price
      };
      let bool=this.checkDate(rental.dateStart,rental.dateEnd)
      if(bool)
      {requestParams.body = JSON.stringify(rental);
      requestParams.headers.authorization=window.localStorage.getItem("JWTtk");
      fetch(base_url + "rentals/"+this.$route.query.id, requestParams)
        .then((res) => res.json())
        .then((res) => {
          if (res === "User is not auth" || res==="Date not good") {
            if(res === "User is not auth" )console.log("Error from auth");
            this.$notify({ type: "error", text: "Car is already booked. Change date!" });
          } else {
            rental.id = res.id;
            this.$router.push("/");
          }
        })
      }
      else{
        console.log("NU e buna data")
        this.$notify({ type: "error", text: "Date is not properly inserted" });
      }
    },
    getLogin(){
      this.$router.push("/login")
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

.containerAddRent{
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
