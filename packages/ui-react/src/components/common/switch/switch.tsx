"use client";

import * as React from "react";

import { getRegularChildren, getSingleSlot } from "@zayne-labs/toolkit-react/utils";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";

type ValidSwitchComponentType = React.ReactElement<SwitchMatchProps>;

type SwitchProps<TCondition> = {
	children: ValidSwitchComponentType | ValidSwitchComponentType[];
	condition?: TCondition;
};

type SwitchMatchProps<TWhen = unknown> = {
	children: React.ReactNode | ((value: TWhen) => React.ReactNode);
	when: false | TWhen | null | undefined;
};

const defaultConditionSymbol = Symbol("condition-default");

export function SwitchRoot<TCondition = true>(props: SwitchProps<TCondition>) {
	const { children, condition = defaultConditionSymbol } = props;

	const defaultCase = getSingleSlot(children, SwitchDefault, {
		errorMessage: "Only one <Switch.Default> component is allowed",
		throwOnMultipleSlotMatch: true,
	});

	const childrenCasesArray = getRegularChildren(children, SwitchDefault);

	const matchedCase = childrenCasesArray.find((child) =>
		condition === defaultConditionSymbol ? child.props.when : child.props.when === condition
	);

	return matchedCase ?? defaultCase;
}

export function SwitchMatch<TWhen>(props: SwitchMatchProps<TWhen>) {
	const { children, when } = props;

	if (!when) {
		return null;
	}

	return isFunction(children) ? children(when) : children;
}

export function SwitchDefault({ children }: { children: React.ReactNode }) {
	return children;
}
SwitchDefault.slotSymbol = Symbol("switch-default");
