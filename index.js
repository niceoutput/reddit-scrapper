const puppeteer = require("puppeteer");
const Sheet = require("./sheet");

const url =
  "https://old.reddit.com/r/learnprogramming/comments/j2e0f3/i_made_use_of_programming_for_the_first_time_in/";

(async function () {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const sheet = new Sheet();
  await sheet.load();
  // create sheet with title
  const title = await page.$eval(".title a", (el) => el.textContent);
  const sheetIndex = await sheet.addSheet(title.slice(0, 99), [
    "points",
    "text",
  ]);

  // expand all comment threads
  const expandButtons = await page.$$(".morecomments");

  // select all comments, scrape text and points
  const comments = await page.$$(".entry");
  const formattedComments = [];

  for (let comment of comments) {
    // scrape points
    const points = await comment
      .$eval(".score", (el) => el.textContent)
      .catch((err) => console.error("no score"));
    console.log({ points });
    // scrape texts
    const rawText = await comment
      .$eval(".usertext-body", (el) => el.textContent)
      .catch((err) => console.error("no text"));
    if (points && rawText) {
      const text = rawText.replace(/\n/g, "");
      formattedComments.push({ points, text });
    }
  }
  // sort comments by points
  formattedComments.sort((a, b) => {
    const pointsA = Number(a.points.split(" ")[0]);
    const pointsB = Number(b.points.split(" ")[0]);
    return pointsB - pointsA;
  });
  console.log(formattedComments.slice(0, 10));
  // insert into google spreadsheets
  sheet.addRows(formattedComments, sheetIndex);
  await browser.close();
})();
