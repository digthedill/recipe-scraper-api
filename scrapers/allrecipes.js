const cheerio = require("cheerio");
const fetchData = require("../utils/fetchData");

const db = require("../db");
const stockPhoto = require("../utils/randomPhoto");

const scrapeAllRecipes = async (url, uid) => {
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

  recipe.title = $("h1.headline").text();
  recipe.description = $("div.recipe-summary p").text().trim();
  recipe.image = $("div.lead-media").attr("data-src");
  recipe.ingredients = [];
  recipe.steps = "";
  recipe.uid = uid;
  recipe.srcUrl = url;

  $(".ingredients-item").each((i, elem) => {
    const item = $(elem).text().replace(/\s\s+/g, " ").trim();
    recipe.ingredients.push(item);
  });

  $("ul.instructions-section").each((i, elem) => {
    const step = $(elem).find("p").text();
    recipe.steps += step;
  });

  if (!recipe.image) {
    recipe.image = stockPhoto;
  }

  const arrayOfSteps = recipe.steps
    .split(".")
    .filter((val) => val.search(/\w/g) !== -1);
  recipe.steps = arrayOfSteps;

  db.collection("recipes")
    .add(recipe)
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
};

module.exports = scrapeAllRecipes;
