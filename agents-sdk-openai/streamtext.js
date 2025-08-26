import "dotenv/config";
import { Agent, Runner } from "@openai/agents";
import chalk from "chalk";

// Create a simple storytelling agent
const agent = new Agent({
  name: "Storyteller",
  instructions:
    "You are a storyteller. You will be given a topic and you will tell a story about it.",
});

// Create a runner to run the agent
const runner = new Runner({
  model: "gpt-4o-mini",
});

// Main function to run the agent with streaming enabled
const init = async () => {
  console.log(chalk.bgCyan("  ● Text only stream  \n"));

  // Run the agent with streaming enabled
  const storytellerStream = await runner.run(
    agent,
    "Tell me a story about a manoj nishad (he is a software engineer).",
    {
      stream: true, // Enable streaming
    }
  );

  // If you only care about the text you can use the transformed textStream
  storytellerStream
    .toTextStream({
      compatibleWithNodeStreams: true,
    })
    .pipe(process.stdout);

  // waiting to make sure that we are done with handling the stream
  await storytellerStream.completed;

  console.log(chalk.bgCyan("\n\n  ● All event stream  \n"));
};

init();

/*
  ● Text only stream  

Once upon a time in the bustling city of Bangalore, there lived a software engineer named Manoj Nishad. With his unkempt hair and a collection of quirky T-shirts, Manoj was known as much for his technical prowess as he was for his delightful sense of humor. Day in and day out, he immersed himself in lines of code, transforming complex challenges into elegant solutions. However, amid the virtual world he so loved, he yearned for something more—an adventure that linked the digital realm to the vibrant life outside.

One crisp Monday morning, while sipping his steaming cup of coffee, Manoj stumbled upon an online competition called "Code for Good." The challenge aimed to develop software solutions for real-world problems, with prizes that included a chance to work with NGOs around the world. Without a second thought, he dove headfirst into the contest, his mind racing with ideas.

For weeks, Manoj worked tirelessly, poring over issues like climate change and education accessibility. He finally decided to create an app that facilitated skill-sharing amlessons in exchange for coding tutorials, for example.

As the deadline approached, Manoj often burned the midnight oil, fueled by the excitement of his vision. Late nights turned into early mornings filled with lessons in exchange for coding tutorials, for example.

As the deadline approached, Manoj often burned the midnight oil, fueled by the excitement of his vision. Late nights turned into early mornings filled with coding sprints and debugging sessions. He pushed through the challenges, infusing passion into every line of code. Finally, submission day arrived. Heart pounding, he hit “Send.”

Weeks passed, and as he sat in his small apartment, anxiously refreshing emails, he received the news: his project had made the final cut! Excitement surged through him, but it also brought an overwhelming sense of responsibility. On stage, surrounded by fellow innovators, Manoj presented "SkillSwap." The judges were impressed, but he felt most moved by the reactions of the audience, who recognized the potential for real change.

In the coming months, Manoj was invited to collaborate with NGOs across India. He worked with rural communities, helping farmers use technology to learn about sustainable practices. He found joy in bringing people together, watching them teach one another, and forge connections that transcended age and background.

One evening, at a community gathering facilitated by SkillSwap, an elderly farmer named Ramesh approached Manoj. With a warm smile, Ramesh shared how he had learned gardening techniques from a teacher in the nearby village and was now able to produce more food than ever. “You made this possible,” Ramesh said, playfully patting Manoj on the back. The engineer’s heart swelled with pride, but he quickly reminded himself, “It was the community that made it happen.”   

Months later, during the final event of the competition, “SkillSwap” was recognized not just for its innovative design but for the real impact it had created in communities throughout India. Manoj stood on stage again, but this time, he was joined by many of the community members he had worked with. As they took center stage, it became clear that their stories of growth and connection were the true highlight—not just his coding skills.

Returning to his everyday life as an engineer, Manoj was forever changed. He learned that while technology had the power to connect us, it was the kindness of the human spirit that truly created transformation. No longer just focused on algorithms, he found purpose in collaboration and community.

From that day forward, Manoj Nishad not only coded for client projects but also devoted himself to social initiatives, bridging gaps between technology and humanity. And in every line of code, he infused a bit of magic, reminding everyone that no software could bring people together quite like a shared smile or a helping hand.

In the heart of Bangalore, he didn’t just become a software engineer; he became a changemaker, a storyteller of human connection, inspiring others to believe that the best projects in life are built together.

  ● All event stream  
*/
