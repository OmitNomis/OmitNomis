const Mustache = require("mustache");
const fs = require("fs");
const axios = require("axios");

const MUSTACHE_MAIN_DIR = "./main.mustache";
const UNSPLASH_ACCESS_KEY = "{{secrets.UNSPLASH_ACCESS.KEY}}";

const DATA = {};

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
    console.log("Readme Generation Complete");
  });
}
async function fetchRandomStoicQuote() {
  try {
    const response = await axios.get("https://stoic-quotes.com/api/quote");
    const quote = response.data;
    DATA.quote = quote.text;
    DATA.author = quote.author;
  } catch (error) {
    console.error("Error fetching random Stoic quote:", error.message);
  }
}

async function fetchRandomPhoto() {
  try {
    const response = await axios.get("https://api.unsplash.com/photos/random", {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        orientation: "portrait",
      },
    });

    const photo = response.data;
    DATA.photoUrl = photo.urls.full;
    DATA.photographerName = photo.user.name;
  } catch (error) {
    console.error("Error fetching random photo:", error.message);
  }
}

async function action() {
  await fetchRandomStoicQuote();
  await fetchRandomPhoto();
  await generateReadMe();
}

action();
