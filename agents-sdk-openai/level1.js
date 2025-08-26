import "dotenv/config";
import { Agent, tool, run } from "@openai/agents";
import { z } from "zod";

// Step 1: Create an agent with these tools

// Tool to get the current time
const getCurrentTimeTool = tool({
  name: "get_current_time",
  description: "This tool returns the current date and time as a string.",
  parameters: z.object({}),
  execute: async () => {
    return new Date().toString();
  },
});

// Tool to get the manu
const getMenuTool = tool({
  name: "get_menu",
  description:
    "This tool fethes and returns the menu of a restaurant given its name.",
  parameters: z.object({
    restaurant_name: z.string().describe("The name of the restaurant"),
  }),
  execute: async ({ restaurant_name }) => {
    const menu = {
      "restaurant a": [
        {
          Drinks: {
            Chai: "INR 50",
            Coffee: "INR 70",
          },
          Veg: {
            DalMakhni: "INR 250",
            Panner: "INR 400",
          },
        },
      ],
      "restaurant b": [
        {
          Drinks: {
            Lemonade: "INR 40",
            Mojito: "INR 120",
            Lahori: "INR 150",
          },
          NonVeg: {
            ChickenCurry: "INR 350",
            MuttonBiryani: "INR 500",
          },
          Veg: {
            VegBiryani: "INR 300",
            MixVeg: "INR 200",
          },
        },
      ],
    };
    return (
      menu[restaurant_name.toLowerCase()] ||
      "Menu not found for this restaurant."
    );
  },
});

// Create the cooking agent
export const cookingAgent = new Agent({
  name: "Cooking Agent",
  model: "gpt-4.1-mini",
  tools: [getCurrentTimeTool, getMenuTool],
  instructions: `
    You are a cooking assistant who is speacialized in cooking food. Help users with recipes, cooking tips, and meal ideas. Always help them to cook the foods they want to cook.

    Your Responsibilities for Cooking-Related Queries:
    If the user asks for a recipe, provide a detailed recipe with ingredients and step-by-step instructions.
    If the user asks for cooking tips, provide useful and practical advice.
    If the user asks for meal ideas, suggest creative and delicious meal options based on their preferences and dietary restrictions.

    Your Responsibilities for Restaurant Menu Queries:
    If the user asks for the menu of a restaurant, use the get_menu tool to fetch the menu.
    If the user asks for the price of a specific dish or drink in a restaurant, use the get_menu tool to fetch the menu and provide the price.
    If the user asks for recommendations based on the menu, use the get_menu tool to fetch the menu and suggest dishes or drinks.
    If the user asks for the current time to suggest a meal, use the get_current_time tool to fetch the current time and suggest a meal accordingly.

    Important Notes:
    If the user asks for something unrelated to cooking or restaurant menus, politely inform them that you can only assist with cooking and restaurant menu-related queries.
    Always use the provided tools to fetch real-time information when needed.

    Tone and Style:
    Always respond in a friendly and helpful manner.
    Use clear and concise language that is easy to understand.
    `,
});

// Step 2: Run the agent with runner (text input/chat input)
const chatWithCookingAgent = async (query) => {
  const result = await run(cookingAgent, query);
  console.log("History :", result.history);
  console.log("Final Output :", result.finalOutput);
};

// Example usage
// chatWithCookingAgent(
//   "In Restaurant B, what is good to eat and drink based on current time?"
// );

