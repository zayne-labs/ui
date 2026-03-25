"use client";

import { useComposeRefs } from "@zayne-labs/toolkit-react";
import { isFunction, type UnknownObject } from "@zayne-labs/toolkit-type-helpers";
import { Slot } from "../slot";
import { usePresence, type UsePresenceOptions, type UsePresenceResult } from "./use-presence";

type RefProp = { ref?: React.Ref<HTMLElement> };

type RenderPropContext = Omit<UsePresenceResult, "propGetters" | "ref">
	& Pick<UsePresenceOptions, "present">;

export type PresenceProps = UsePresenceOptions & {
	children?: React.ReactElement<RefProp> | ((props: RenderPropContext) => React.ReactElement<RefProp>);
	className?: string;
	forceMount?: boolean;
};

function Presence(props: PresenceProps) {
	const { children, className, forceMount = false, onExitComplete, present, variant } = props;

	const {
		isMounted,
		isTransitionComplete,
		propGetters,
		ref: presenceRef,
	} = usePresence({ onExitComplete, present, variant });

	const context = {
		isMounted,
		isTransitionComplete,
		present,
	} satisfies RenderPropContext;

	const resolvedChild = isFunction(children) ? children(context) : children;

	const childRef = (resolvedChild?.props.ref
		?? (resolvedChild as unknown as UnknownObject).ref) as React.Ref<HTMLElement>;

	const ref = useComposeRefs(presenceRef, childRef);

	const shouldRender =
		forceMount || (variant === "transition" ? isMounted || isTransitionComplete : isMounted);

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
