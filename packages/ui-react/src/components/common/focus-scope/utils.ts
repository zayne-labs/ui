export const focusFirst = (candidates: HTMLElement[], options: { select?: boolean } = {}) => {
	const { select = false } = options;

	const previouslyFocusedElement = document.activeElement;

	for (const candidate of candidates) {
		focusElement(candidate, { select });
		if (document.activeElement !== previouslyFocusedElement) return;
	}
};

export const getTabbableEdges = (container: HTMLElement) => {
	const candidates = getTabbableCandidates(container);
	const first = findVisible(candidates, container);
	const last = findVisible(candidates.reverse(), container);
	return [first, last];
};

export const getTabbableCandidates = (container: HTMLElement): HTMLElement[] => {
	const nodes: HTMLElement[] = [];

	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
		acceptNode: (node: HTMLInputElement) => {
			const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";

			if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;

			return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
		},
	});

	while (walker.nextNode()) {
		nodes.push(walker.currentNode as HTMLElement);
	}

	return nodes;
};

const findVisible = (elements: HTMLElement[], container: HTMLElement): HTMLElement | null => {
	if (elements.length === 0) return null;
	let visibleElement: HTMLElement | null = null;

	for (const element of elements) {
		if (!isHidden(element, { upTo: container })) {
			visibleElement = element;
			break;
		}
	}

	return visibleElement;
};

const isHidden = (
	initialNode: HTMLElement | null,
	options: { upTo: HTMLElement | undefined }
): boolean => {
	const { upTo } = options;

	if (!initialNode || getComputedStyle(initialNode).visibility === "hidden") {
		return true;
	}

	let currentNode: HTMLElement | null = initialNode;

	while (currentNode) {
		if (upTo !== void 0 && currentNode === upTo) {
			return false;
		}
		if (getComputedStyle(currentNode).display === "none") {
			return true;
		}
		currentNode = currentNode.parentElement;
	}

	return false;
};

const isSelectableInput = (element: HTMLElement): element is HTMLInputElement => {
	return element instanceof HTMLInputElement && "select" in element;
};

export const focusElement = (element: HTMLElement | null, options: { select?: boolean } = {}) => {
	const { select = false } = options;

	if (element && typeof element.focus === "function") {
		const previouslyFocusedElement = document.activeElement;
		element.focus({ preventScroll: true });

		if (element !== previouslyFocusedElement && isSelectableInput(element) && select) {
			element.select();
		}
	}
};

const createFocusScopesStack = () => {
	let stack: Array<{ pause: () => void; paused: boolean; resume: () => void }> = [];

	const api = {
		add(focusScope: { pause: () => void; paused: boolean; resume: () => void }) {
			const activeFocusScope = stack[0];
			if (focusScope !== activeFocusScope) {
				activeFocusScope?.pause();
			}
			stack = arrayRemove(stack, focusScope);
			stack.unshift(focusScope);
		},
		remove(focusScope: { pause: () => void; paused: boolean; resume: () => void }) {
			stack = arrayRemove(stack, focusScope);
			stack[0]?.resume();
		},
	};

	return api;
};

export const focusScopesStack = createFocusScopesStack();

const arrayRemove = <T>(array: T[], item: T): T[] => {
	const updatedArray = [...array];
	const index = updatedArray.indexOf(item);
	if (index !== -1) {
		updatedArray.splice(index, 1);
	}
	return updatedArray;
};

export const removeLinks = (items: HTMLElement[]): HTMLElement[] => {
	return items.filter((item) => item.tagName !== "A");
};
