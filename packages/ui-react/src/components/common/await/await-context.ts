import { createCustomContext } from "@zayne-labs/toolkit-react";

export type AwaitContextType<TValue = unknown> = {
	promise: Promise<TValue>;
	result: TValue;
};

export const [AwaitContextProvider, useAwaitContextImpl] = createCustomContext<AwaitContextType>({
	hookName: "useAwaitContext",
	name: "AwaitContext",
	providerName: "AwaitInner",
});

export const useAwaitContext = <TValue>() => useAwaitContextImpl() as AwaitContextType<TValue>;
