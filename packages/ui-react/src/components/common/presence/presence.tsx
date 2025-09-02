"use client";

import { on } from "@zayne-labs/toolkit-core";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";
import { Children, cloneElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type StateMachineConfig<TState extends string, TEvent extends string> = {
	initial: TState;
	states: Record<TState, Partial<Record<TEvent, TState>>>;
};

const useStateMachine = <TState extends string, TEvent extends string>(
	config: StateMachineConfig<TState, TEvent>
) => {
	const [state, setState] = useState<TState>(config.initial);

	const send = useCallback(
		(event: TEvent) => {
			setState((currentState) => {
				const transition = config.states[currentState][event];
				return transition ?? currentState;
			});
		},
		[config.states]
	);

	return [state, send] as const;
};

const getAnimationName = (styles?: CSSStyleDeclaration) => styles?.animationName ?? "none";

type RefProp = { ref?: React.Ref<HTMLElement> };

type PresenceProps = {
	children?: React.ReactElement<RefProp> | ((props: { present: boolean }) => React.ReactElement<RefProp>);
	forceMount?: boolean;
	onExitComplete?: () => void;
	present: boolean;
};

function Presence(props: PresenceProps) {
	const { children, forceMount = false, onExitComplete, present } = props;

	const [node, setNode] = useState<HTMLElement | null>(null);

	const stylesRef = useRef<CSSStyleDeclaration>({} as CSSStyleDeclaration);

	const prevPresentRef = useRef(present);
	const prevAnimationNameRef = useRef<string>("none");
	const initialState = present ? "mounted" : "unmounted";

	const [state, send] = useStateMachine({
		initial: initialState,
		states: {
			mounted: {
				ANIMATION_OUT: "unmountSuspended",
				UNMOUNT: "unmounted",
			},
			unmounted: {
				MOUNT: "mounted",
			},
			unmountSuspended: {
				ANIMATION_END: "unmounted",
				MOUNT: "mounted",
			},
		},
	});

	useEffect(() => {
		prevAnimationNameRef.current = state === "mounted" ? getAnimationName(stylesRef.current) : "none";
	}, [state]);

	useLayoutEffect(() => {
		const styles = stylesRef.current;
		const wasPresent = prevPresentRef.current;
		const hasPresentChanged = wasPresent !== present;

		if (!hasPresentChanged) return;

		const prevAnimationName = prevAnimationNameRef.current;
		const currentAnimationName = getAnimationName(styles);

		switch (true) {
			case present: {
				send("MOUNT");
				break;
			}

			case Boolean(node): {
				const hasAnimation =
					(currentAnimationName !== "none" && styles.display !== "none")
					|| (styles.transitionProperty !== "none" && Number(styles.transitionDuration) > 0);

				if (!hasAnimation) {
					send("UNMOUNT");
					break;
				}

				const isCurrentlyAnimating = prevAnimationName !== currentAnimationName;

				const isAnimatingOut = wasPresent && isCurrentlyAnimating;

				if (!isAnimatingOut) {
					send("UNMOUNT");
					break;
				}

				send("ANIMATION_OUT");
				break;
			}

			default: {
				send("UNMOUNT");
				break;
			}
		}

		prevPresentRef.current = present;
	}, [present, node, send]);

	useLayoutEffect(() => {
		if (!node) return;

		let timeoutId: number;

		const ownerWindow = node.ownerDocument.defaultView ?? globalThis;

		const onAnimationEnd = (event: AnimationEvent) => {
			const currentAnimationName = getAnimationName(stylesRef.current);
			const isCurrentAnimation = currentAnimationName.includes(event.animationName);

			const isTargetAnimatingNode = event.target === node && isCurrentAnimation;

			if (!isTargetAnimatingNode) return;

			send("ANIMATION_END");

			if (!prevPresentRef.current) {
				const currentFillMode = node.style.animationFillMode;
				node.style.animationFillMode = "forwards";

				timeoutId = ownerWindow.setTimeout(() => {
					if (node.style.animationFillMode === "forwards") {
						node.style.animationFillMode = currentFillMode;
					}
				}) as never;
			}
		};

		const onTransitionEnd = (event: TransitionEvent) => {
			const isTargetTransitioningNode = event.target === node && !prevPresentRef.current;

			if (!isTargetTransitioningNode) return;

			send("ANIMATION_END");
		};

		const onAnimationStart = (event: AnimationEvent) => {
			const isTargetAnimatingNode = event.target === node;

			if (!isTargetAnimatingNode) return;

			prevAnimationNameRef.current = getAnimationName(stylesRef.current);
		};

		const onAnimationStartCleanup = on("animationstart", node, onAnimationStart);
		const onAnimationEndCleanup = on("animationend", node, onAnimationEnd);
		const onAnimationCancelCleanup = on("animationcancel", node, onAnimationEnd);
		const onTransitionEndCleanup = on("transitionend", node, onTransitionEnd);
		const onTransitionCancelCleanup = on("transitioncancel", node, onTransitionEnd);

		return () => {
			ownerWindow.clearTimeout(timeoutId);
			onAnimationStartCleanup();
			onAnimationEndCleanup();
			onAnimationCancelCleanup();
			onTransitionEndCleanup();
			onTransitionCancelCleanup();
		};
	}, [node, send]);

	useEffect(() => {
		if (state === "unmounted" && !present && onExitComplete) {
			onExitComplete();
		}
	}, [state, present, onExitComplete]);

	const isPresent = (["mounted", "unmountSuspended"] satisfies Array<typeof state>).includes(state);

	if (!isPresent && !forceMount) {
		return null;
	}

	const child = isFunction(children) ? children({ present: isPresent }) : Children.only(children);

	if (!child) {
		return null;
	}

	return cloneElement(child, {
		ref: (innerNode: HTMLElement | null) => {
			innerNode && (stylesRef.current = getComputedStyle(innerNode));
			setNode(innerNode);
		},
	});
}

export { Presence };
