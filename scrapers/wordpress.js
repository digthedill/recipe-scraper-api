const cheerio = require("cheerio");
const fetchData = require("../utils/fetchData");

const db = require("../db");
const stockPhoto = require("../utils/randomPhoto");

const scrapeWordpress = async (url, uid) => {
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

  recipe.title = $(".wprm-recipe-name").text();
  recipe.description = $("div.wprm-recipe-summary span").text().trim();

  //setup some logic that either generates a food photo OR only accept url photos AND prevent thumbnails
  recipe.image = $("div.wprm-recipe-image img").attr("src");
  recipe.ingredients = [];
  recipe.steps = "";
  recipe.uid = uid;
  recipe.srcUrl = url;

  $(".wprm-recipe-ingredient").each((i, elem) => {
    const item = $(elem).text().replace(/\s\s+/g, " ").trim();
    recipe.ingredients.push(item);
  });

  $("ul.wprm-recipe-instructions").each((i, elem) => {
    const step = $(elem)
      .find("li.wprm-recipe-instruction")
      .text()
      .replace(/\s\s+/g, " ")
      .trim();
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

module.exports = scrapeWordpress;
