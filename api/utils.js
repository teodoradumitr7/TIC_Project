const { faker } = require("@faker-js/faker");
let vinList = [];
let priceList=[]
let imageList=["https://img.freepik.com/premium-vector/sketch-hand-drawn-single-line-art-car-use-logo-poster-background_469760-3566.jpg",
"https://img.freepik.com/premium-vector/sketch-hand-drawn-single-line-art-car-use-logo-poster-background_469760-3560.jpg",
"https://img.freepik.com/premium-vector/car-silhouette-classic-side-view_74218-292.jpg?size=626&ext=jpg",
"https://img.freepik.com/premium-vector/american-muscle-car-vector-monochrome-image-american-muscle-car-white-background_289688-340.jpg",
"https://img.freepik.com/premium-vector/muscle-car-vector-art-poster-t-shirt-illustration_510486-148.jpg",
"https://img.freepik.com/premium-vector/black-white-car-vector-illustration-conceptual-design_543548-82.jpg",
"https://img.freepik.com/premium-vector/black-white-car-vector-illustration-conceptual-design_543548-17.jpg"
]
let seatList=[2,4,5]
const generateCars = () => {
  let carList = [];
  for (let i = 0; i < 10; i++) {
    let manufacturerF = faker.vehicle.manufacturer();
    let modelF = faker.vehicle.model();
    let vinF = faker.vehicle.vin();
    let priceF=Math.floor(Math.random() * (300-100) + 100);
    let randomSeat=Math.random()*seatList.length;
    let random=Math.random() * imageList.length;
    let fuelF=faker.vehicle.fuel();
    let car = {
      manufacturer: manufacturerF,
      model: modelF,
      vin: vinF,
      price: priceF,
      image:imageList[Math.floor(random)],
      seats:seatList[Math.floor(randomSeat)],
      fuel:fuelF
    };
    vinList.push(vinF);
    priceList.push(priceF)
    carList.push(car);
    console.log("Faked car");
  }
  return carList;
};

const generateRentals = () => {
  let date=new Date().toLocaleDateString('en-GB');

  let rentingList = [];
  const users = ["teo@gmail.com", "teod@gmail.com"];
  for (let i = 0; i < 5; i++) {
    let daysBetween=Math.floor(Math.random() * (30-10) + 10)
    let random=Math.random() * vinList.length;
    let rental = {
      vin: vinList[Math.floor(random)],
      days:daysBetween,
      user: users[Math.floor(Math.random() * users.length)],
      dateStart:new Date(new Date().setDate(new Date().getDate()-daysBetween)).toLocaleDateString('en-GB'),
      dateEnd:date,
      price:daysBetween*priceList[Math.floor(random)]
    };
    console.log(rental.dateStart)
    console.log("Faked rental");
    rentingList.push(rental);
  }
  return rentingList;
};

module.exports = { generateCars, generateRentals };
