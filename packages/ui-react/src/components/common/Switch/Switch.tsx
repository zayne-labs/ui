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

export function Switch<TCondition = true>(props: SwitchProps<TCondition>) {
	const { children, condition = true } = props;

	const defaultCase = getSlotElement(children, Default, {
		errorMessage: "Only one <Switch.Default> component is allowed",
		throwOnMultipleSlotMatch: true,
	});

	const childrenCasesArray = getOtherChildren(children, Default);

	const matchedCase = childrenCasesArray.find((child) => child.props.when === condition);

	return matchedCase ?? defaultCase;
}

export function Match<TWhen>({ children }: SwitchMatchProps<TWhen>) {
	return children;
}

export function Default({ children }: Pick<SwitchMatchProps, "children">) {
	return children;
}
Default.slot = Symbol.for("default-case");

export const Root = Switch;
