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

export type FieldContextValue = {
	name: string;
	uniqueId: string;
};

export type FormFieldContextProps = DiscriminatedRenderProps<
	(contextValue: FieldContextValue) => React.ReactNode
>;

export const [StrictFormFieldProvider, useStrictFormFieldContext] = createCustomContext<FieldContextValue>(
	{
		hookName: "useFormFieldContext",
		providerName: "FormField",
	}
);

export const [LaxFormFieldProvider, useLaxFormFieldContext] = createCustomContext<
	FieldContextValue,
	false
>({
	hookName: "useLaxFormFieldContext",
	providerName: "FormField",
	strict: false,
});
