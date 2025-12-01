"use client";

import { getRegularChildren, getSingleSlot } from "@zayne-labs/toolkit-react/utils";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";

type ValidSwitchComponentType = React.ReactElement<SwitchMatchProps<unknown>>;

type SwitchProps = {
	children: ValidSwitchComponentType | ValidSwitchComponentType[];
	value?: unknown;
};

const defaultValueSymbol = Symbol("default-value");

export function SwitchRoot(props: SwitchProps) {
	const { children, value = defaultValueSymbol } = props;

	const defaultCase = getSingleSlot(children, SwitchDefault, {
		errorMessage: "Only one <Switch.Default> component is allowed",
		throwOnMultipleSlotMatch: true,
	});

	const childrenCasesArray = getRegularChildren(children, SwitchDefault) as ValidSwitchComponentType[];

	const matchedCase = childrenCasesArray.find((child) => {
		// == If value is defaultValueSymbol, match the cases in order like switch(true)
		if (value === defaultValueSymbol) {
			return Boolean(child.props.when);
		}

		// == Otherwise, match the cases like switch(value)
		return child.props.when === value;
	});

	return matchedCase ?? defaultCase;
}

type SwitchMatchProps<TWhen> = {
	children: React.ReactNode | ((value: TWhen) => React.ReactNode);
	when: false | TWhen | null | undefined;
};

export function SwitchMatch<TWhen>(props: SwitchMatchProps<TWhen>) {
	const { children, when } = props;

	const resolvedChildren = isFunction(children) ? children(when as TWhen) : children;

	return resolvedChildren;
}

export function SwitchDefault({ children }: { children: React.ReactNode }) {
	return children;
}
SwitchDefault.slotSymbol = Symbol("switch-default");
