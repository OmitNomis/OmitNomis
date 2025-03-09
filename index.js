require("dotenv").config({
  path: [".env.local", ".env"],
});

const Mustache = require("mustache");
const fs = require("fs");
const axios = require("axios");

const MUSTACHE_MAIN_DIR = "./main.mustache";
const PEXELS_ACCESS_KEY = process.env.PEXELS_ACCESS_KEY;

const DATA = {
  lastUpdated: new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  }),
};

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
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
    const response = await axios.get("https://api.pexels.com/v1/curated", {
      headers: {
        Authorization: PEXELS_ACCESS_KEY,
      },
      params: {
        per_page: 1,
        page: 1,
      },
    });

    const photo = response.data.photos[0];
    DATA.photoUrl = photo.src.original;
    DATA.photographerName = photo.photographer;
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
