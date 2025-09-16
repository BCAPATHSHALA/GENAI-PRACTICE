// https://modelcontextprotocol.io/docs/develop/build-server#node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";

// Step 1: Initialize the MCP server with a name and version
const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
});

// Step 3: Register a tool (function) that can be called through MCP
server.registerTool(
  "addTwoNumbers",
  {
    title: "Add Two Numbers",
    description: "This tool adds two numbers together",
    inputSchema: {
      num1: z.number().describe("This is the first number"),
      num2: z.number().describe("This is the second number"),
    },
  },
  async ({ num1, num2 }) => {
    return { content: [{ type: "text", text: `${num1 + num2}` }] };
  }
);

// Step 2: Start the MCP server using stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
