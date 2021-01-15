const cheerio = require("cheerio");
const fetchData = require("../utils/fetchData");

const db = require("../db");
const stockPhoto = require("../utils/randomPhoto");

const removeDupe = (str) => {
  const firstWord = str.split(" ")[0];
  const duplicateWordIndex = str.indexOf(firstWord, 1);
  return str.substring(0, duplicateWordIndex);
};

const scrapeFoodNetwork = async (url, uid) => {
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

  recipe.title = removeDupe($("span.o-AssetTitle__a-HeadlineText").text());
  recipe.description = "";
  let almostImage = $("img.m-MediaBlock__a-Image").attr("src");
  recipe.image = "https:" + almostImage;

  recipe.ingredients = [];
  recipe.steps = "";
  recipe.uid = uid;
  recipe.srcUrl = url;

  $("div.assetDescription").each((i, elem) => {
    const desc = $(elem)
      .find("div.o-AssetDescription__a-Description")
      .text()
      .replace(/\s\s+/g, " ")
      .trim();
    recipe.description += desc;
  });

  $(".o-Ingredients__a-Ingredient--CheckboxLabel").each((i, elem) => {
    const item = $(elem).text().replace(/\s\s+/g, " ").trim();
    recipe.ingredients.push(item);
  });

  $("div.bodyRight").each((i, elem) => {
    const step = $(elem)
      .find("li.o-Method__m-Step")
      .text()
      .replace(/\s\s+/g, " ");
    //       .trim();;
    recipe.steps += step;
  });

  if (!recipe.image) {
    recipe.image = stockPhoto;
  }
  const arrayOfSteps = recipe.steps
    .split(".")
    .filter((val) => val.search(/\w/g) !== -1);
  recipe.steps = arrayOfSteps;
  recipe.ingredients.shift();

  db.collection("recipes")
    .add(recipe)
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
};

module.exports = scrapeFoodNetwork;
