import { ContextError, createCustomContext } from "@zayne-labs/toolkit-react";
import type { UnionDiscriminator } from "@zayne-labs/toolkit-type-helpers";
import {
	useFormState,
	useFormContext as useHookFormContext,
	type Control,
	type FieldValues,
	type UseFormReturn,
	type UseFormStateReturn,
} from "react-hook-form";
import { getFieldErrorMessage } from "./utils";

export type RenderIconProps = {
	isPasswordVisible: boolean;
};

type EyeIconObject = UnionDiscriminator<
	[
		{ closed: React.ReactNode; open: React.ReactNode },
		{ renderIcon: (props: RenderIconProps) => React.ReactNode },
	]
>;

export type FormRootContextType = {
	withEyeIcon: boolean | EyeIconObject | undefined;
};

export const [LaxFormRootProvider, useLaxFormRootContext] = createCustomContext({
	defaultValue: null as unknown as FormRootContextType,
	hookName: "useLaxFormRootContext",
	name: "LaxFormRootContext",
	providerName: "FormRoot",
	strict: false,
});

export type UseFormRootContextResult<TStrict extends boolean = true> =
	TStrict extends true ? UseFormReturn : UseFormReturn | null;

export const useFormMethodsContext = <TStrict extends boolean = true>(
	options: { strict?: TStrict } = {}
): UseFormRootContextResult<TStrict> => {
	const { strict = true } = options;

	const formContext = useHookFormContext();

	// eslint-disable-next-line ts-eslint/no-unnecessary-condition -- Allow
	if (strict && !formContext) {
		throw new ContextError(
			`useFormMethodsContext returned "null". Did you forget to wrap the necessary components within FormRoot?`
		);
	}

	return formContext;
};

export type FieldContextType = {
	formDescriptionId: `${string}-(${string})-form-item-description`;
	formItemId: `${string}-(${string})-form-item`;
	formMessageId: `${string}-(${string})-form-item-message`;
	name: string;
};

export const [StrictFormFieldProvider, useStrictFormFieldContext] = createCustomContext<FieldContextType>({
	hookName: "useFormFieldContext",
	name: "StrictFormFieldContext",
	providerName: "FormField",
});

export const [LaxFormFieldProvider, useLaxFormFieldContext] = createCustomContext({
	defaultValue: null as unknown as FieldContextType,
	hookName: "useLaxFormFieldContext",
	name: "LaxFormFieldContext",
	providerName: "FormField",
	strict: false,
});

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
	const { control } = useFormMethodsContext({ strict: false }) ?? {};
	const { name } = useLaxFormFieldContext() ?? {};

	const resolvedControl = control ?? options?.control;

	const getFormState =
		// eslint-disable-next-line react-hooks/hooks -- Ignore
		resolvedControl ? useFormState : () => ({}) as Partial<ReturnType<typeof useFormState>>;

	// eslint-disable-next-line react-hooks/hooks -- Ignore
	const { disabled, errors } = getFormState({ control: resolvedControl, name: name ?? options?.name });

	const errorMessage = getFieldErrorMessage({ errors, fieldName: name, type: "regular" });

	return {
		errors,
		isDisabled: disabled,
		isInvalid: Boolean(errorMessage),
	};
};
