"use client";

import * as React from "react";

import { getOtherChildren, getSlotElement } from "@zayne-labs/toolkit-react/utils";
import { AssertionError } from "@zayne-labs/toolkit-type-helpers";

type ShowProps = {
	children: React.ReactNode;
	fallback?: React.ReactNode;
	when: boolean;
};

export function Show({ children, fallback, when }: ShowProps) {
	const fallBackSlot = getSlotElement(children, ShowFallback, {
		errorMessage: "Only one <Show.Fallback> or <Show.OtherWise> component is allowed",
		throwOnMultipleSlotMatch: true,
	});

	const contentSlot = getSlotElement(children, ShowContent, {
		errorMessage: "Only one <Show.Content> component is allowed",
		throwOnMultipleSlotMatch: true,
	});

	const otherChildren = getOtherChildren(children, [ShowFallback, ShowContent]);

	if (fallBackSlot && fallback) {
		throw new AssertionError(`
			The fallback prop and <Show.Fallback>/<Show.OtherWise> cannot be used at the same time.
		`);
	}

	return when ? (contentSlot ?? otherChildren) : (fallBackSlot ?? fallback);
}

export function ShowContent({ children }: Pick<ShowProps, "children">) {
	return children;
}
ShowContent.slot = Symbol.for("content");

export function ShowFallback({ children }: Pick<ShowProps, "children">) {
	return children;
}
ShowFallback.slot = Symbol.for("fallback");

export const Root = Show;

export const Fallback = ShowFallback;

export const Content = ShowContent;

export const OtherWise = ShowFallback;