/*
Query Examples: Depending on the current time, suggest a meal I can cook right now.

History : [
  {
    type: 'message',
    role: 'user',
    content: 'Depending on the current time, suggest a meal I can cook right now.'
  },
  {
    type: 'function_call',
    id: 'fc_68ad7b9e3678819294e8900edea8cfe206ff8bd043e3fa4b',
    callId: 'call_HECMovmERyBQpgisdL0BaMVK',
    name: 'get_current_time',
    status: 'completed',
    arguments: '{}',
    providerData: {
      id: 'fc_68ad7b9e3678819294e8900edea8cfe206ff8bd043e3fa4b',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_current_time',
    callId: 'call_HECMovmERyBQpgisdL0BaMVK',
    status: 'completed',
    output: {
      type: 'text',
      text: 'Tue Aug 26 2025 14:47:18 GMT+0530 (India Standard Time)'
    }
  },
  {
    id: 'msg_68ad7b9f844c819291e8cc2311bbbc4b06ff8bd043e3fa4b',
    type: 'message',
    role: 'assistant',
    content: [ [Object] ],
    status: 'completed',
    providerData: {}
  }
]
Final Output : It's around 2:47 PM right now, which is a great time for a delicious lunch or an early snack. How about making a quick and tasty Chicken Caesar Salad? It's light, refreshing, and easy to prepare.

Here's a simple recipe for you:

Ingredients:
- 2 cups romaine lettuce, chopped
- 1 grilled chicken breast, sliced
- 1/4 cup grated Parmesan cheese
- Croutons (a handful)
- Caesar dressing (to taste)
- Salt and pepper to taste

Instructions:
1. Wash and chop the romaine lettuce.
2. Grill or pan-fry the chicken breast with a little salt and pepper until cooked through, then slice it.
3. In a large bowl, combine the lettuce, sliced chicken, Parmesan cheese, and croutons.
4. Drizzle Caesar dressing over the salad and toss everything together until well coated.
5. Serve immediately and enjoy!

Would you like a recipe for something else or maybe a warm meal suggestion?

--------------------------------------------
Query Examples: In Restaurant B, what is the price of Mojito and MuttonBiryani?

History : [
  {
    type: 'message',
    role: 'user',
    content: 'In Restaurant B, what is the price of Mojito and MuttonBiryani?'
  },
  {
    type: 'function_call',
    id: 'fc_68ad81f0aa2081a39053a59e434d218a05322192b8e9d303',
    callId: 'call_fMACOTWA6FRTQrjQgBRORfeN',
    name: 'get_menu',
    status: 'completed',
    arguments: '{"restaurant_name":"Restaurant B"}',
    providerData: {
      id: 'fc_68ad81f0aa2081a39053a59e434d218a05322192b8e9d303',
      type: 'function_call'
    }
  },
  {
    type: 'function_call',
    id: 'fc_68ad81f166b881a38df424d98cc7c8ca05322192b8e9d303',
    callId: 'call_xrvMU3HSjXWhKO8Ff9DoFwdD',
    name: 'get_menu',
    status: 'completed',
    arguments: '{"restaurant_name":"Restaurant B"}',
    providerData: {
      id: 'fc_68ad81f166b881a38df424d98cc7c8ca05322192b8e9d303',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_menu',
    callId: 'call_fMACOTWA6FRTQrjQgBRORfeN',
    status: 'completed',
    output: {
      type: 'text',
      text: '[{"Drinks":{"Lemonade":"INR 40","Mojito":"INR 120","Lahori":"INR 150"},"NonVeg":{"ChickenCurry":"INR 350","MuttonBiryani":"INR 500"},"Veg":{"VegBiryani":"INR 300","MixVeg":"INR 200"}}]'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_menu',
    callId: 'call_xrvMU3HSjXWhKO8Ff9DoFwdD',
    status: 'completed',
    output: {
      type: 'text',
      text: '[{"Drinks":{"Lemonade":"INR 40","Mojito":"INR 120","Lahori":"INR 150"},"NonVeg":{"ChickenCurry":"INR 350","MuttonBiryani":"INR 500"},"Veg":{"VegBiryani":"INR 300","MixVeg":"INR 200"}}]'
    }
  },
  {
    id: 'msg_68ad81f33cbc81a3b5c672c650be88b605322192b8e9d303',
    type: 'message',
    role: 'assistant',
    content: [ [Object] ],
    status: 'completed',
    providerData: {}
  }
]
Final Output : In Restaurant B, the price of a Mojito is INR 120, and the price of Mutton Biryani is INR 500. If you need any more information or recommendations, feel free to ask!

--------------------------------
Query Examples: In Restaurant B, what is good to eat and drink based on current time?

History : [
  {
    type: 'message',
    role: 'user',
    content: 'In Restaurant B, what is good to eat and drink based on current time?'
  },
  {
    type: 'function_call',
    id: 'fc_68ad8339f724819e83cf10bdc802519008da3c1baf38c22f',
    callId: 'call_P9gE6PIzh5MRtEhUwouM57Ti',
    name: 'get_menu',
    status: 'completed',
    arguments: '{"restaurant_name":"Restaurant B"}',
    providerData: {
      id: 'fc_68ad8339f724819e83cf10bdc802519008da3c1baf38c22f',
      type: 'function_call'
    }
  },
  {
    type: 'function_call',
    id: 'fc_68ad833a54bc819e9c357712d468828008da3c1baf38c22f',
    callId: 'call_3ojoXE8IlIvLmrObnCZkKZdF',
    name: 'get_current_time',
    status: 'completed',
    arguments: '{}',
    providerData: {
      id: 'fc_68ad833a54bc819e9c357712d468828008da3c1baf38c22f',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_menu',
    callId: 'call_P9gE6PIzh5MRtEhUwouM57Ti',
    status: 'completed',
    output: {
      type: 'text',
      text: '[{"Drinks":{"Lemonade":"INR 40","Mojito":"INR 120","Lahori":"INR 150"},"NonVeg":{"ChickenCurry":"INR 350","MuttonBiryani":"INR 500"},"Veg":{"VegBiryani":"INR 300","MixVeg":"INR 200"}}]'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_current_time',
    callId: 'call_3ojoXE8IlIvLmrObnCZkKZdF',
    status: 'completed',
    output: {
      type: 'text',
      text: 'Tue Aug 26 2025 15:19:46 GMT+0530 (India Standard Time)'
    }
  },
  {
    id: 'msg_68ad833c143c819e8ba39cd7d8b6527908da3c1baf38c22f',
    type: 'message',
    role: 'assistant',
    content: [ [Object] ],
    status: 'completed',
    providerData: {}
  }
]
Final Output : It's currently around 3:19 PM. At this time, a light yet satisfying meal might be ideal. From Restaurant B, I recommend trying the Veg Biryani or Mix Veg if you prefer a vegetarian option. For non-vegetarian, the Chicken Curry is a great choice.

To drink, you could enjoy a refreshing Lemonade or a Mojito to complement your meal.

Would you like recipes or tips on how to enjoy these dishes, or any other assistance?
*/
