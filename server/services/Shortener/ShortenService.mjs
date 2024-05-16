import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import serviceAccount from "./firebase/serviceAccountKey.mjs";
import connect from "./functions/setupDatabase.mjs";
import URLModel from "./schemas/urlSchema.mjs";
import RangeModel from "./schemas/RangeSchema.mjs";
import base10ToBase62 from "./functions/base10ToBase62.mjs";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "POST",
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
app.use(express.json());
connect();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function getRange() {
  try { 
    const range = await RangeModel.findOne({ Name: 'Deploy' });
 
    if (range) {
      return range;
    } else { 
      const newRange = new RangeModel({
        Name: 'Deploy',
        currentRange: 100000
      });
      await newRange.save();
      return newRange.currentRange;
    }
  } catch (error) { 
    console.error('Error fetching or creating range:', error);
    throw error;
  }
}

let currentRange = 1000;
let count = 0;
app.post("/shorten", async (req, res) => {
  const idToken = req.headers.authorization;
  const longUrl = req.body.longUrl;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    console.log("success", uid);
    let siteId
    if(count + 1 < currentRange){
      siteId = count++;
    }
    else{
      currentRange = getRange()
      siteId = count++;
    }
    console.log(siteId , currentRange)
    const shortUrl = `http://localhost:3002/${base10ToBase62(siteId)}`;

    try {
      const url = new URLModel({
        longUrl,
        siteId,
        shortUrl,
        userId: uid,
      });
      await url.save();
      res.status(200).json({ message: "Authenticated user and shortened link", url: url });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "can't shorten link", error: err });
    }

    
  } catch (error) {
    console.log(error.code, error.message);
    res.status(500).json({ message: "Can't authenticate user", error: error });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
