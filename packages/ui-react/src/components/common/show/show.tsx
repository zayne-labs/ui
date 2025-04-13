"use client";

import * as React from "react";

import { getRegularChildren, getSingleSlot } from "@zayne-labs/toolkit-react/utils";
import { AssertionError, isFunction } from "@zayne-labs/toolkit-type-helpers";

type ShowProps<TWhen> = {
	children: React.ReactNode | ((whenValue: TWhen) => React.ReactNode);
	fallback?: React.ReactNode;
	when: false | TWhen | null | undefined;
};

export function ShowRoot<TWhen>({ children, fallback, when }: ShowProps<TWhen>) {
	const resolvedChildren = isFunction(children) ? children(when as TWhen) : children;

	if (when == null || when === false) {
		const fallBackSlot = getSingleSlot(resolvedChildren, ShowFallback, {
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

	const contentSlot = getSingleSlot(resolvedChildren, ShowContent, {
		errorMessage: "Only one <Show.Content> component is allowed",
		throwOnMultipleSlotMatch: true,
	});

	const regularChildren = getRegularChildren(resolvedChildren, [ShowFallback, ShowContent]);

	return contentSlot ?? regularChildren;
}

export function ShowContent({ children }: { children: React.ReactNode }) {
	return children;
}
ShowContent.slotSymbol = Symbol("content");

export function ShowFallback({ children }: { children: React.ReactNode }) {
	return children;
}
ShowFallback.slotSymbol = Symbol("show-fallback");
