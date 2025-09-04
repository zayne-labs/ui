"use client";

import { useIsHydrated } from "@zayne-labs/toolkit-react";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";

type ClientGateProps = {
	/**
	 * You are encouraged to add a fallback that is the same dimensions
	 * as the client rendered children. This will avoid content layout
	 * shift which is disgusting 🥲
	 */
	children: React.ReactNode | (() => React.ReactNode);
	fallback?: React.ReactNode;
};

/**
 * @description Render the children only after the JS has loaded client-side. Use an optional
 * fallback component if the JS is not yet loaded.
 *
 * @example
 * **Render a Chart component if JS loads, renders a simple FakeChart
 * component server-side or if there is no JS. The FakeChart can have only the
 * UI without the behavior or be a loading spinner or skeleton.**
 *
 * ```tsx
 * return (
 *   <ClientOnly fallback={<FakeChart />}>
 *     {() => <Chart />}
 *   </ClientOnly>
 * );
 * ```
 */
function ClientGate(props: ClientGateProps) {
	const { children, fallback } = props;

	const isHydrated = useIsHydrated();

	const getResolvedChildren = () => (isFunction(children) ? children() : children);

	return isHydrated ? getResolvedChildren() : fallback;
}

export { ClientGate };
