const router = require("express").Router();
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

router.get("/cars", async (req, res) => {
    let cars = [];
    const result = await db.collection("cars").get();
  
    result.forEach((doc) => {
      let car = {
        id: doc.id,
        manufacturer: doc.data().manufacturer,
        model: doc.data().model,
        price: doc.data().price,
      };
      cars.push(car);
    });
    res.json(cars);
  });


module.exports = router;
