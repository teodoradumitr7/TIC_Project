const router = require("express").Router();
const db = require("../db");
//ruta preluare masini din bd
//daca nu e niciuna returneaza 404 not found
//altfel le preia si trimite la front o lista de obj de tip masina
router.get("/cars", async (req, res) => {
  try {
    let cars = [];
    const result = await db.collection("cars").get();

    result.forEach((doc) => {
      let car = {
        id: doc.id,
        manufacturer: doc.data().manufacturer,
        model: doc.data().model,
        price: doc.data().price,
        vin: doc.data().vin,
        image: doc.data().image,
        seats: doc.data().seats,
        fuel: doc.data().fuel,
      };
      cars.push(car);
    });
    if (cars != null && cars.length > 0) res.status(200).json(cars);
    else {
      res.status(404).json("Cars not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
