import { ContextError, createCustomContext } from "@zayne-labs/toolkit-react";
import { useFormContext } from "react-hook-form";

export const useFormFieldContext = () => {
	const formContext = useFormContext() as ReturnType<typeof useFormContext> | null;

	if (!formContext) {
		throw new ContextError(
			`useFormFieldContext returned "null". Did you forget to wrap the necessary components within FormRoot?`
		);
	}

	return formContext;
};

export type ContextValue = {
	name: string;
	uniqueId: string;
};

export const [StrictFormItemProvider, useStrictFormItemContext] = createCustomContext<ContextValue>({
	hookName: "useFormItemContext",
	providerName: "FormItem",
});

export const [LaxFormItemProvider, useLaxFormItemContext] = createCustomContext<ContextValue, false>({
	hookName: "useLaxFormItemContext",
	providerName: "FormItem",
	strict: false,
});
