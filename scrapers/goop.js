const cheerio = require("cheerio");
const fetchData = require("../utils/fetchData");

const db = require("../db");
const stockPhoto = require("../utils/randomPhoto");

const scrapeGoop = async (url, uid) => {
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

  recipe.title = $(".post__heading-1").text();
  recipe.description = $("div.recipes__excerpt").children("p").text();
  recipe.steps = [];
  recipe.ingredients = [];
  $("div.recipes__instructions")
    .children()
    .each((i, el) => {
      const item = $(el).text().slice(3);
      recipe.steps.push(item);
    });
  $("div.recipes__ingredients")
    .children()
    .each((i, el) => {
      const item = $(el).text();
      recipe.ingredients.push(item);
    });
  recipe.image = $("img.post__featured-image").attr("data-src");
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

module.exports = scrapeGoop;
