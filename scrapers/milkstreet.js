const cheerio = require("cheerio");
const fetchData = require("../utils/fetchData");

const db = require("../db");
const stockPhoto = require("../utils/randomPhoto");

const scrapeMilkStreet = async (url, uid) => {
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

  recipe.title = $("h1.recipe-header__title").text();
  recipe.description = $("div.recipe-header__story--nocol").children().text();
  recipe.image = `https://www.177milkstreet.com${$(
    "img.gallery-cell--hero-image"
  ).attr("src")}`;

  recipe.ingredients = [];
  $("div.ingredients-list")
    .children(".ingredient")
    .each((i, el) => {
      const quantity = $(el).find(".ingredient__quantity").text();
      const item = $(el).find(".ingredient__label").text();
      recipe.ingredients.push(`${quantity} ${item}`);
    });

  recipe.steps = [];
  $("ol.recipe__directions__list")
    .children()
    .each((i, el) => {
      const item = $(el).text().replace(/\s\s+/g, " ");
      recipe.steps.push(item);
    });

  if (!recipe.image) {
    recipe.image = stockPhoto;
  }
  console.log(recipe);
};

module.exports = scrapeMilkStreet;
