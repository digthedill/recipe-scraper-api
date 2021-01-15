const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

//utils
const parseUrltoScraper = require("./utils/parseUrl");

// MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello world");
  // add information about the api
});

app.post("/recipe-scraper", async (req, res) => {
  try {
    const { url, uid } = await req.body;
    parseUrltoScraper(url, uid);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => console.log("server on " + PORT));
