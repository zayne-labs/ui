import { dataAttr, on } from "@zayne-labs/toolkit-core";
import { useCallbackRef, useToggle } from "@zayne-labs/toolkit-react";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";

type StateMachineConfig<TState extends string, TEvent extends string> = {
	initial: TState;
	states: Record<TState, Partial<Record<TEvent, TState>>>;
};

const useStateMachine = <TState extends string, TEvent extends string>(
	config: StateMachineConfig<TState, TEvent>
) => {
	const reducer = (prevState: TState, event: TEvent): TState => {
		const newState = config.states[prevState][event] ?? prevState;

		return newState;
	};

	return useReducer(reducer, config.initial);
};

const getAnimationName = (styles: CSSStyleDeclaration | null) => styles?.animationName ?? "none";

export type UsePresenceOptions = {
	onExitComplete?: () => void;
	present: boolean;
	/**
	 * @default "animation"
	 */
	variant?: "animation" | "transition";
};

export type UsePresenceResult = {
	isPresent: boolean;
	isPresentOrIsTransitionComplete: boolean;
	propGetters: {
		getPresenceProps: (innerProps: InferProps<HTMLElement>) => InferProps<HTMLElement>;
	};
	ref: React.Ref<HTMLElement>;
	shouldStartTransition: boolean;
};

/**
 * React hook that provides the ability to animate the mount/unmount of a component.
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/presence/src/presence.tsx
 */

