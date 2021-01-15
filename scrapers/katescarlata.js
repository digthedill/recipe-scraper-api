const cheerio = require("cheerio");
const fetchData = require("../utils/fetchData");

const db = require("../db");
const stockPhoto = require("../utils/randomPhoto");

const scrapeKate = async (url, uid) => {
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

  recipe.title = $("h1.entry-title").text();
  recipe.image = $("img.aligncenter").attr("src");
  recipe.description = $("div.entry-content").children("p").text();
  recipe.ingredients = [];
  $("ul.zrdn-list")
    .children()
    .each((i, el) => {
      recipe.ingredients.push($(el).text().trim());
    });
  recipe.steps = [];
  $("ol.zrdn-list")
    .children()
    .each((i, el) => {
      recipe.steps.push($(el).text().trim());
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

module.exports = scrapeKate;
