import { chromium } from "playwright";

const browserAutomation = async () => {
  try {
    // Step 1: Launch the browser
    const browser = await chromium.launch({
      headless: false,
      chromiumSandbox: true,
      env: {},
      args: ["--disable-extensions", "--disable-file-system"],
    });
    console.log("Browser launched successfully");

    // Step 2: Open a new page
    const page = await browser.newPage();

    // Step 3: Navigate to a URL
    await page.goto("https://ui.chaicode.com");
    console.log("Page title:", await page.title());

    // Step 4: Take a screenshot
    await page.screenshot({ path: "screenshot.png" });
    console.log("Screenshot taken and saved as screenshot.png");

    // Step 5: Convert screenshot to base64
    const screenshotBuffer = await page.screenshot();
    const screenshotBase64 = screenshotBuffer.toString("base64");
    console.log("Screenshot in base64 format:", screenshotBase64);

    // Close the browser
    await browser.close();
    console.log("Browser closed");
  } catch (error) {
    console.error("Error during browser automation:", error);
  }
};

browserAutomation();

/*
What does this code do?
---------------------------------------------------------------------------------------------------------
This code automates a web browser using the Playwright library. It performs the following steps:
1. Launches a Chromium browser instance in non-headless mode.
2. Opens a new browser page.
3. Navigates to the URL "https://ui.chaicode.com".
4. Takes a whole screenshot of the page and saves it as "screenshot.png".
5. Converts the screenshot to a base64 string and logs it to the console.
6. Closes the browser.

Disadvantages:
1. In this code, we will take a screenshot of the whole page. But in real world scenarios, we might need to take screenshot of a specific element on the page. like a button, form, etc.

2. Converting the whole screentshot to base64 (which can be a large image) and so this will give the error while sending it to the LLM as input due to the token limit. like 4k tokens for gpt-3.5-turbo and 8k tokens for gpt-4.

Resources: https://playwright.dev/docs/screenshots
*/
