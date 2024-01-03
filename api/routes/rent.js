const router = require("express").Router();
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");


//post rental req
router.post("/rentals", async (req, res) => {
  let rental = {
    vin: req.body.vin,
      days: daysBetweenDates(req.body.dateEnd,req.body.dateStart),
      user: req.body.user,
      dateStart:req.body.dateStart,
      dateEnd:req.body.dateEnd
  };

  let response = await db
    .collection("rentals")
    .add(rental);

  res.json(response);
});

//put rental req
router.put("/rentals/:id", async (req, res) => {
  let rental = {
    dateStart:req.body.dateStart,
    dateEnd:req.body.dateEnd,
    days:daysBetweenDates(req.body.dateEnd,req.body.dateStart)
  };


  let response = await db
    .collection("rentals")
    .doc(req.params.id)
    .update(rental);

  res.json(response);
});

//delete rental req
router.delete("/rentals/:id", async (req, res) => {
 

  let response = await db
    .collection("rentals")
    .doc(req.params.id)
    .delete();

  res.json("Deleted rental req");
});

function daysBetweenDates(date1, date2) {
  const [day1, month1, year1] = date1.split('/');
  const [day2, month2, year2] = date2.split('/');
  const dateObj1 = new Date(`${year1}-${month1}-${day1}`);
  const dateObj2 = new Date(`${year2}-${month2}-${day2}`);
  const diffInMs = Math.abs(dateObj2 - dateObj1);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
}


router.get("/rentals", async (req, res) => {
  let rentals = [];
  const result = await db.collection("rentals").get();

  result.forEach((doc) => {
    let rental = {
      id: doc.id,
      days: doc.data().days,
      user: doc.data().user,
      vin: doc.data().vin,
      dateStart:doc.data().dateStart,
      dateEnd:doc.data().dateEnd
    };
    rentals.push(rental);
  });
  res.json(rentals);
});
module.exports = router;
