const cheerio = require("cheerio");
const fetchData = require("../utils/fetchData");

const db = require("../db");
const stockPhoto = require("../utils/randomPhoto");

const scrapeFoodAndWine = async (url, uid) => {
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
  recipe.description = $("div.recipe-summary").children("p").text().trim();
  recipe.image = $("meta[property='og:image']").attr("content");

  recipe.ingredients = [];
  $("ul.ingredients-section")
    .children()
    .each((i, el) => {
      const item = $(el)
        .find(".ingredients-item-name")
        .text()
        .replace(/\s\s+/g, " ")
        .trim();
      recipe.ingredients.push(item);
    });
  recipe.steps = [];
  $("ul.instructions-section")
    .children()
    .each((i, el) => {
      const item = $(el).find("p").text().trim();
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

module.exports = scrapeFoodAndWine;
