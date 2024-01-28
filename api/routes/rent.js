const router = require("express").Router();
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { uuid } = require("uuidv4");

async function checkAuthorization(req, res, next) {
  //console.log("a trecut prin middleware");
  //mai degraba daca auth e acelasi cu local storage
  let token = req.headers.authorization;
  const filteredUsers = db.collection("users");
  const snapshot = await filteredUsers.where("id", "==", token).get();
  if (snapshot.empty) {
    res.status(401).json("User is not auth");
    console.log("No matching user emails.");
    return;
  } else {
    req.email = snapshot;
    //we have access to the identification data used to generate the token
    //this way we can write a logic to access only the resources for which
    //a request is authorized
    next();
  }
}

//post rental req
router.post("/rentals/:id", checkAuthorization, async (req, res) => {
  let rental = {
    vin: req.body.vin,
    days: daysBetweenDates(req.body.dateEnd, req.body.dateStart),
    user: req.body.user,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    price:
      req.body.price * daysBetweenDates(req.body.dateEnd, req.body.dateStart),
  };

  let dayD, monthD, yearD;
  let dayR, monthR, yearR;
  let rentalId = uuid();
  if (rental.dateEnd.includes("/")) {
    [dayD, monthD, yearD] = rental.dateStart.split("/");
    [dayR, monthR, yearR] = rental.dateEnd.split("/");
  } else {
    [yearD, monthD, dayD] = rental.dateStart.split("-");
    [yearR, monthR, dayR] = rental.dateEnd.split("-");
    rental.dateStart = dayD + "/" + monthD + "/" + yearD;
    rental.dateEnd = dayR + "/" + monthR + "/" + yearR;
  }
  let ok = 1;
  const allRentalsForVin = await db
    .collection("rentals")
    .doc(rental.vin)
    .collection("rented")
    .get();
  allRentalsForVin.forEach((doc) => {
    let dayNewD, monthNewD, yearNewD;
    let dayNewR, monthNewR, yearNewR;
    if (doc.data().dateEnd.includes("/")) {
      [dayNewD, monthNewD, yearNewD] = doc.data().dateStart.split("/");
      [dayNewR, monthNewR, yearNewR] = doc.data().dateEnd.split("/");
    } else {
      [yearNewD, monthNewD, dayNewD] = doc.data().dateStart.split("-");
      [yearNewR, monthNewR, dayNewR] = doc.data().dateEnd.split("-");
    }
    if (yearD == yearNewD) {
      if (monthD == monthNewD) {
        if (dayR == dayNewR || dayD == dayNewD) {
          ok = 0;
          //return res.status(400).json({ message: "Data nu este buna" });
        } else if (dayNewD >= dayD && dayR >= dayNewR) {
          ok = 0;
          //return res.status(400).json({ message: "Data nu este buna" });
        } else if (dayNewD >= dayD && dayNewD <= dayR && dayNewR >= dayR) {
          ok = 0;
          // return res.status(400).json({ message: "Data nu este buna" });
        } else if (dayNewD <= dayD && dayNewR >= dayD && dayNewR <= dayR) {
          ok = 0;
          // return res.status(400).json({ message: "Data nu este buna" });
        }
        console.log(ok);
      }
    }
  });
  console.log("nr zile");
  console.log(rental.days);
  if (ok == 1) {
    let rentalRentedRef = db
      .collection("rentals")
      .doc(rental.vin)
      .collection("rented")
      .doc(rentalId);
    let rentalRentedDoc = await rentalRentedRef.get();
    let response;

    if (!rentalRentedDoc.exists) {
      let rentalRentedDocData = {
        rentalId: rentalId,
        user: rental.user,
        vin: rental.vin,
        dateStart: rental.dateStart,
        dateEnd: rental.dateEnd,
        price: rental.price,
        days: rental.days,
      };
      response = await rentalRentedRef.set(rentalRentedDocData);
    }

    let addToUserRef = db
      .collection("users")
      .doc(rental.user)
      .collection("rented")
      .doc(rentalId);
    let addToUserDoc = await addToUserRef.get();

    if (!addToUserDoc.exists) {
      let addToUserDocData = {
        rentalId: rentalId,
        user: rental.user,
        vin: rental.vin,
        dateStart: rental.dateStart,
        dateEnd: rental.dateEnd,
        price: rental.price,
        days: rental.days,
      };
      let addToUserResponse = await addToUserRef.set(addToUserDocData);
    }

    res.status(201).json(response);
  } else {
    return res.status(400).json("Data nu este buna");
  }
});

//put rental req
router.put("/rentals/:id", checkAuthorization, async (req, res) => {
  //TODO vad daca exista in bd vinul, daca da atunci verific cand e luat pt toate si apoi abia adaug

  console.log(req.params.id);
  let rental = {
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    days: daysBetweenDates(req.body.dateEnd, req.body.dateStart),
    price:
      daysBetweenDates(req.body.dateEnd, req.body.dateStart) * req.body.price,
  };

  console.log(req.headers.vin);
  let response = await db
    .collection("users")
    .doc(req.headers.email)
    .collection("rented")
    .doc(req.params.id)
    .update(rental);

  let respCar = await db
    .collection("rentals")
    .doc(req.headers.vin)
    .collection("rented")
    .doc(req.params.id)
    .update(rental);

  res.status(200).json(response);
});

//delete rental req
router.delete("/rentals/:id", checkAuthorization, async (req, res) => {
  let response = await db
    .collection("users")
    .doc(req.headers.email)
    .collection("rented")
    .doc(req.params.id)
    .delete();

  console.log(req.headers.vin);
  let respCar = await db
    .collection("rentals")
    .doc(req.headers.vin)
    .collection("rented")
    .doc(req.params.id)
    .delete();
  res.status(200).json("Deleted rental req");
});

function daysBetweenDates(dateEnd, dateStart) {
  let day1, month1, year1;
  let day2, month2, year2;
  if (dateEnd.includes("/")) {
    [day2, month2, year2] = dateStart.split("/");
    [day1, month1, year1] = dateEnd.split("/");
  } else {
    [year2, month2, day2] = dateStart.split("-");
    [year1, month1, day1] = dateEnd.split("-");
  }

  // const [day1, month1, year1] = date1.split('/');
  // const [day2, month2, year2] = date2.split('/');
  const dateObj1 = new Date(`${year1}-${month1}-${day1}`);
  const dateObj2 = new Date(`${year2}-${month2}-${day2}`);
  const diffInMs = Math.abs(dateObj2 - dateObj1);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
}

// const snapshot = await result.where('id', '==', req.params.email).get();
// const rentalReq= snapshot.collection("rentals");

router.get("/rentals/:email", async (req, res) => {
  let rentals = [];
  const result = await db
    .collection("users")
    .doc(req.params.email)
    .collection("rented")
    .get();
  result.forEach((doc) => {
    let rental = {
      id: doc.id,
      days: doc.data().days,
      user: doc.data().user,
      vin: doc.data().vin,
      dateStart: doc.data().dateStart,
      dateEnd: doc.data().dateEnd,
      price: doc.data().price,
    };
    rentals.push(rental);
  });
  res.json(rentals);
});
module.exports = router;
