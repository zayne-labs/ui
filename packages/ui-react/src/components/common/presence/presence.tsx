"use client";

import { useComposeRefs } from "@zayne-labs/toolkit-react";
import { isFunction, type UnknownObject } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";
import { Children, cloneElement } from "react";
import { type UsePresenceOptions, usePresence } from "./use-presence";

type RefProp = { ref?: React.Ref<HTMLElement> };

type PresenceProps = UsePresenceOptions & {
	children?:
		| React.ReactElement<RefProp>
		| ((props: Omit<ReturnType<typeof usePresence>, "ref">) => React.ReactElement<RefProp>);
	forceMount?: boolean;
};

function Presence(props: PresenceProps) {
	const { children, forceMount = false, onExitComplete, present, variant } = props;

	const {
		isPresent,
		isPresentOrIsTransitionComplete,
		ref: presenceRef,
		shouldStartTransition,
	} = usePresence({ onExitComplete, present, variant });

	const resolvedChild =
		isFunction(children) ?
			children({ isPresent, isPresentOrIsTransitionComplete, shouldStartTransition })
		:	Children.only(children);

	const childRef = (resolvedChild?.props.ref
		?? (resolvedChild as unknown as UnknownObject).ref) as React.Ref<HTMLElement>;

	const combinedRefs = useComposeRefs(presenceRef, childRef);

	const shouldRender =
		forceMount || (variant === "transition" ? isPresentOrIsTransitionComplete : isPresent);

	if (!shouldRender) {
		return null;
	}

	return resolvedChild && cloneElement(resolvedChild, { ref: combinedRefs });
}

export { Presence };
