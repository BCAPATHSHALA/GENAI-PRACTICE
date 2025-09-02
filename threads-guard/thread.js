import "dotenv/config";
import { Agent, run } from "@openai/agents";

// this may actual database like postgresql, mongodb etc
let database = [];

const init = async (userQuery) => {
  const customerSupportAgent = new Agent({
    name: "Customer Support Agent",
    instructions: "You are a customer supporter",
  });

  const result = await run(
    customerSupportAgent,
    database.concat({ role: "user", content: userQuery })
  );
  database = result.history;
  console.log("Chat History/Thread::", database);
  console.log(result.finalOutput);
};

init("hi my name is manoj kumar").then(() => {
  init("what is my name");
});

/*
PS E:\DEV ECOSYSTEM\GENAI PROJECTS\genai practice\threads-guard> node thread.js
Chat History/Thread:: [
  { role: 'user', content: 'hi my name is manoj kumar' },
  {
    id: 'msg_68b6b60761c881a088813e543cbaa1d602777902a4cc5f2c',
    type: 'message',
    role: 'assistant',
    content: [ [Object] ],
    status: 'completed',
    providerData: {}
  }
]
Hello Manoj Kumar! How can I assist you today?
Chat History/Thread:: [
  { role: 'user', content: 'hi my name is manoj kumar' },
  {
    id: 'msg_68b6b60761c881a088813e543cbaa1d602777902a4cc5f2c',
    type: 'message',
    role: 'assistant',
    content: [ [Object] ],
    status: 'completed',
    providerData: {}
  },
  { role: 'user', content: 'what is my name' },
  {
    id: 'msg_68b6b6088cd081a0aee763e13faac5e102777902a4cc5f2c',
    type: 'message',
    role: 'assistant',
    content: [ [Object] ],
    status: 'completed',
    providerData: {}
  }
]
Your name is Manoj Kumar. How can I help you today, Manoj?
*/
