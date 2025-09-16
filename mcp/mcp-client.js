// https://modelcontextprotocol.io/docs/develop/build-client#node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  // Step 1: Start the server process
  const transport = new StdioClientTransport({
    command: "node",
    args: ["mcp-server.js"],
  });

  // Step 2: Create MCP client
  const client = new Client({
    name: "mcp-client",
    version: "1.0.0",
  });
  await client.connect(transport);
  console.log("Connected to MCP server");

  // Step 3: Call the tool "addTwoNumbers"
  console.log("Calling tools...");
  const result = await client.request({
    method: "tools/call",
    params: {
      name: "addTwoNumbers",
      arguments: { num1: 5, num2: 7 },
    }
  });
  console.log("Result: ");

  // Step 4: Close client after test
  await client.close();
}

main().catch((err) => {
  console.error("Client error:", err);
});
