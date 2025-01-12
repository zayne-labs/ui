"use client";

import * as React from "react";

import { getOtherChildren, getSlotElement } from "@zayne-labs/toolkit-react/utils";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";

type ValidSwitchComponentType = React.ReactElement<SwitchMatchProps>;

type SwitchProps<TCondition> = {
	children: ValidSwitchComponentType | ValidSwitchComponentType[];
	condition?: TCondition;
};

type SwitchMatchProps<TWhen = unknown> = {
	children: React.ReactNode | ((whenValue: TWhen) => React.ReactNode);
	when: false | TWhen | null | undefined;
};

const defaultConditionSymbol = Symbol("condition-default");

export function SwitchRoot<TCondition = true>(props: SwitchProps<TCondition>) {
	const { children, condition = defaultConditionSymbol } = props;

	const defaultCase = getSlotElement(children, SwitchDefault, {
		errorMessage: "Only one <Switch.Default> component is allowed",
		throwOnMultipleSlotMatch: true,
	});

	const childrenCasesArray = getOtherChildren(children, SwitchDefault);

	const matchedCase = childrenCasesArray.find((child) =>
		condition === defaultConditionSymbol ? child.props.when : child.props.when === condition
	);

	return matchedCase ?? defaultCase;
}

export function SwitchMatch<TWhen>({ children, when }: SwitchMatchProps<TWhen>) {
	if (when == null || when === false) {
		return null;
	}

	return isFunction(children) ? children(when) : children;
}

export function SwitchDefault({ children }: { children: React.ReactNode }) {
	return children;
}
SwitchDefault.slot = Symbol.for("switch-default");
