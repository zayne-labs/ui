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
		| ((props: { isPresent: boolean }) => React.ReactElement<RefProp>);
	forceMount?: boolean;
};

function Presence(props: PresenceProps) {
	const { children, forceMount = false, onExitComplete, present } = props;

	const presence = usePresence({ onExitComplete, present });

	const resolvedChild =
		isFunction(children) ? children({ isPresent: presence.isPresent }) : Children.only(children);

	const childRef = (resolvedChild?.props.ref
		?? (resolvedChild as unknown as UnknownObject).ref) as React.Ref<HTMLElement>;

	const ref = useComposeRefs(presence.ref, childRef);

	const shouldRender = forceMount || presence.isPresent;

	if (!shouldRender) {
		return null;
	}

	return resolvedChild && cloneElement(resolvedChild, { ref });
}

export { Presence };
