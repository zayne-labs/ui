"use client";

import * as React from "react";

import { getMultipleSlots } from "@/lib/utils/getSlot";
import { assert, isFunction } from "@zayne-labs/toolkit-type-helpers";

type ShowProps<TWhen> = {
	children: React.ReactNode | ((value: TWhen) => React.ReactNode);
	fallback?: React.ReactNode;
	when: false | TWhen | null | undefined;
};

export function ShowRoot<TWhen>(props: ShowProps<TWhen>) {
	const { children, fallback = null, when } = props;

	const resolvedChildren = isFunction(children) ? children(when as TWhen) : children;

	const {
		regularChildren,
		slots: [contentSlot, fallBackSlot],
	} = getMultipleSlots(resolvedChildren, [ShowContent, ShowFallback], {
		errorMessage: [
			"Only one <Show.Content> component is allowed",
			"Only one <Show.Fallback> or <Show.OtherWise> component is allowed",
		],
		throwOnMultipleSlotMatch: true,
	});

	if (!when) {
		assert(
			!(fallBackSlot && fallback),
			"The fallback prop and <Show.Fallback> cannot be used at the same time."
		);

		return fallBackSlot ?? fallback;
	}

	return contentSlot ?? regularChildren;
}

export function ShowContent({ children }: { children: React.ReactNode }) {
	return children;
}
ShowContent.slotSymbol = Symbol("show-content");

export function ShowFallback({ children }: { children: React.ReactNode }) {
	return children;
}
ShowFallback.slotSymbol = Symbol("show-fallback");
