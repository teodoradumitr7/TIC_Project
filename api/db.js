const {
    initializeApp,
    applicationDefault,
    cert,
  } = require("firebase-admin/app");
  const {
    getFirestore,
    Timestamp,
    FieldValue,
  } = require("firebase-admin/firestore");

  const {
    getAuth
  }= require("firebase-admin/auth")
  
  const serviceAccount = require("../api/projecttic-df3d3-firebase-adminsdk-92flv-36f5d774ee.json");
  
  initializeApp({
    credential: cert(serviceAccount),
  });
  
  const db = getFirestore();
  module.exports = db;
  