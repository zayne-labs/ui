import { createCustomContext } from "@zayne-labs/toolkit-react";

export type AwaitContextType<TValue = unknown> = {
	promise: Promise<TValue>;
	result: TValue;
};

const [AwaitContextProvider, useAwaitContextImpl] = createCustomContext<AwaitContextType>({
	hookName: "useAwaitContext",
	name: "AwaitContext",
	providerName: "AwaitInner",
});

const useAwaitContext = <TValue>() => useAwaitContextImpl() as AwaitContextType<TValue>;

export { useAwaitContext, AwaitContextProvider };
