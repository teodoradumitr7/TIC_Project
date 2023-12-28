const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const logger = require("morgan");
const db = require("./db");
const secret = "carRental";
const { generateCars} = require("../api/utils");
const carRouter = require("../api/routes/car");
const rentalRouter = require("../api/routes/rent");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger("dev"));

app.use("/", carRouter);
app.use("/", rentalRouter);

app.use((error, request, response, next) => {
  console.error(`[ERROR]: ${error}`);
  response.status(500).json(error);
});

//register user
//login user
//get cars
app.get("/populateCars",async (req,res)=>{
    // let carMock=generateCars();
    // carMock.forEach(async (car)=>{
    //     await db.collection("cars").add(car);
    // });
    //let cars=await db.collection("cars").get();
    res.send("PopulateCars");
});


app.listen(port, () => {
    console.log(`Backend listening on port ${port}!`);
  });