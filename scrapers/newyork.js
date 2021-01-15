const cheerio = require("cheerio");
const fetchData = require("../utils/fetchData");

const db = require("../db");
const stockPhoto = require("../utils/randomPhoto");

const scrapeNytCooking = async (url, uid) => {
  if (!uid.length) {
    console.log("no userID submitted");
    return new Error("No user ID!");
  }
  let res = await fetchData(url);
  if (!res.data) {
    console.log("Invalid data Obj brahhhh");
    return;
  }
  const html = res.data;
  let recipe = new Object();

  const $ = cheerio.load(html);

  $("div.recipe").each((i, item) => {
    recipe = {
      title: $(item).find("h1.recipe-title").text().trim(),
      description: $(item).find(".topnote").text().trim().split("\n")[0],
      steps: $(item)
        .find(".recipe-steps")
        .text()
        .replace(/\s\s+/g, " ")
        .split("\n")[0],
      uid: uid,
      srcUrl: url,
    };
  });
  recipe.image = $("article.recipe-detail-card").attr("data-seo-image-url");
  recipe.ingredients = [];
  const container = $("div.recipe-instructions").children("section");
  const units = container
    .children("ul.recipe-ingredients")
    .children("li")
    .children("span.quantity");

  $(".ingredient-name").each((i, el) => {
    const amount = $(units[i]).text().replace(/\s\s+/g, " ");
    const item = $(el).text().replace(/\s\s+/g, " ");
    recipe.ingredients.push(amount + " " + item);
  });
  recipe.ingredients.pop();

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

module.exports = scrapeNytCooking;
