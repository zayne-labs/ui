import { getLLMText, source } from "@/lib/source";
import { assembleContext } from "./utils";

export const getDocumentationContext = async () => {
	const pages = source.getPages();
	const results = await Promise.allSettled(pages.map((element) => getLLMText(element)));

	const scannedPages = results
		.filter((res): res is PromiseFulfilledResult<string> => res.status === "fulfilled")
		.map((res) => res.value);

	return assembleContext(
		"ZAYNE UI DOCUMENTATION CONTEXT",
		"This context contains all information from the Zayne UI documentation needed to help answer user questions accurately.",
		scannedPages.length > 0 ? scannedPages : ["No documentation content found."]
	);
};
