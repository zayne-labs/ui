"use client";

import { useComposeRefs } from "@zayne-labs/toolkit-react";
import { isFunction, type UnknownObject } from "@zayne-labs/toolkit-type-helpers";

import { Slot } from "../slot";
import { usePresence, type UsePresenceOptions, type UsePresenceResult } from "./use-presence";

type RefProp = { ref?: React.Ref<HTMLElement> };

type RenderPropContext = Omit<UsePresenceResult, "propGetters" | "ref">;

type PresenceProps = UsePresenceOptions & {
	children?: React.ReactElement<RefProp> | ((props: RenderPropContext) => React.ReactElement<RefProp>);
	className?: string;
	forceMount?: boolean;
};

function Presence(props: PresenceProps) {
	const { children, className, forceMount = false, onExitComplete, present, variant } = props;

	const {
		isPresent,
		isPresentOrIsTransitionComplete,
		propGetters,
		ref: presenceRef,
		shouldStartTransition,
	} = usePresence({ onExitComplete, present, variant });

	const context = {
		isPresent,
		isPresentOrIsTransitionComplete,
		shouldStartTransition,
	} satisfies RenderPropContext;

	const resolvedChild = isFunction(children) ? children(context) : children;

	const childRef = (resolvedChild?.props.ref
		?? (resolvedChild as unknown as UnknownObject).ref) as React.Ref<HTMLElement>;

	const ref = useComposeRefs(presenceRef, childRef);

	const shouldRender =
		forceMount || (variant === "transition" ? isPresentOrIsTransitionComplete : isPresent);

	if (!shouldRender) {
		return null;
	}

	return (
		<Slot.Root ref={ref} {...propGetters.getPresenceProps({ className })}>
			{resolvedChild}
		</Slot.Root>
	);
}

export { Presence };
