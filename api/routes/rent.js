const router = require("express").Router();
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");


//post rental req
router.post("/rentals/:id", async (req, res) => {
  let rental = {
    carRented: req.body.car.model,
  };

  let response = await db
    .collection("rental")
    .doc(req.params.id)
    .collection("rental")
    .add(wine);

  res.json(response);
});



router.get("/rentals", async (req, res) => {
  let rentals = [];
  const result = await db.collection("rentals").get();

  result.forEach((doc) => {
    let rental = {
      id: doc.id,
      days: doc.data().days,
      user: doc.data().user,
      vin: doc.data().vin,
    };
    rentals.push(rental);
  });
  res.json(rentals);
});
module.exports = router;
