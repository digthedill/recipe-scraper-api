const bonApp = require("../scrapers/bonapp");
const newYork = require("../scrapers/newyork");
const allRecipe = require("../scrapers/allrecipes");
const foodNetwork = require("../scrapers/foodnetwork");
const wordpress = require("../scrapers/wordpress");
const goop = require("../scrapers/goop");
const milkStreet = require("../scrapers/milkstreet");
const seriousEats = require("../scrapers/seriousEats");
const delish = require("../scrapers/delish");
const epicurious = require("../scrapers/epicurious");
const kate = require("../scrapers/katescarlata");
const theKitchn = require("../scrapers/kitchn");
const foodAndWine = require("../scrapers/foodandwine");

const parseUrltoScraper = (url, uid) => {
  if (url.includes("nytimes")) {
    newYork(url, uid);
  } else if (url.includes("bonappetit")) {
    bonApp(url, uid);
  } else if (url.includes("allrecipes")) {
    allRecipe(url, uid);
  } else if (url.includes("foodnetwork")) {
    foodNetwork(url, uid);
  } else if (url.includes("goop")) {
    goop(url, uid);
  } else if (url.includes("177milkstreet")) {
    milkStreet(url, uid);
  } else if (url.includes("seriouseats")) {
    seriousEats(url, uid);
  } else if (url.includes("delish")) {
    delish(url, uid);
  } else if (url.includes("epicurious")) {
    epicurious(url, uid);
  } else if (url.includes("katescarlata")) {
    kate(url, uid);
  } else if (url.includes("foodandwine")) {
    foodAndWine(url, uid);
  } else if (url.includes("thekitchn")) {
    theKitchn(url, uid);
  } else {
    //can I parse the url?? or could I setup a cheerio scrape in the meta data
    wordpress(url, uid);
  }
};

module.exports = parseUrltoScraper;
