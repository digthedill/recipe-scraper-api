const cheerio = require("cheerio");
const fetchData = require("../utils/fetchData");

const db = require("../db");
const stockPhoto = require("../utils/randomPhoto");

const scrapeEpicurious = async (url, uid) => {
  if (!uid.length) {
    console.log("no userID submitted");
    return new Error("No userID");
  }

  let res = await fetchData(url);
  if (!res.data) {
    console.log("Invalid data Obj brahhhh");
    return;
  }
  const html = res.data;
  let recipe = new Object();
  const $ = cheerio.load(html);
  recipe.title = $("h1").text().trim();
  recipe.image = $("picture.photo-wrap").children("img").attr("srcset");
  recipe.description = $("div.dek").children("p").text().trim();
  recipe.ingredients = [];
  $("ul.ingredients")
    .children()
    .each((i, el) => {
      recipe.ingredients.push($(el).text());
    });
  recipe.steps = [];
  $("ol.preparation-steps")
    .children()
    .each((i, el) => {
      recipe.steps.push($(el).text().replace(/\s\s+/g, " ").trim());
    });
  recipe.srcUrl = url;
  recipe.uid = uid;

  if (!recipe.image) {
    recipe.image = stockPhoto;
  }

  db.collection("recipes")
    .add(recipe)
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
};

module.exports = scrapeEpicurious;
