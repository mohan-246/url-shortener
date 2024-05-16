import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import serviceAccount from './firebase/serviceAccountKey.mjs';
import URLModel from "./schemas/urlSchema.mjs";
import connect from './functions/setupDatabase.mjs';

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET",
    allowedHeaders: ["Authorization" , "Content-Type"],
    credentials: true,
  })
);
app.use(express.json())
connect();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
  
app.get("/urls", async (req, res) => {
    const idToken = req.headers.authorization;
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
  
      const urls = await URLModel.find({ userId: uid });

      res.status(200).json({ message: "Fetched user data successfully", urls: urls });
    } catch (error) {
      console.error(error.code, error.message);
      res.status(500).json({ message: "Can't authenticate user or fetch data", error: error });
    }
  });
  

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
