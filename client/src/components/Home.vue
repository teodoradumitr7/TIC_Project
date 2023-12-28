<script setup></script>

<template>
  <h1 id="title">Available cars</h1>
  <div id="carsContainer">
    <div v-for="car in cars" class="carCard">
      <h3>Manufacturer: {{ car.manufacturer }}</h3>
      <h3>Model: {{ car.model }}</h3>
      <h3>Price: {{ car.price }}</h3>
      <div>
        <button @click="rentCar(car)" class="activeButtons">
          Rent Car
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestOptions, base_url } from "@/requestOptions";
export default {
  data() {
    return { cars: [] };
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

  },
  methods: {
    rentCar(car) {
      this.$router.push({ path: "/cars", query: car });
    },
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
  flex-direction: row;
  flex-wrap: wrap;
  height: 100vh;
  margin: 5px;
  margin-top: 20px;
}
.carCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 3px solid;
  border-color: #A0085F;
  border-radius: 5px;
  width: fit-content;
  margin: 5px;
  height: max-content;
  padding: 5px;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);

}

.activeButtons {
  background-color: #A0085F;
  color: whitesmoke;
  border-radius: 5px;
  border: 3px solid;
  border-color:  #862E42;
  height: 30px;
  margin: 3px;
  margin-top: 10px;

}
body {
  background-color:#f7f6f4;
}
</style>
