const { faker } = require("@faker-js/faker");

const generateCars = () => {
  let carList = [];
  for (let i = 0; i < 10; i++) {
    let manufacturerF = faker.vehicle.manufacturer();
    let modelF = faker.vehicle.model();
    let vinF=faker.vehicle.vin();
    let car = {
      manufacturer: manufacturerF,
      model: modelF,
      vin:vinF,
      price:
        Math.floor(Math.random() * 500) +
        35,
    };
    carList.push(car);
    console.log("Faked data")
  }
  return carList;
};


module.exports = { generateCars };
