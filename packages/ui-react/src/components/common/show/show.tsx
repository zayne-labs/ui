"use client";

import * as React from "react";

import { getOtherChildren, getSlotElement } from "@zayne-labs/toolkit-react/utils";
import { AssertionError, isFunction } from "@zayne-labs/toolkit-type-helpers";

type ShowProps<TWhen> = {
	children: React.ReactNode | ((whenValue: TWhen) => React.ReactNode);
	fallback?: React.ReactNode;
	when: false | TWhen | null | undefined;
};

export function ShowRoot<TWhen>({ children, fallback, when }: ShowProps<TWhen>) {
	if ((when == null || when === false) && !isFunction(children)) {
		const fallBackSlot = getSlotElement(children, ShowFallback, {
			errorMessage: "Only one <Show.Fallback> or <Show.OtherWise> component is allowed",
			throwOnMultipleSlotMatch: true,
		});

		if (fallBackSlot && fallback) {
			throw new AssertionError(`
			The fallback prop and <Show.Fallback>/<Show.OtherWise> cannot be used at the same time.
		`);
		}

		return fallBackSlot ?? fallback;
	}

	if (when == null || when === false) {
		return fallback;
	}

	const resolvedChildren = isFunction(children) ? children(when) : children;

	const contentSlot = getSlotElement(resolvedChildren, ShowContent, {
		errorMessage: "Only one <Show.Content> component is allowed",
		throwOnMultipleSlotMatch: true,
	});

	const otherChildren = getOtherChildren(resolvedChildren, [ShowFallback, ShowContent]);

	return contentSlot ?? otherChildren;
}

export function ShowContent({ children }: { children: React.ReactNode }) {
	return children;
}
ShowContent.slot = Symbol.for("content");

export function ShowFallback({ children }: { children: React.ReactNode }) {
	return children;
}
ShowFallback.slot = Symbol.for("show-fallback");
