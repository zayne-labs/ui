import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { LRUCache } from "lru-cache";
import { ExamplesIndex } from "@/examples/__index";

type RegistryItemResult = {
	files: Array<{ content: string; path: string }>;
	name: string;
};

// LRU cache for cross-request caching of registry items.
// File reads are I/O-bound, so caching improves dev server performance.
const registryCache = new LRUCache<string, RegistryItemResult>({
	allowStale: false,
	max: 500,
	ttl: 5 * 60 * 1000, // 5 minutes (shorter for dev to pick up changes).
});

/**
 * Resolves the file path for an example component
 * @description Checks if an example component exists in the examples directory
 */
const resolveExamplePath = (name: string): string | null => {
	const examplesDir = path.join(process.cwd(), "examples");
	const filePath = path.join(examplesDir, `${name}.tsx`);

	return fs.existsSync(filePath) ? filePath : null;
};

/**
 * Gets a component from the examples directory
 * @description Checks if an example component exists by name
 */
export const getExampleComponent = (name: keyof typeof ExamplesIndex) => {
	return ExamplesIndex[name].component;
};

/**
 * Gets the source code for an example component
 * @description Reads and caches example component source code
 */
export const getExampleItem = async (name: string) => {
	const cacheKey = `example:${name}`;

	const cached = registryCache.get(cacheKey);

	if (cached !== undefined) {
		return cached;
	}

	const filePath = resolveExamplePath(name);

	if (!filePath) {
		return null;
	}

	try {
		const content = await fsPromises.readFile(filePath, "utf8");

		const relativePath = path.relative(process.cwd(), filePath);

		const result = {
			files: [{ content, path: relativePath }],
			name,
		} satisfies RegistryItemResult;

		registryCache.set(cacheKey, result);

		return result;
	} catch {
		return null;
	}
};

/**
 * Reads a file from the workspace root
 * @description Reads a file from the workspace root directory
 */
export const readFileFromRoot = async (relativePath: string): Promise<string> => {
	const filePath = path.join(process.cwd(), relativePath);

	return fsPromises.readFile(filePath, "utf8");
};
