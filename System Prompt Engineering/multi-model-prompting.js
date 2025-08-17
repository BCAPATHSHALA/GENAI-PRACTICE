// USING CoT Prompting We Can Achieve It (Assignment)

if (pasredContent.step === "THINK") {
  console.log(`\t🧠`, pasredContent.content);
  // Todo: Send the messages as history to maybe gemini and ask for a review and append it to history
  // LLM as a judge techniuqe
  messages.push({
    role: "developer",
    content: JSON.stringify({
      step: "EVALUATE",
      content: "Nice, You are going on correct path",
    }),
  });

    continue;
}
