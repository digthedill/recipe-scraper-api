const cheerio = require("cheerio");
const fetchData = require("../utils/fetchData");

const db = require("../db");
const stockPhoto = require("../utils/randomPhoto");

const scrapeDelish = async (url, uid) => {
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
  recipe.title = $("h1.recipe-hed").text();
  recipe.description = $("div.recipe-introduction").children("p").text();

  recipe.image = $("div.content-lede-image-wrap").children("img").attr("src"); //no image site
  if (!recipe.image) {
    recipe.image = stockPhoto;
  }
  //   ADD IMAGE LOGIC FOR THE THE FOLDER OF FREE FOOD IMAGES!

  recipe.ingredients = [];
  $("div.ingredient-lists")
    .children()
    .each((i, el) => {
      const quantity = $(el)
        .find(".ingredient-amount")
        .text()
        .replace(/\s\s+/g, " ")
        .trim();
      const item = $(el).find(".ingredient-description").text();
      recipe.ingredients.push(quantity + " " + item);
    });

  recipe.steps = [];
  $("div.direction-lists")
    .children()
    .children()
    .each((i, el) => {
      const item = $(el).text().trim();
      recipe.steps.push(item);
    });

  recipe.srcUrl = url;
  recipe.uid = uid;

  db.collection("recipes")
    .add(recipe)
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
};

module.exports = scrapeDelish;
