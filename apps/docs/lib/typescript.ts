import { createFileSystemGeneratorCache, createGenerator } from "fumadocs-typescript";

export const typescriptGenerator = createGenerator({
	cache: createFileSystemGeneratorCache(".next/fumadocs-typescript"),
});
