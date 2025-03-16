import { ContextError, createCustomContext } from "@zayne-labs/toolkit-react";
import type { DiscriminatedRenderProps } from "@zayne-labs/toolkit-react/utils";
import { type UseFormReturn, useFormContext } from "react-hook-form";
import type { FieldValues } from "./form";

export type FormRootContextValue<TFieldValues extends FieldValues = FieldValues> =
	UseFormReturn<TFieldValues>;

export const useFormRootContext = () => {
	const formContext = useFormContext() as FormRootContextValue | null;

	if (!formContext) {
		throw new ContextError(
			`useFormRootContext returned "null". Did you forget to wrap the necessary components within FormRoot?`
		);
	}

	return formContext;
};

export type ItemContextValue = {
	name: string;
	uniqueId: string;
};

export type FormItemContextProps = DiscriminatedRenderProps<
	(contextValue: ItemContextValue) => React.ReactNode
>;

export const [StrictFormItemProvider, useStrictFormItemContext] = createCustomContext<ItemContextValue>({
	hookName: "useFormItemContext",
	providerName: "FormItem",
});

export const [LaxFormItemProvider, useLaxFormItemContext] = createCustomContext<ItemContextValue, false>({
	hookName: "useLaxFormItemContext",
	providerName: "FormItem",
	strict: false,
});
