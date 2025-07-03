import puppeteer from "puppeteer";

export const readUrl = async (url: string): Promise<string> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });
  await page.setViewport({ width: 1080, height: 1024 });

  const articleText = await page.evaluate(() => {
    const articleElement = document.querySelector("article");
    if (articleElement) return articleElement.innerText;

    const mainElement = document.querySelector("main");
    if (mainElement) return mainElement.innerText;

    return document.body.innerText;
  });

  await browser.close();
  return articleText;
};
