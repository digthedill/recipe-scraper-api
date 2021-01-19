const cheerio = require("cheerio");
const fetchData = require("../utils/fetchData");

const db = require("../db");
const stockPhoto = require("../utils/randomPhoto");

const scrapeBonAppetit = async (url, uid) => {
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

  recipe.title = $("h1.split-screen-content-header__hed").text().trim();
  recipe.image = $("img.responsive-image__image").attr("src");
  recipe.description = $(".container--body-inner").text();
  recipe.uid = uid;
  recipe.srcUrl = url;
  recipe.ingredients = [];
  recipe.steps = [];
  const container = $('div[data-testid="IngredientList"]');
  const ingredientsContainer = container.children("div");
  const units = ingredientsContainer.children("p");
  const ingredients = ingredientsContainer.children("div");

  units.each((i, el) => {
    recipe.ingredients.push(`${$(el).text()} ${$(ingredients[i]).text()}`);
  });

  const instructionContainer = $('div[data-testid="InstructionsWrapper"]');

  instructionContainer.find("p").each((i, el) => {
    recipe.steps.push($(el).text());
  });

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

module.exports = scrapeBonAppetit;
