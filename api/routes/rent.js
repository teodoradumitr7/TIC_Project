const router = require("express").Router();
const db = require("../db");
const { uuid } = require("uuidv4");

async function checkAuthorization(req, res, next) {
  //mai degraba daca auth e acelasi cu local storage
  //deci vad daca tokenul din local storage e acelasi cu id ul userului primit doar prin email
  let token = req.headers.authorization;
  const filteredUsers = db.collection("users");
  const snapshot = await filteredUsers.where("id", "==", token).get();
  if (snapshot.empty) {
    res.status(401).json("User is not auth");
    console.log("No matching user emails.");
    return;
  } else {
    req.email = snapshot;
    //acum am acces si st autorizat
    next();
  }
}

//post rental req
//verifica daca perioada este libera pt masina aleasa
//daca da, ok=1 si se face inchirierea
//altfel ok=0 si status 400 ca sa se schimbe data
//de asemenea sa nu fie data curenta> data de preluare
//si data returnare<data preluare
router.post("/rentals/:id", checkAuthorization, async (req, res) => {
  try {
    let rental = {
      vin: req.body.vin,
      days: daysBetweenDates(req.body.dateEnd, req.body.dateStart),
      user: req.body.user,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      price:
        req.body.price * daysBetweenDates(req.body.dateEnd, req.body.dateStart),
    };
//cum firebase pune data invers, trb verificat daca vine separata data cu - sau /, asa ca o putem modifica si sa avem ulterior mereu /
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
      console.log(rentalRentedDoc);
      console.log(rentalRentedRef);
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
        console.log(response);
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
      return res.status(400).json("Date not good");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//put rental req
//mai intai verific daca exista inainte
//apoi excluda rental req curent si verifica daca este posibila inchirierea noua
router.put("/rentals/:id", checkAuthorization, async (req, res) => {
  try {
    let rental = {
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      days: daysBetweenDates(req.body.dateEnd, req.body.dateStart),
      price:
        daysBetweenDates(req.body.dateEnd, req.body.dateStart) * req.headers.price,
    };
//primeste pretul de inchiriere al unei masini deoarece din front am trimis pret/days,deci cat costa efectiv masina pe zi
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
      .doc(req.headers.vin)
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
      if (doc.data().rentalId != req.body.rentalId) {
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
      }
    });
    if (ok == 1) {
      //pria data sterg inchirierea veche, dupa adaug pe aia noua, nu modific pe ac pt ca trebuie sa schimb si id ul asa
      let del1 = await db
        .collection("users")
        .doc(req.headers.email)
        .collection("rented")
        .doc(req.body.rentalId)
        .delete();

      console.log(req.headers.vin);
      let del2 = await db
        .collection("rentals")
        .doc(req.headers.vin)
        .collection("rented")
        .doc(req.body.rentalId)
        .delete();

      let rentalRentedRef = db
        .collection("rentals")
        .doc(req.headers.vin)
        .collection("rented")
        .doc(rentalId);
      let rentalRentedDoc = await rentalRentedRef.get();
      let response;

      if (!rentalRentedDoc.exists) {
        let rentalRentedDocData = {
          rentalId: rentalId,
          user: req.headers.email,
          vin: req.headers.vin,
          dateStart: rental.dateStart,
          dateEnd: rental.dateEnd,
          price: rental.price,
          days: rental.days,
        };
        response = await rentalRentedRef.set(rentalRentedDocData);
      }

      let addToUserRef = db
        .collection("users")
        .doc(req.headers.email)
        .collection("rented")
        .doc(rentalId);
      let addToUserDoc = await addToUserRef.get();

      if (!addToUserDoc.exists) {
        let addToUserDocData = {
          rentalId: rentalId,
          user: req.headers.email,
          vin: req.headers.vin,
          dateStart: rental.dateStart,
          dateEnd: rental.dateEnd,
          price: rental.price,
          days: rental.days,
        };
        let addToUserResponse = await addToUserRef.set(addToUserDocData);
      }

      res.status(201).json(response);
    } else {
      return res.status(400).json("Date not good");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete rental req
//doar daca n a trecut perioada pot sa anulez cererea de inchiriere
router.delete("/rentals/:id", checkAuthorization, async (req, res) => {
  try {
    let dayD, monthD, yearD;
    console.log(req.headers.start);
    if (req.headers.start.includes("/")) {
      [dayD, monthD, yearD] = req.headers.start.split("/");
    } else {
      [yearD, monthD, dayD] = req.headers.start.split("-");
    }
    const current = new Date();
    const dateObj1 = new Date(`${yearD}-${monthD}-${dayD}`);
    if (current < dateObj1) {
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
    } else {
      res.status(400).json("Cannot cancel date");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//nr zile intre 2 date
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
  const dateObj1 = new Date(`${year1}-${month1}-${day1}`);
  const dateObj2 = new Date(`${year2}-${month2}-${day2}`);
  const diffInMs = Math.abs(dateObj2 - dateObj1);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
}

//inchirierile unui user
router.get("/rentals/:email", async (req, res) => {
  try {
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
    console.log(rentals.length);
    if (rentals != null && rentals.length > 0) res.status(200).json(rentals);
    else {
      res.status(404).json("Rentals not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
