import express from "express"; 
import cors from "cors"; 
import connect from "./functions/setupDatabase.mjs";
import URLModel from "./schemas/urlSchema.mjs";   

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET",
  })
);
app.use(express.json())
connect();
 
app.get('/:id', async (req, res) => {
    
    try {
       const id = req.params.id;
       console.log(id)
      const shortUrl = `http://localhost:3002/${id}`
      const url = await URLModel.findOne({shortUrl : shortUrl})
      url.clicks++
      await url.save()
      res.redirect(url.longUrl)
    } catch (error) {
      console.error('Error handling redirection:', error);
      res.status(500).send('Internal Server Error');
    }
  });
const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
