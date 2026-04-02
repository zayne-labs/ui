export const assembleContext = (title: string, intro: string, contents: string[]) => {
	return [`=== ${title} ===`, intro, ...contents].filter(Boolean).join("\n\n");
};
