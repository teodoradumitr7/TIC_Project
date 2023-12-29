const { faker } = require("@faker-js/faker");
let vinList = [];

const generateCars = () => {
  let carList = [];
  for (let i = 0; i < 10; i++) {
    let manufacturerF = faker.vehicle.manufacturer();
    let modelF = faker.vehicle.model();
    let vinF = faker.vehicle.vin();
    let car = {
      manufacturer: manufacturerF,
      model: modelF,
      vin: vinF,
      price: Math.floor(Math.random() * (300-100) + 100),
    };
    vinList.push(vinF);
    carList.push(car);
    console.log("Faked data");
  }
  return carList;
};

const generateRentals = () => {
  let rentingList = [];
  const users = ["teo@gmail.com", "teod@gmail.com"];
  for (let i = 0; i < 5; i++) {
    let rental = {
      vin: vinList[Math.floor(Math.random() * vinList.length)],
      days: Math.floor(Math.random() * (60-30) + 30),
      user: users[Math.floor(Math.random() * users.length)],
    };
    console.log("Faked rental");
    rentingList.push(rental);
  }
  return rentingList;
};

module.exports = { generateCars, generateRentals };
