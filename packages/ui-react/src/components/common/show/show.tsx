"use client";

import { toArray } from "@zayne-labs/toolkit-core";
import { assert, isFunction } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";
import { getMultipleSlots, getSingleSlot } from "@/lib/utils/getSlot";

type ShowProps<TWhen> =
	| {
			children: React.ReactNode;
			control: "content";
			fallback?: React.ReactNode;
			when?: never;
	  }
	| {
			children: React.ReactNode | ((value: TWhen) => React.ReactNode);
			control?: "root";
			fallback?: React.ReactNode;
			when: false | TWhen | null | undefined;
	  };

export function ShowRoot<TWhen>(props: ShowProps<TWhen>) {
	const { children, control = "root", fallback = null, when } = props;

	if (control === "content" && !isFunction(children)) {
		const childrenArray = toArray(children) as Array<React.ReactElement<ShowContentProps<TWhen>>>;

		const foundContentSlot = childrenArray.find((child) => Boolean(child.props.when));

		const fallBackSlot = getSingleSlot(childrenArray, ShowFallback);

		assert(
			!(fallBackSlot && fallback),
			"The fallback prop and <Show.Fallback> cannot be used at the same time."
		);

		return foundContentSlot ?? fallBackSlot ?? fallback;
	}

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

type ShowContentProps<TWhen> = Pick<ShowProps<TWhen>, "children" | "when">;

export function ShowContent<TWhen>(props: ShowContentProps<TWhen>) {
	const { children, when } = props;

	const resolvedChildren = isFunction(children) ? children(when as TWhen) : children;

	return resolvedChildren;
}

ShowContent.slotSymbol = Symbol("show-content");

export function ShowFallback(props: { children: React.ReactNode }) {
	const { children } = props;

	return children;
}
ShowFallback.slotSymbol = Symbol("show-fallback");
