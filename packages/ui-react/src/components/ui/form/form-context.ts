import { ContextError, createCustomContext } from "@zayne-labs/toolkit-react";
import type { DiscriminatedRenderProps } from "@zayne-labs/toolkit-react/utils";
import { type UseFormReturn, useFormContext } from "react-hook-form";
import type { FieldValues } from "./form";

export const useFormRootContext = () => {
	const formContext = useFormContext() as UseFormReturn<FieldValues> | null;

	if (!formContext) {
		throw new ContextError(
			`useFormRootContext returned "null". Did you forget to wrap the necessary components within FormRoot?`
		);
	}

	return formContext;
};

export type FieldContextValue = {
	formDescriptionId: `${string}-(${string})-form-item-description`;
	formItemId: `${string}-(${string})-form-item`;
	formMessageId: `${string}-(${string})-form-item-message`;
	name: string;
};

export type FormFieldContextProps = DiscriminatedRenderProps<
	(contextValue: FieldContextValue) => React.ReactNode
>;

export const useStrictGetFieldState = () => {
	const { name } = useStrictFormFieldContext();

	const { formState, getFieldState } = useFormRootContext();

	const fieldState = getFieldState(name, formState);

	return fieldState;
};

export const useLaxGetFieldState = (name: string | undefined) => {
	const { formState, getFieldState } = useFormRootContext();

	if (!name) return;

	const fieldState = getFieldState(name, formState);

	return fieldState;
};

export const [StrictFormFieldProvider, useStrictFormFieldContext] = createCustomContext<FieldContextValue>(
	{
		hookName: "useFormFieldContext",
		name: "StrictFormFieldContext",
		providerName: "FormField",
	}
);

export const [LaxFormFieldProvider, useLaxFormFieldContext] = createCustomContext<
	FieldContextValue,
	false
>({
	hookName: "useLaxFormFieldContext",
	name: "LaxFormFieldContext",
	providerName: "FormField",
	strict: false,
});
