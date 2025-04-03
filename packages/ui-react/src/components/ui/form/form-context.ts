import { ContextError, createCustomContext } from "@zayne-labs/toolkit-react";
import type { DiscriminatedRenderProps } from "@zayne-labs/toolkit-react/utils";
import {
	type Control,
	type UseFormReturn,
	type UseFormStateReturn,
	useFormContext,
	useFormState,
} from "react-hook-form";
import type { FieldValues } from "./form";

export const useFormRootContext = <TStrict extends boolean = true>(options: { strict?: TStrict } = {}) => {
	const { strict = true } = options;
	const formContext = useFormContext();

	if (strict && !(formContext as unknown)) {
		throw new ContextError(
			`useFormRootContext returned "null". Did you forget to wrap the necessary components within FormRoot?`
		);
	}

	return formContext as TStrict extends true
		? UseFormReturn<FieldValues>
		: UseFormReturn<FieldValues> | null;
};
export type FieldState = {
	errors?: UseFormStateReturn<FieldValues>["errors"];
	isDisabled?: boolean;
	isInvalid?: boolean;
};

// eslint-disable-next-line ts-eslint/no-explicit-any -- any is used here for type compatibility
export type AnyControl = Control<any>;

type FieldStateOptions =
	| {
			control: AnyControl | undefined;
			name?: string;
	  }
	| {
			control?: AnyControl;
			name: string | undefined;
	  };

export const useLaxFormFieldState = (options?: FieldStateOptions): FieldState => {
	const { control = options?.control } = useFormRootContext({ strict: false }) ?? {};
	const { name = options?.name } = useLaxFormFieldContext() ?? {};

	const getFormState = control ? useFormState : () => ({}) as Partial<ReturnType<typeof useFormState>>;

	const { disabled, errors } = getFormState({ control, name });

	return { errors, isDisabled: disabled, isInvalid: Boolean(options?.name && errors?.[options.name]) };
};

// export const useStrictGetFieldState = () => {
// 	const { name } = useStrictFormFieldContext();

// 	const { getFieldState } = useFormRootContext();

// 	const fieldState = getFieldState(name);

// 	return fieldState;
// };

export type FieldContextValue = {
	formDescriptionId: `${string}-(${string})-form-item-description`;
	formItemId: `${string}-(${string})-form-item`;
	formMessageId: `${string}-(${string})-form-item-message`;
	name: string;
};

export type FormFieldContextProps = DiscriminatedRenderProps<
	(contextValue: FieldContextValue) => React.ReactNode
>;

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
