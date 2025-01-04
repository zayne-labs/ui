"use client";

import * as React from "react";

import { getOtherChildren, getSlotElement } from "@zayne-labs/toolkit-react/utils";

type ValidSwitchComponentType = React.ReactElement<SwitchMatchProps>;

type SwitchProps<TCondition> = {
	children: ValidSwitchComponentType | ValidSwitchComponentType[];
	condition?: TCondition;
};

type SwitchMatchProps<TWhen = boolean> = {
	children: React.ReactNode;
	when: TWhen;
};

export function SwitchRoot<TCondition = true>(props: SwitchProps<TCondition>) {
	const { children, condition = true } = props;

	const defaultCase = getSlotElement(children, Default, {
		errorMessage: "Only one <Switch.Default> component is allowed",
		throwOnMultipleSlotMatch: true,
	});

	const childrenCasesArray = getOtherChildren(children, Default);

	const matchedCase = childrenCasesArray.find((child) => child.props.when === condition);

	return matchedCase ?? defaultCase;
}

export function SwitchMatch<TWhen>({ children }: SwitchMatchProps<TWhen>) {
	return children;
}

export function SwitchDefault({ children }: Pick<SwitchMatchProps, "children">) {
	return children;
}
SwitchDefault.slot = Symbol.for("default-case");

export const Root = SwitchRoot;

export const Match = SwitchMatch;

export const Default = SwitchDefault;
