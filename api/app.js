const express = require("express");
//framework care are feature uri pt creare aplic web/mobile, layer creat peste node
const app = express();
const port = process.env.PORT || 3000;
//Cross-Origin Resource Sharing-clientul front end face requesturi pe resurse
//permite accesul la resursele serverului Express.js de pe o altă origine, de ex un server cu un domeniu dif
const cors = require("cors");
//logging tool->middleware, folos in implementarea http servers cu node si express
const logger = require("morgan");
const db = require("./db");
const { generateCars, generateRentals } = require("../api/utils");
const carRouter = require("../api/routes/car");
const rentalRouter = require("../api/routes/rent");
//unique id folosit pt crearea doc din bd
const { uuid } = require('uuidv4');

//folosit pt a parsa request urile din body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
//configureaza morgan sa arate log uri pe developement mode
app.use(logger("dev"));

app.use("/", carRouter);
app.use("/", rentalRouter);

//err handling middleware funct pe express
//in express o fct middleware are acces la req,res si next
app.use((error, request, response, next) => {
  console.error(`[ERROR]: ${error}`);
  response.status(500).json(error);
});

//ruta de mocking pt masini
app.get("/populateCars", async (req, res) => {
  let carMock = generateCars();
  carMock.forEach(async (car) => {
    await db.collection("cars").add(car);
  });
  res.send("PopulateCars");
});

//ruta mocking pt inchirieri
//adauga si in useri rented pt fiecare
app.get("/populateRentals", async (req, res) => {
  let rentalMock = generateRentals();
  rentalMock.forEach(async (rent) => {
    let rental = {
      vin: rent.vin,
        days: daysBetweenDates(rent.dateEnd,rent.dateStart),
        user: rent.user,
        dateStart:rent.dateStart,
        dateEnd:rent.dateEnd,
        price:rent.price*daysBetweenDates(rent.dateEnd,rent.dateStart)
    };
    
    let rentalId = uuid();
  
  let rentalRentedRef = db.collection("rentals").doc(rental.vin).collection("rented").doc(rentalId);
  let rentalRentedDoc = await rentalRentedRef.get();
  let response;
  
  if (!rentalRentedDoc.exists) {
    let rentalRentedDocData = {
      rentalId: rentalId,
      user: rental.user,
      vin: rental.vin,
      dateStart: rental.dateStart,
      dateEnd: rental.dateEnd,
      price:rental.price*daysBetweenDates(rental.dateEnd,rental.dateStart),
      days:rental.days
    };
    response = await rentalRentedRef.set(rentalRentedDocData);
  }
  
  let addToUserRef = db.collection("users").doc(rental.user).collection("rented").doc(rentalId);
  let addToUserDoc = await addToUserRef.get();
  
  if (!addToUserDoc.exists) {
    let addToUserDocData = {
      rentalId: rentalId,
      user: rental.user,
      vin: rental.vin,
      dateStart: rental.dateStart,
      dateEnd: rental.dateEnd,
      price:rental.price*daysBetweenDates(rental.dateEnd,rental.dateStart),
      days:rental.days
    };
    let addToUserResponse = await addToUserRef.set(addToUserDocData);
  } 
  });
  res.send("PopulateRental");
});

//diferenta in zile intre 2 date
function daysBetweenDates(date1, date2) {
  const [day1, month1, year1] = date1.split('/');
  const [day2, month2, year2] = date2.split('/');
  const dateObj1 = new Date(`${year1}-${month1}-${day1}`);
  const dateObj2 = new Date(`${year2}-${month2}-${day2}`);
  const diffInMs = Math.abs(dateObj2 - dateObj1);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
}

//register ca sa salveze si in firebase userul si id ul unic
//folosit la checkAutorization
app.post("/register", async (req, res) => {
  let user = req.body;
  console.log("trying to post the following data: ", user);
  console.log(user.accesToken)
  console.log(user.stsTokenManager.accesToken)
  let addUser = {
    id: user.uid,
    email: user.email
  };
  console.log(addUser)
      const dbUser = await db.collection("users").doc(addUser.email).set(addUser);
   
      console.log("saved user ",addUser)
      res.send(
        "The user has been successfully added with following id " + user.uid
      );

});

//login user
app.post("/login", async (req, res) => {
  let user = req.body;
   
        res.json({
          token: user.accesToken,
          name: user.email,
        });
      
});

//start server
//face bind cu portul pe care l am pus eu
app.listen(port, () => {
  console.log(`Backend listening on port ${port}!`);
});


