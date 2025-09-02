import "dotenv/config";
import { Agent, run } from "@openai/agents";
import z from "zod";

// Output Guardrails Agent
const guardrailMathCheckAgent = new Agent({
  name: "Guardrail Math Agent",
  instructions: "Check if the user is asking you to do their math homework.",
  outputType: z.object({
    isMathHomework: z
      .boolean()
      .describe("Set this to true if its a math homework"),
  }),
});

const checkMathInput = {
  name: "Guardrails Math Input",
  execute: async ({ input }) => {
    const result = await run(guardrailMathCheckAgent, input);
    console.log(`😭: Use is asking ${input}`);
    return {
      tripwireTriggered: result.finalOutput.isMathHomework ? true : false,
    };
  },
};

// Customer Support Agent
const customerSupportAgent = new Agent({
  name: "Customer supporter",
  instructions: "You are a helpful customer supporter",
  outputGuardrails: [checkMathInput],
  outputType: z.object({ response: z.string() })
});

const chatWithAgent = async (userQuery) => {
  try {
    const result = await run(customerSupportAgent, userQuery);
    console.log(result.finalOutput);
  } catch (error) {
    console.log("Math output guardrail tripped", error);
  }
};

chatWithAgent("hi my name is manoj");

/*
User Query:
Add two number 4 and 5

Expected Output:
Math output guardrail tripped GuardrailExecutionError: Output guardrail failed to complete: TypeError: originalInput is not iterable
    at #runOutputGuardrails (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:295:23)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:176:25
    at async file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/tracing/context.mjs:45:24
    at async run (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:546:16)
    at async chatWithAgent (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/threads-guard/outputguardrail.js:36:20) {
  state: RunState {
    _currentTurn: 1,
    _currentAgent: Agent {
      eventEmitter: [EventEmitter],
      name: 'Customer supporter',
      instructions: 'You are a helpful customer supporter',
      prompt: undefined,
      handoffDescription: '',
      handoffs: [],
      model: '',
      modelSettings: {},
      tools: [],
      mcpServers: [],
      inputGuardrails: [],
      outputGuardrails: [Array],
      outputType: 'text',
      toolUseBehavior: 'run_llm_again',
      resetToolChoice: true
    },
    _originalInput: 'Add two number 4 and 5',
    _modelResponses: [ [Object] ],
    _currentAgentSpan: Span { type: 'trace.span' },
    _context: RunContext { context: {}, usage: [Usage] },
    _toolUseTracker: AgentToolUseTracker {},
    _generatedItems: [ [RunMessageOutputItem] ],
    _maxTurns: 10,
    _noActiveAgentRun: false,
    _lastTurnResponse: {
      usage: [Usage],
      output: [Array],
      responseId: 'resp_68b6c42f67ac8191b00f73e4e1a5d0c603c8787c0a17ee08',
      providerData: [Object]
    },
    _inputGuardrailResults: [],
    _outputGuardrailResults: [],
    _currentStep: {
      type: 'next_step_final_output',
      output: 'Sure! The sum of 4 and 5 is:\n\n4 + 5 = **9**'
    },
    _lastProcessedResponse: {
      newItems: [Array],
      handoffs: [],
      functions: [],
      computerActions: [],
      mcpApprovalRequests: [],
      toolsUsed: [],
      hasToolsOrApprovalsToRun: [Function: hasToolsOrApprovalsToRun]
    },
    _trace: Trace {
      type: 'trace',
      traceId: 'trace_45c0f463af7e4c908ac697b8885108ca',
      name: 'Agent workflow',
      groupId: null,
      metadata: {}
    }
  },
  error: TypeError: originalInput is not iterable
      at getTurnInput (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:39:16)
      at file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:141:43
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async getOrCreateTrace (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/tracing/context.mjs:78:16)
      at async run (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:546:16)
      at async execute (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/threads-guard/outputguardrail.js:19:20)
      at async Object.run (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/guardrail.mjs:30:25)
      at async withGuardrailSpan.data.name (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:274:40)
      at async file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/tracing/createSpans.mjs:11:24
      at async Promise.all (index 0)
}
      */
