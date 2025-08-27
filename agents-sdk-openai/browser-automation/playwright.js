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
    // await page.goto("https://ui.chaicode.com");
    await page.goto("https://ui.chaicode.com/auth-sada/signup");
    console.log("Page title:", await page.title());

    // Step 3.1: Find the form element
    const form = page.locator("form");
    if (form) {
      console.log("Form found on the page");
    } else {
      console.log("Form not found on the page");
    }

    // Step 3.2: Fill the form fields using Playwright's fill() method (fullname, email, password)
    await page.getByRole("textbox", { name: "Full Name" }).fill("Manoj Kumar");
    await page.getByRole("textbox", { name: "Email" }).fill("manoj@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("Manoj@123");
    console.log("Form fields filled successfully");

    // Step 3.3: Take action/submit the form using Playwright's click() method
    await page
      .getByRole("button", { name: "Create Account" })
      .click({ delay: 3000 });
    console.log("Form submitted successfully");

    // Step 4: Take a screenshot
    // await page.screenshot({ path: "screenshot.png" });
    await form.screenshot({ path: "form-screenshot.png" });
    console.log("Screenshot taken and saved as screenshot.png");

    // Step 5: Convert screenshot to base64
    const screenshotBuffer = await form.screenshot();
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

Actual Process in Real World Scenarios:
1. Instead of taking screenshot of the whole page, we will take screenshot of a specific element on the page using built-in locators in Playwright. like page.getByRole('button', { name: 'Submit' }).screenshot(). Docs: https://playwright.dev/docs/locators#locate-by-role

::::::👍 Now this code is updated to take screenshot of a specific element on the page (a form in this case)::::::

2. Now we will fill the form fields using Playwright's fill() method. like page.getByRole('textbox', { name: 'Email' }).fill('manoj@gmail.com'). Docs: https://playwright.dev/docs/api/class-locator#locator-fill

:::::👍 Now this code is updated to fill the form fields (fullname, email, password)::::::

3. Now we will take action/submit the form using Playwright's click() method. like page.getByRole('button', { name: 'Submit' }).click(). Docs: https://playwright.dev/docs/api/class-locator#locator-click

Now this code is updated to submit the form by clicking on the "Create Account" button. and also added the necessary waits internally by Playwright.

And fixed "Error during browser automation: elementHandle.screenshot: Element is not attached to the DOM" through page.locator() instead of page.$().

:::::👍 Now this code is updated to submit the form by clicking on the "Create Account" button::::::

Problems:

1. Not returning the output of the form submission (like success message, error message, etc) after submitting the form. This can be done by waiting for a specific element to appear on the page after form submission and then extracting its text content.
 > How to resolve this? docs: https://playwright.dev/docs/api/class-locator#locator-wait-for

2. I want to locate the authentication form automatically instead of hardcoding the form fields and button names.
3. I want to handle different website structures and form designs dynamically. just like humans do. through searching for keywords like "sign up", "register", "create account", etc in the page content and then locating the form fields and buttons accordingly. and also handling different form field types like textboxes, dropdowns, checkboxes, etc. and navigating from one page to another if form is not found on the current page. and also handling captchas if present on the page.

Resources: https://playwright.dev/docs/screenshots
*/
