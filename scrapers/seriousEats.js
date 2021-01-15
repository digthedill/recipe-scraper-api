const cheerio = require("cheerio");
const fetchData = require("../utils/fetchData");

const db = require("../db");
const stockPhoto = require("../utils/randomPhoto");

const scrapeSerious = async (url, uid) => {
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
  recipe.title = $("h1.title").text();
  recipe.description = $("div.recipe-introduction-body").children("p").text();
  recipe.image = $("img.photo").attr("src");
  recipe.ingredients = [];
  $("div.recipe-ingredients")
    .children("ul")
    .children()
    .each((i, el) => {
      recipe.ingredients.push($(el).text());
    });
  recipe.steps = [];
  $("ol.recipe-procedures-list")
    .children()
    .each((i, el) => {
      const item = $(el).text().replace(/\s\s+/g, " ").trim().slice(3);
      recipe.steps.push(item);
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

module.exports = scrapeSerious;
