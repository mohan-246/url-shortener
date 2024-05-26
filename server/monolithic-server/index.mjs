import express from "express";
import cors from "cors";
import connect from "./functions/setupDatabase.mjs";
import URLModel from "./schemas/urlSchema.mjs";
import admin from "firebase-admin";
import "dotenv/config.js";
import serviceAccount from "./firebase/serviceAccountKey.mjs";
import base10ToBase62 from "./functions/base10ToBase62.mjs";

const app = express();

app.use(
  cors({
    origin: `${process.env.SITE_URL}`,
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
app.use(express.json());
connect();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

let currentRange = 3521614606208,
  currentID = 0;
app.get("/urls", async (req, res) => {
  const idToken = req.headers.authorization;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log(uid);
    const urls = await URLModel.find({ userId: uid });
    console.log(uid);
    res
      .status(200)
      .json({ message: "Fetched user data successfully", urls: urls });
  } catch (error) {
    console.error(error.code, error.message);
    res
      .status(500)
      .json({ message: "Can't authenticate user or fetch data", error: error });
  }
});
app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const shortUrl = `${process.env.SERVER_URL}/${id}`;
    const url = await URLModel.findOne({ shortUrl: shortUrl });
    if (url) {
      url.clicks++;
      await url.save();
      res.redirect(url.longUrl);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (error) {
    console.error("Error handling redirection:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/shorten", async (req, res) => {
  const idToken = req.headers.authorization;
  const longUrl = req.body.longUrl;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    let siteId = currentID++;
    if (currentID >= currentRange) {
      currentID = 0;
    }

    const shortUrl = `${process.env.SERVER_URL}/${base10ToBase62(siteId)}`;

    try {
      const url = new URLModel({
        longUrl,
        siteId,
        shortUrl,
        userId: uid,
      });
      await url.save();
      res
        .status(200)
        .json({ message: "Authenticated user and shortened link", url: url });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "can't shorten link", error: err });
    }
  } catch (error) {
    console.log(error.code, error.message);
    res.status(500).json({ message: "Can't authenticate user", error: error });
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
