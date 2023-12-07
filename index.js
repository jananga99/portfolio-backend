import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId:process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
app.use(cors());


app.post("/contact", async (req, res) => {
  try {
    const name = req.body.firstName + ' ' + req.body.lastName;
    const email = req.body.email;
    const message = req.body.message;
    const phone = req.body.phone;
    const dataCollection = collection(db, 'contacts');

    const contactRef = await addDoc(dataCollection,{
      name: name,
      email: email,
      phone: phone,
      message: message,
    });
    res.json({ code: 200, status: "Message Sent", documentId: contactRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, status: "Unexpected error occured. Please try again later.", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});