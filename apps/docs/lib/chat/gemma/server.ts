import { google } from "@ai-sdk/google";
import {
	convertToModelMessages,
	createUIMessageStreamResponse,
	safeValidateUIMessages,
	stepCountIs,
	streamText,
	toUIMessageStream,
} from "ai";
import { z } from "zod";
import type { ChatUIMessage } from "@/components/ai/search";
import { searchTool } from "../tools/search";
import { searchSourceTool } from "../tools/searchSource";

const tools = {
	search: searchTool,
	searchSource: searchSourceTool,
};

// == Matches `AIChatClientData` from @fumadocs/ai-chat, sent as a `data-client` part with each question
const dataSchemas = {
	client: z.object({ location: z.string(), title: z.string() }),
};

const MaxMessages = 20;

// == Up to `MaxSteps - 1` tool steps, then a final step with tools disabled so every answer ends in text
const MaxSteps = 6;

// == Keeps the latest messages, starting from a user message so the history never opens on an answer
const getRecentMessages = (messages: ChatUIMessage[]) => {
	const recentMessages = messages.slice(-MaxMessages);
	const firstUserIndex = recentMessages.findIndex((message) => message.role === "user");

	return firstUserIndex === -1 ? [] : recentMessages.slice(firstUserIndex);
};

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as { messages?: unknown };

		const validation = await safeValidateUIMessages<ChatUIMessage>({
			dataSchemas,
			messages: body.messages,
			tools,
		});

		if (!validation.success) {
			return new Response(validation.error.message, { status: 400 });
		}

		const recentMessages = getRecentMessages(validation.data);

		if (recentMessages.length === 0) {
			return new Response("No user message to answer", { status: 400 });
		}

		const modelMessages = await convertToModelMessages(recentMessages, {
			// == Turns the page the question was asked from into text the model can read
			convertDataPart: (part) => ({
				text: `[Client Context: ${JSON.stringify(part.data)}]`,
				type: "text",
			}),
			// == Drops tool calls left unfinished when the user stops an answer mid-search
			ignoreIncompleteToolCalls: true,
		});

		const result = streamText({
			instructions: SYSTEM_PROMPT,
			maxOutputTokens: 4096,
			messages: modelMessages,
			model: google("gemini-3.5-flash-lite"),
			prepareStep: ({ stepNumber }) => (stepNumber === MaxSteps - 1 ? { toolChoice: "none" } : {}),
			stopWhen: stepCountIs(MaxSteps),
			toolChoice: "auto",
			tools,
		});

		return createUIMessageStreamResponse({
			stream: toUIMessageStream({ stream: result.stream }),
		});
	} catch (error) {
		console.error("Chat API Error:", error);

		return new Response("Internal Server Error", { status: 500 });
	}
}

const SYSTEM_PROMPT = [
	"You are an expert assistant for the Zayne UI library, a modern, highly customizable UI component library for React.",
	"",
	"IDENTITY & MISSION",
	"- Expert in Zayne UI, React, Tailwind CSS, and TypeScript development",
	"- Provide accurate, production-ready solutions with a focus on accessible, beautiful interfaces and type safety",
	"",
	"KNOWLEDGE BASE",
	'- A user message may begin with [Client Context], the page they are reading; for questions about "this page", search its title',
	"- Always use the `search` tool before answering questions about Zayne UI; use its results as the documentation evidence",
	"- Use `searchSource` for implementation details, component props, TypeScript definitions, or when documentation is insufficient",
	"- Cross-reference documentation with source when implementation details are relevant; prioritize source code if they conflict",
	"- Cite documentation with its exact returned URL; cite source excerpts with their returned GitHub URL and line range",
	"- Never invent citations, file paths, line numbers, components, props, or API behavior",
	"",
	"GUIDELINES",
	"- Strict accuracy: Only suggest components, props, and APIs present in the provided context",
	"- If search results are insufficient, state that clearly instead of guessing",
	"- TypeScript excellence: Use strict types in all code examples",
	"- Contextual solutions: Address the user's specific scenario (layout, styling, composition, accessibility, etc.)",
	"- Explain reasoning: Briefly explain component choices and design decisions",
	"- Be concise: Focus on code and immediate implementation steps",
	"",
	"CONSTRAINTS",
	"- Stay focused on Zayne UI; only discuss other libraries when asked for comparison",
	"- Politely redirect non-Zayne UI questions",
	"- Admit uncertainty rather than guessing",
	"- Prioritize practical, elegant, and accessible solutions",
	"- Cite retrieved pages using their exact URL in Markdown links; do not invent page URLs",
].join("\n");
