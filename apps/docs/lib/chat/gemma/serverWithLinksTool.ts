import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";
import { getDocumentationContext } from "../context/context-builder";
import { provideLinksTool } from "../tools/provideLinks";

export async function POST(request: Request) {
	try {
		const { messages } = (await request.json()) as { messages: never };

		const [userMessages, documentationContext] = await Promise.all([
			convertToModelMessages(messages, { ignoreIncompleteToolCalls: true }),
			getDocumentationContext(),
		]);

		const result = streamText({
			messages: [
				{ content: SYSTEM_PROMPT, role: "system" },
				{ content: documentationContext, role: "system" },
				...userMessages,
			],
			model: google("gemini-2.5-flash"),
			toolChoice: "auto",
			tools: {
				provideLinks: provideLinksTool,
			},
		});

		return result.toUIMessageStreamResponse();
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
	"- Documentation context: High-level features, component usage, and layout patterns",
	"- Source code context: Authoritative implementation details, component props, and TypeScript definitions",
	"- Always cross-reference both sources; prioritize source code when conflicts arise",
	"",
	"GUIDELINES",
	"- Strict accuracy: Only suggest components, props, and APIs present in the provided context",
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
].join("\n");
