import { chromium } from "playwright";

const browserAutomation = async () => {
  try {
    const browser = await chromium.launch({
      headless: false,
      chromiumSandbox: true,
      env: {},
      args: ["--disable-extensions", "--disable-file-system"],
    });
    console.log("Browser launched successfully");

    const page = await browser.newPage();
    await page.goto("https://ui.chaicode.com");
    console.log("Page title:", await page.title());
  } catch (error) {
    console.error("Error during browser automation:", error);
  }
};

browserAutomation();
