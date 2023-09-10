const express = require("express");
const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} = require("firebase/auth");
const { getFirestore } = require("firebase-admin/firestore");
const credential = require("./serviceAccountKey.json");
const app = express();
const port = process.env.PORT || 3000;

const firebaseConfig = {
  
};

admin.initializeApp({
  credential: admin.credential.cert(credential),
});

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
let uid;
const db = getFirestore();

// Rotte
app.get("/", (req, res) => {
  res.sendFile("index.html", {root: __dirname  +  "/public"});
});

app.use(express.json()); //To accept data in JSON format

app.use(express.urlencoded({ extended: true })); //To decode data of HTML form

app.use(express.static(__dirname + "/public"));

// Avvia il server
app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});

//Firebase Auth
app.post("/signUpUsers", (req, res) => {
  admin
    .auth()
    .createUser({
      email: req.body.email,
      emailVerified: false,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      displayName: req.body.displayName,
      disabled: false,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
    });
});

app.post("/signUpGuides", async (req, res) => {
  await admin
    .auth()
    .createUser({
      email: req.body.email,
      emailVerified: false,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      displayName: req.body.displayName,
      disabled: false,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      uid = userRecord.uid;
      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
    });

  const dates = {
    idNumber: req.body.idNumber,
    workingPlaces: req.body.workingPlaces
  };

  uidString = String(uid);

  db.collection("Guides")
    .doc(uidString)
    .set(dates) // Per salvare un nuovo oggetto con una chiave generata automaticamente
    .then((snapshot) => {
      console.log("Dati salvati con successo:", snapshot.key);
    })
    .catch((error) => {
      console.error("Errore durante il salvataggio dei dati:", error);
    });
});

app.post("/signIn", (req, res) => {
  // Authenticate a user with Firebase Authentication
  signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((userCredential) => {
      // User is authenticated
      const user = userCredential.user;
      console.log(`User ${user.email} is authenticated`);
    })
    .catch((error) => {
      // Authentication failed
      console.error("Authentication failed:", error);
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
   const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});