const usePresence = (options: UsePresenceOptions): UsePresenceResult => {
	const { onExitComplete, present: presentProp, variant = "animation" } = options;

	const stableOnExitComplete = useCallbackRef(onExitComplete);

	const [node, setNode] = useState<HTMLElement | null>(null);

	const [hasTransitioned, toggleHasTransitioned] = useToggle(false);

	const stylesRef = useRef<CSSStyleDeclaration | null>(null);

	const prevNodeStateRef = useRef<{
		prevAnimationName: string;
		prevPresent: boolean;
	}>({
		prevAnimationName: "none",
		prevPresent: presentProp,
	});

	const initialState = presentProp ? "mounted" : "unmounted";

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
		const currentAnimationName = getAnimationName(stylesRef.current);

		prevNodeStateRef.current.prevAnimationName = state === "mounted" ? currentAnimationName : "none";
	}, [state]);

	useLayoutEffect(() => {
		const styles = stylesRef.current;
		const wasPresent = prevNodeStateRef.current.prevPresent;
		const hasPresentChanged = wasPresent !== presentProp;

		if (!hasPresentChanged) return;

		const prevAnimationName = prevNodeStateRef.current.prevAnimationName;
		const currentAnimationName = getAnimationName(styles);

		switch (true) {
			case presentProp: {
				send("MOUNT");

				if (variant === "transition") {
					requestAnimationFrame(() => toggleHasTransitioned(true));
				}
				break;
			}

			case Boolean(node) && variant === "animation": {
				const hasAnimation = currentAnimationName !== "none" && styles?.display !== "none";

				/**
				 * When `present` changes to `false`, we check changes to animation-name to
				 * determine whether an animation has started. We chose this approach (reading
				 * computed styles) because there is no `animationrun` event (like the `transitionrun` event) and `animationstart`
				 * fires after `animation-delay` has expired which would be too late.
				 */

				const isAnimationStarted = hasAnimation && prevAnimationName !== currentAnimationName;

				const isAnimatingOut = wasPresent && isAnimationStarted;

				send(isAnimatingOut ? "ANIMATION_OUT" : "UNMOUNT");
				break;
			}

			default: {
				send("UNMOUNT");
				break;
			}
		}

		prevNodeStateRef.current.prevPresent = presentProp;
	}, [presentProp, node, send, variant, toggleHasTransitioned]);

	useLayoutEffect(() => {
		if (!node) {
			// Transition to the unmounted state if the node is removed prematurely.
			// We avoid doing so during cleanup as the node may change but still exist.
			send("ANIMATION_END");
			return;
		}

		let timeoutId: number;

		const ownerWindow = node.ownerDocument.defaultView ?? globalThis;

		const handleAnimationStart = (event: AnimationEvent) => {
			const isTargetAnimatingNode = event.target === node;

			if (!isTargetAnimatingNode) return;

			prevNodeStateRef.current.prevAnimationName = getAnimationName(stylesRef.current);
		};

		/**
		 * @description Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
		 * event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
		 * make sure we only trigger ANIMATION_END for the currently active animation.
		 */
		const handleAnimationEnd = (event: AnimationEvent) => {
			const currentAnimationName = getAnimationName(stylesRef.current);

			// The event.animationName is unescaped for CSS syntax, so we need to escape it to compare with the animationName computed from the style.
			const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));

			const isTargetAnimatingNode = event.target === node && isCurrentAnimation;

			if (!isTargetAnimatingNode) return;

			// With React 18 concurrency this update is applied a frame after the
			// animation ends, creating a flash of visible content. By setting the
			// animation fill mode to "forwards", we force the node to keep the
			// styles of the last keyframe, removing the flash.

			// Previously we flushed the update via ReactDom.flushSync, but with
			// exit animations this resulted in the node being removed from the
			// DOM before the synthetic animationEnd event was dispatched, meaning
			// user-provided event handlers would not be called.
			// https://github.com/radix-ui/primitives/pull/1849
			send("ANIMATION_END");

			if (!prevNodeStateRef.current.prevPresent) {
				const currentFillMode = node.style.animationFillMode;
				node.style.animationFillMode = "forwards";

				// Reset the style after the node had time to unmount (for cases
				// where the component chooses not to unmount). Doing this any
				// sooner than `setTimeout` (e.g. with `requestAnimationFrame`)
				// still causes a flash.
				timeoutId = ownerWindow.setTimeout(() => {
					if (node.style.animationFillMode === "forwards") {
						node.style.animationFillMode = currentFillMode;
					}
				}) as never;
			}
		};

		const handleTransitionRun = (event: TransitionEvent) => {
			const isTargetTransitioningNode = event.target === node;

			if (!isTargetTransitioningNode) return;

			send("ANIMATION_OUT");
		};

		const handleTransitionEnd = (event: TransitionEvent) => {
			const isTargetTransitioningNode = event.target === node && !prevNodeStateRef.current.prevPresent;

			if (!isTargetTransitioningNode) return;

			send("ANIMATION_END");
		};

		const onAnimationStartCleanup = on("animationstart", node, handleAnimationStart);
		const onAnimationEndCleanup = on("animationend", node, handleAnimationEnd);
		const onAnimationCancelCleanup = on("animationcancel", node, handleAnimationEnd);

		const onTransitionRunCleanup = on("transitionrun", node, handleTransitionRun);
		const onTransitionEndCleanup = on("transitionend", node, handleTransitionEnd);
		const onTransitionCancelCleanup = on("transitioncancel", node, handleTransitionEnd);

		return () => {
			ownerWindow.clearTimeout(timeoutId);
			onAnimationStartCleanup();
			onAnimationEndCleanup();
			onAnimationCancelCleanup();

			onTransitionRunCleanup();
			onTransitionEndCleanup();
			onTransitionCancelCleanup();
		};
	}, [node, send]);

	useEffect(() => {
		const isExitCompleted = state === "unmounted" && !presentProp;

		if (isExitCompleted) {
			toggleHasTransitioned(false);
			stableOnExitComplete?.();
		}
	}, [state, presentProp, stableOnExitComplete, toggleHasTransitioned]);

	const ref = useCallbackRef((refNode: HTMLElement | null) => {
		setNode(refNode);

		if (refNode) {
			stylesRef.current = getComputedStyle(refNode);
		}
	});

	const MOUNTED_STATES = ["mounted", "unmountSuspended"] satisfies Array<typeof state>;
	const isPresent = MOUNTED_STATES.includes(state);
	const isPresentOrIsTransitionComplete = isPresent || hasTransitioned;
	const shouldStartTransition = presentProp && hasTransitioned;

	const getPresenceProps: UsePresenceResult["propGetters"]["getPresenceProps"] = useCallback(
		(innerProps) => {
			const transitionState = shouldStartTransition ? "active" : "inactive";

			return {
				"data-present": dataAttr(isPresent),
				"data-present-or-transition-complete": dataAttr(isPresentOrIsTransitionComplete),
				"data-state": state,
				...(variant === "transition" && { "data-transition": transitionState }),
				...innerProps,
				className: innerProps.className,
			};
		},
		[isPresent, isPresentOrIsTransitionComplete, shouldStartTransition, state, variant]
	);

	const propGetters = useMemo(() => ({ getPresenceProps }), [getPresenceProps]);

	const result = useMemo<UsePresenceResult>(
		() =>
			({
				isPresent,
				isPresentOrIsTransitionComplete,
				propGetters,
				ref,
				shouldStartTransition,
			}) satisfies UsePresenceResult,
		[isPresent, isPresentOrIsTransitionComplete, propGetters, ref, shouldStartTransition]
	);

	return result;
};

export { usePresence };
