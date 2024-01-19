const router = require("express").Router();
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

async function checkAuthorization(req, res, next) {
  console.log("a trecut prin middleware");
//mai degraba daca auth e acelasi cu local storage
  let token = req.headers.authorization;
  console.log(token)
  const filteredUsers =  db.collection('users');
  const snapshot = await filteredUsers.where('id', '==', token).get();
        if (snapshot.empty) {
          res.status(401).json({
            error:"USer does not exist"
          })
          console.log('No matching user emails.');
          return;
    } else {
      req.email = snapshot
      //we have access to the identification data used to generate the token
      //this way we can write a logic to access only the resources for which
      //a request is authorized
      next();
    }

}

//post rental req
router.post("/rentals",checkAuthorization,async (req, res) => {
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

  res.status(201).json(response);
});

//put rental req
router.put("/rentals/:id", checkAuthorization,async (req, res) => {
  let rental = {
    dateStart:req.body.dateStart,
    dateEnd:req.body.dateEnd,
    days:daysBetweenDates(req.body.dateEnd,req.body.dateStart)
  };


  let response = await db
    .collection("rentals")
    .doc(req.params.id)
    .update(rental);

  res.status(200).json(response);
});

//delete rental req
router.delete("/rentals/:id",checkAuthorization, async (req, res) => {
 

  let response = await db
    .collection("rentals")
    .doc(req.params.id)
    .delete();

  res.status(200).json("Deleted rental req");
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
