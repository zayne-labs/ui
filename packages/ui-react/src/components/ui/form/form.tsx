"use client";

import { dataAttr, on, toArray } from "@zayne-labs/toolkit-core";
import { useCallbackRef, useCompareValue, useToggle } from "@zayne-labs/toolkit-react";
import {
	composeRefs,
	composeTwoEventHandlers,
	getMultipleSlots,
	type DiscriminatedRenderItemProps,
	type DiscriminatedRenderProps,
	type InferProps,
	type PolymorphicPropsStrict,
} from "@zayne-labs/toolkit-react/utils";
import { defineEnum, type AnyString } from "@zayne-labs/toolkit-type-helpers";
import { Fragment as ReactFragment, useEffect, useId, useMemo, useRef } from "react";
import {
	Controller,
	FormProvider as HookFormProvider,
	useFormState,
	useWatch,
	type Control,
	type ControllerProps,
	type FieldPath,
	type RegisterOptions,
	type FormStateSubscribeProps as StateSubscribeProps,
	type UseFormReturn,
	type WatchProps,
} from "react-hook-form";
import { ForWithWrapper } from "@/components/common/for";
import { Slot } from "@/components/common/slot";
import { cnMerge } from "@/lib/utils/cn";
import {
	LaxFormFieldProvider,
	LaxFormRootProvider,
	StrictFormFieldProvider,
	useFormMethodsContext,
	useLaxFormFieldContext,
	useLaxFormFieldState,
	useLaxFormRootContext,
	useStrictFormFieldContext,
	type FieldContextValue,
	type FieldState,
	type FormFieldContextProps,
	type FormRootContext,
} from "./form-context";
import { getEyeIcon, getFieldErrorMessage } from "./utils";

// eslint-disable-next-line ts-eslint/no-explicit-any -- Necessary so that arrays can also be accepted
export type FieldValues = Record<string, any>;

type FormRootProps<TFieldValues extends FieldValues, TTransformedValues> = InferProps<"form">
	& Partial<FormRootContext> & {
		children: React.ReactNode;
		form: UseFormReturn<TFieldValues, unknown, TTransformedValues>;
	};

export function FormRoot<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: FormRootProps<TFieldValues, TTransformedValues>
) {
	const { children, className, form, withEyeIcon, ...restOfProps } = props;

	const shallowedComparedWithEyeIcon = useCompareValue(withEyeIcon);

	const formContextValue = useMemo(
		() => ({ withEyeIcon: shallowedComparedWithEyeIcon }),
		[shallowedComparedWithEyeIcon]
	);

	return (
		<HookFormProvider {...form}>
			<LaxFormRootProvider value={formContextValue}>
				<form
					className={cnMerge("flex flex-col", className)}
					{...restOfProps}
					data-scope="form"
					data-part="root"
					data-slot="form-root"
				>
					{children}
				</form>
			</LaxFormRootProvider>
		</HookFormProvider>
	);
}

type FormFieldProps<TControl, TFieldValues extends FieldValues, TTransformedValues> = (TControl extends (
	Control<infer TValues>
) ?
	{
		control?: never;
		name: FieldPath<TValues>;
	}
:	{
		control?: Control<TFieldValues, unknown, TTransformedValues>;
		name: FieldPath<TFieldValues>;
	})
	& (
		| (InferProps<"div"> & { withWrapper?: true })
		| { children: React.ReactNode; className?: never; withWrapper: false }
	);

export function FormField<
	TControl,
	TFieldValues extends FieldValues = FieldValues,
	TTransformedValues = TFieldValues,
>(props: FormFieldProps<TControl, TFieldValues, TTransformedValues>) {
	const { children, className, control, name, withWrapper = true } = props;

	const { isDisabled, isInvalid } = useLaxFormFieldState({ control, name });

	const uniqueId = useId();

	const fieldContextValue = useMemo(
		() =>
			({
				formDescriptionId: `${name}-(${uniqueId})-form-item-description`,
				formItemId: `${name}-(${uniqueId})-form-item`,
				formMessageId: `${name}-(${uniqueId})-form-item-message`,
				name,
			}) satisfies FieldContextValue,
		[name, uniqueId]
	);

	const WrapperElement = withWrapper ? "div" : ReactFragment;

	const wrapperElementProps = withWrapper && {
		className: cnMerge("flex flex-col gap-2", className),
		"data-part": "field",
		"data-scope": "form",
		"data-slot": "form-field",
		/* eslint-disable perfectionist/sort-objects -- order of attributes does not matter */
		"data-disabled": dataAttr(isDisabled),
		"data-invalid": dataAttr(isInvalid),
		/* eslint-enable perfectionist/sort-objects -- order of attributes does not matter */
	};
	return (
		<StrictFormFieldProvider value={fieldContextValue}>
			<LaxFormFieldProvider value={fieldContextValue}>
				<WrapperElement {...wrapperElementProps}>{children}</WrapperElement>
			</LaxFormFieldProvider>
		</StrictFormFieldProvider>
	);
}

type FormFieldControlledFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
> = ControllerProps<TFieldValues, TName, TTransformedValues>;

export function FormFieldWithController<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
>(props: FormFieldControlledFieldProps<TFieldValues, TName, TTransformedValues>) {
	const formMethods = useFormMethodsContext({ strict: false });

	const { control, name, render, ...restOfProps } = props;

	const uniqueId = useId();

	const fieldContextValue = useMemo(
		() =>
			({
				formDescriptionId: `${name}-(${uniqueId})-form-item-description`,
				formItemId: `${name}-(${uniqueId})-form-item`,
				formMessageId: `${name}-(${uniqueId})-form-item-message`,
				name,
			}) satisfies FieldContextValue,
		[name, uniqueId]
	);

	return (
		<StrictFormFieldProvider value={fieldContextValue}>
			<LaxFormFieldProvider value={fieldContextValue}>
				<Controller
					control={control ?? (formMethods?.control as never)}
					name={name}
					render={render as never}
					{...(restOfProps as object)}
				/>
			</LaxFormFieldProvider>
		</StrictFormFieldProvider>
	);
}

type FormFieldBoundControllerProps<TFieldValues extends FieldValues, TTransformedValues> = Omit<
	ControllerProps<TFieldValues, never, TTransformedValues>,
	"control" | "name"
>;

export function FormFieldBoundController<
	TFieldValues extends FieldValues = Record<string, never>,
	TTransformedValues = TFieldValues,
>(props: FormFieldBoundControllerProps<TFieldValues, TTransformedValues>) {
	const { control } = useFormMethodsContext();
	const { name } = useStrictFormFieldContext();
	const { render, ...restOfProps } = props;

	return (
		<Controller name={name} control={control} render={render as never} {...(restOfProps as object)} />
	);
}

export function FormFieldContext(props: FormFieldContextProps) {
	const { children, render } = props;
	const fieldContextValues = useStrictFormFieldContext();

	if (typeof children === "function") {
		return children(fieldContextValues);
	}

	return render(fieldContextValues);
}

export function FormLabel(props: InferProps<"label">) {
	const fieldContextValues = useStrictFormFieldContext();

	const { children, htmlFor, ...restOfProps } = props;

	const { isDisabled, isInvalid } = useLaxFormFieldState({ name: fieldContextValues.name });

	return (
		<label
			data-scope="form"
			data-part="label"
			data-slot="form-label"
			data-disabled={dataAttr(isDisabled)}
			data-invalid={dataAttr(isInvalid)}
			htmlFor={Object.hasOwn(props, "htmlFor") ? htmlFor : fieldContextValues.formItemId}
			{...restOfProps}
		>
			{children}
		</label>
	);
}

export function FormInputGroup(props: InferProps<"div">) {
	const { children, className, ...restOfProps } = props;

	const { isDisabled, isInvalid } = useLaxFormFieldState();

	const {
		regularChildren,
		slots: [leftItemSlot, rightItemSlot],
	} = getMultipleSlots(children, [FormInputLeftItem, FormInputRightItem]);

	return (
		<div
			data-scope="form"
			data-part="input-group"
			data-slot="form-input-group"
			data-invalid={dataAttr(isInvalid)}
			data-disabled={dataAttr(isDisabled)}
			className={cnMerge("flex items-center justify-between gap-2", className)}
			{...restOfProps}
		>
			{leftItemSlot}
			{regularChildren}
			{rightItemSlot}
		</div>
	);
}

type FormSideItemProps = {
	children?: React.ReactNode;
	className?: string;
};

export function FormInputLeftItem<TElement extends React.ElementType = "span">(
	props: PolymorphicPropsStrict<TElement, FormSideItemProps>
) {
	const { as: Element = "span", children, className, ...restOfProps } = props;

	return (
		<Element
			data-scope="form"
			data-part="left-item"
			data-slot="form-left-item"
			className={cnMerge("inline-flex items-center justify-center", className)}
			{...restOfProps}
		>
			{children}
		</Element>
	);
}
FormInputLeftItem.slotSymbol = Symbol("input-left-item");

export function FormInputRightItem<TElement extends React.ElementType = "span">(
	props: PolymorphicPropsStrict<TElement, FormSideItemProps>
) {
	const { as: Element = "span", children, className, ...restOfProps } = props;

	return (
		<Element
			data-scope="form"
			data-part="right-item"
			data-slot="form-right-item"
			className={cnMerge("inline-flex items-center justify-center", className)}
			{...restOfProps}
		>
			{children}
		</Element>
	);
}
FormInputRightItem.slotSymbol = Symbol("input-right-item");

type FormInputPrimitiveProps<TFieldValues extends FieldValues> = Omit<
	React.ComponentPropsWithRef<"input">,
	"children"
> & {
	classNames?: { error?: string; eyeIcon?: string; input?: string; inputGroup?: string };
	control?: Control<TFieldValues>;
	fieldState?: FieldState;
	name?: FieldPath<TFieldValues>;
	withEyeIcon?: FormRootContext["withEyeIcon"];
};

type FormTextAreaPrimitiveProps<TFieldValues extends FieldValues> =
	React.ComponentPropsWithRef<"textarea"> & {
		classNames?: { base?: string; error?: string };
		control?: Control<TFieldValues>;
		fieldState?: FieldState;
		name?: FieldPath<TFieldValues>;
	};

type FormSelectPrimitiveProps<TFieldValues extends FieldValues> = React.ComponentPropsWithRef<"select"> & {
	classNames?: { base?: string; error?: string };
	control?: Control<TFieldValues>;
	fieldState?: FieldState;
	name?: FieldPath<TFieldValues>;
};

const inputTypesWithoutFullWidth = new Set<React.HTMLInputTypeAttribute>(["checkbox", "radio"]);

export function FormInputPrimitive<TFieldValues extends FieldValues>(
	props: FormInputPrimitiveProps<TFieldValues> & { rules?: RegisterOptions }
) {
	const fieldContextValues = useLaxFormFieldContext();

	const formRootContextValues = useLaxFormRootContext();

	const {
		className,
		classNames,
		control,
		fieldState,
		id,
		name,
		rules,
		type = "text",
		withEyeIcon,
		...restOfProps
	} = props;

	const resolvedWithEyeIcon = withEyeIcon ?? formRootContextValues?.withEyeIcon ?? true;

	const fieldStateFromLaxFormField = useLaxFormFieldState({ control, name });

	const { isDisabled, isInvalid } = fieldState ?? fieldStateFromLaxFormField;

	const [isPasswordVisible, toggleIsPasswordVisible] = useToggle(false);

	const shouldHaveEyeIcon = Boolean(resolvedWithEyeIcon) && type === "password";

	const WrapperElement = shouldHaveEyeIcon ? FormInputGroup : ReactFragment;

	const wrapperElementProps = shouldHaveEyeIcon && {
		className: cnMerge("w-full", classNames?.inputGroup, isInvalid && classNames?.error),
	};

	const { register } = useFormMethodsContext({ strict: false }) ?? {};

	const eyeIcon = getEyeIcon({
		classNames,
		iconType: isPasswordVisible ? "closed" : "open",
		renderIconProps: { isPasswordVisible },
		withEyeIcon: resolvedWithEyeIcon,
	});

	return (
		<WrapperElement {...wrapperElementProps}>
			<input
				data-scope="form"
				data-part="input"
				data-slot="form-input"
				aria-describedby={
					!isInvalid ?
						fieldContextValues?.formDescriptionId
					:	`${fieldContextValues?.formDescriptionId} ${fieldContextValues?.formMessageId}`
				}
				aria-invalid={dataAttr(isInvalid)}
				data-invalid={dataAttr(isInvalid)}
				data-disabled={dataAttr(isDisabled)}
				id={Object.hasOwn(props, "id") ? id : fieldContextValues?.formItemId}
				name={Object.hasOwn(props, "name") ? name : fieldContextValues?.name}
				type={type === "password" && isPasswordVisible ? "text" : type}
				className={cnMerge(
					!inputTypesWithoutFullWidth.has(type) && "w-full min-w-0",
					`bg-transparent text-sm outline-hidden transition-[color,box-shadow] selection:bg-zu-primary
					selection:text-zu-primary-foreground file:inline-flex file:h-7 file:border-0
					file:bg-transparent file:font-medium file:text-zu-foreground
					placeholder:text-zu-muted-foreground focus-visible:outline-hidden
					disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50`,
					className,
					classNames?.input,
					type !== "password" && isInvalid && classNames?.error
				)}
				{...(Boolean(name) && register?.(name, rules))}
				{...restOfProps}
			/>

			{shouldHaveEyeIcon && (
				<FormInputRightItem
					as="button"
					type="button"
					onClick={toggleIsPasswordVisible}
					className="size-5 shrink-0 lg:size-6"
				>
					{eyeIcon}
				</FormInputRightItem>
			)}
		</WrapperElement>
	);
}

export function FormTextAreaPrimitive<TFieldValues extends FieldValues>(
	props: FormTextAreaPrimitiveProps<TFieldValues> & { rules?: RegisterOptions }
) {
	const fieldContextValues = useLaxFormFieldContext();

	const { className, classNames, control, fieldState, id, name, rules, ...restOfProps } = props;

	const fieldStateFromLaxFormField = useLaxFormFieldState({ control, name });

	const { isDisabled, isInvalid } = fieldState ?? fieldStateFromLaxFormField;

	const { register } = useFormMethodsContext({ strict: false }) ?? {};

	return (
		<textarea
			data-scope="form"
			data-part="textarea"
			data-slot="form-textarea"
			aria-describedby={
				!isInvalid ?
					fieldContextValues?.formDescriptionId
				:	`${fieldContextValues?.formDescriptionId} ${fieldContextValues?.formMessageId}`
			}
			aria-invalid={dataAttr(isInvalid)}
			data-disabled={dataAttr(isDisabled)}
			data-invalid={dataAttr(isInvalid)}
			id={Object.hasOwn(props, "id") ? id : fieldContextValues?.formItemId}
			name={Object.hasOwn(props, "name") ? name : fieldContextValues?.name}
			className={cnMerge(
				`w-full bg-transparent text-sm placeholder:text-zu-muted-foreground
				focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50`,
				className,
				classNames?.base,
				isInvalid && classNames?.error
			)}
			{...(Boolean(name) && register?.(name, rules))}
			{...restOfProps}
		/>
	);
}
export function FormSelectPrimitive<TFieldValues extends FieldValues>(
	props: FormSelectPrimitiveProps<TFieldValues> & { rules?: RegisterOptions }
) {
	const fieldContextValues = useLaxFormFieldContext();

	const { className, classNames, control, fieldState, id, name, rules, ...restOfProps } = props;

	const fieldStateFromLaxFormField = useLaxFormFieldState({ control, name });

	const { isDisabled, isInvalid } = fieldState ?? fieldStateFromLaxFormField;

	const { register } = useFormMethodsContext({ strict: false }) ?? {};

	return (
		<select
			defaultValue=""
			data-scope="form"
			data-part="select"
			data-slot="form-select"
			aria-describedby={
				!isInvalid ?
					fieldContextValues?.formDescriptionId
				:	`${fieldContextValues?.formDescriptionId} ${fieldContextValues?.formMessageId}`
			}
			aria-invalid={dataAttr(isInvalid)}
			data-disabled={dataAttr(isDisabled)}
			data-invalid={dataAttr(isInvalid)}
			id={id ?? fieldContextValues?.formItemId}
			name={name ?? fieldContextValues?.name}
			className={cnMerge(
				`w-full bg-transparent text-sm placeholder:text-zu-muted-foreground
				focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50`,
				className,
				classNames?.base,
				isInvalid && classNames?.error
			)}
			{...(Boolean(name) && register?.(name, rules))}
			{...restOfProps}
		/>
	);
}

type PrimitivePropsToOmit = "control" | "formState" | "name";

export type FormInputProps = Omit<FormInputPrimitiveProps<FieldValues>, PrimitivePropsToOmit> & {
	rules?: RegisterOptions;
};

export type FormTextAreaProps = Omit<FormTextAreaPrimitiveProps<FieldValues>, PrimitivePropsToOmit> & {
	rules?: RegisterOptions;
};

export type FormSelectProps = Omit<FormSelectPrimitiveProps<FieldValues>, PrimitivePropsToOmit> & {
	rules?: RegisterOptions;
};

type CombinedFormInputProps =
	| (FormSelectProps & { type: "select" })
	| (FormTextAreaProps & { type: "textarea" })
	| FormInputProps;

const InputTypeMap = defineEnum({
	select: FormSelectPrimitive,
	textarea: FormTextAreaPrimitive,
});

export function FormInput(props: CombinedFormInputProps & { rules?: RegisterOptions }) {
	const { onBlur, onChange, ref, rules, type, ...restOfProps } = props;

	const { name } = useStrictFormFieldContext();
	const { register } = useFormMethodsContext();

	const SelectedInput =
		type === "textarea" || type === "select" ?
			InputTypeMap[type as Exclude<typeof type, AnyString>]
		:	FormInputPrimitive;

	const registerProps = name ? register(name, rules) : null;

	return (
		<SelectedInput
			type={type as never}
			name={name}
			{...registerProps}
			{...(restOfProps as NonNullable<unknown>)}
			ref={composeRefs(registerProps?.ref, ref)}
			onChange={composeTwoEventHandlers(registerProps?.onChange, onChange)}
			onBlur={composeTwoEventHandlers(registerProps?.onBlur, onBlur)}
		/>
	);
}

export function FormTextArea(props: FormTextAreaProps) {
	return <FormInput {...props} type="textarea" />;
}

export function FormSelect(props: FormSelectProps) {
	return <FormInput {...props} type="select" />;
}

export function FormDescription(props: InferProps<"p">) {
	const { className, ...restOfProps } = props;

	const { formDescriptionId } = useLaxFormFieldContext() ?? {};

	return <p id={formDescriptionId} className={cnMerge("text-[12px]", className)} {...restOfProps} />;
}

type ErrorMessageRenderProps = {
	className: string;
	"data-index": number;
	"data-part": "error-message";
	"data-scope": "form";
	"data-slot": "form-error-message";
	id: string | undefined;
};

type ErrorMessageRenderState = { errorMessage: string; errorMessageArray: string[]; index: number };

type ErrorMessageRenderFn = (context: {
	props: ErrorMessageRenderProps;
	state: ErrorMessageRenderState;
}) => React.ReactNode;

export type FormErrorMessagePrimitiveProps<TFieldValues extends FieldValues> =
	DiscriminatedRenderItemProps<ErrorMessageRenderFn> & {
		className?: string;
		classNames?: {
			container?: string;
			errorMessage?: string;
			errorMessageAnimation?: string;
		};
		control?: Control<TFieldValues>; // == Here for type inference of errorField prop
		disableErrorAnimation?: boolean;
		disableScrollToErrorField?: boolean;
	} & (
			| {
					fieldName: FieldPath<TFieldValues>;
					type?: "regular";
			  }
			| {
					fieldName: string;
					type: "root";
			  }
		);

type FormErrorMessagePrimitiveType = {
	<TFieldValues extends FieldValues>(
		props: Extract<FormErrorMessagePrimitiveProps<TFieldValues>, { type?: "regular" }>
	): React.ReactNode;
	<TFieldValues extends FieldValues>(
		// eslint-disable-next-line ts-eslint/unified-signatures -- Using overloads are better because it gives better error messages
		props: Extract<FormErrorMessagePrimitiveProps<TFieldValues>, { type: "root" }>
	): React.ReactNode;
};

export const FormErrorMessagePrimitive: FormErrorMessagePrimitiveType = (props) => {
	const rootContextValues = useFormMethodsContext({ strict: false });

	const {
		children,
		className,
		classNames,
		control,
		disableErrorAnimation = false,
		disableScrollToErrorField = false,
		fieldName,
		renderItem,
		type = "regular",
	} = props;

	const { errors } = useLaxFormFieldState({
		control: control ?? rootContextValues?.control,
		name: fieldName,
	});

	const { formMessageId } = useLaxFormFieldContext() ?? {};

	const containerRef = useRef<HTMLUListElement>(null);

	const errorAnimationClass = classNames?.errorMessageAnimation ?? "animate-shake";

	const getErrorElements = useCallbackRef(() => containerRef.current?.children ?? []);

	useEffect(() => {
		if (disableErrorAnimation) return;

		if (!errors || Object.keys(errors).length === 0) return;

		const errorMessageElements = getErrorElements();

		if (errorMessageElements.length === 0) return;

		const controller = new AbortController();

		for (const element of errorMessageElements) {
			element.classList.add(errorAnimationClass);

			const onAnimationEnd = () => element.classList.remove(errorAnimationClass);

			on("animationend", element, onAnimationEnd, { once: true, signal: controller.signal });
		}

		return () => {
			controller.abort();
		};
	}, [disableErrorAnimation, errorAnimationClass, errors, getErrorElements]);

	useEffect(() => {
		if (disableScrollToErrorField) return;

		if (!errors || Object.keys(errors).length === 0) return;

		const errorMessageElements = getErrorElements();

		if (errorMessageElements.length === 0) return;

		const firstErrorElement = errorMessageElements[0];

		if (!firstErrorElement) return;

		// == Find the input field associated with this error
		const inputField = document.querySelector(`[name='${fieldName}']`);

		const isFocusableInput = inputField?.matches(
			":is(input, select, textarea, [contenteditable='true'])"
		);

		// == Return early if the input field is focusable (Only scrollIntoView for non-focusable fields)
		if (isFocusableInput) return;

		// == Get the element's position and scroll in one frame
		const frameID = requestAnimationFrame(() => {
			const elementRect = firstErrorElement.getBoundingClientRect();

			if (elementRect.top === 0) return;

			const topWithOffset = elementRect.top - 100;

			window.scrollTo({
				behavior: "smooth",
				top: window.scrollY + topWithOffset,
			});
		});

		return () => {
			cancelAnimationFrame(frameID);
		};
	}, [disableScrollToErrorField, fieldName, errors, getErrorElements]);

	const fieldErrorMessage = getFieldErrorMessage({ errors, fieldName, type });

	if (!fieldErrorMessage) {
		return null;
	}

	const errorMessageArray = toArray(fieldErrorMessage);

	if (errorMessageArray.length === 0) {
		return null;
	}

	const getRenderProps = (options: { index: number }): ErrorMessageRenderProps => {
		const { index } = options;

		return {
			className: cnMerge(className, classNames?.errorMessage),
			"data-index": index,
			"data-part": "error-message",
			"data-scope": "form",
			"data-slot": "form-error-message",
			id: formMessageId,
		};
	};

	const getRenderState = (options: { errorMessage: string; index: number }): ErrorMessageRenderState => {
		const { errorMessage, index } = options;

		return {
			errorMessage,
			errorMessageArray,
			index,
		};
	};

	const selectedChildren = typeof children === "function" ? children : renderItem;

	return (
		<ForWithWrapper
			ref={containerRef}
			className={cnMerge("flex flex-col", classNames?.container)}
			data-part="error-message-container"
			data-scope="form"
			data-slot="form-error-message-container"
			each={errorMessageArray}
			renderItem={(errorMessage, index) => {
				return selectedChildren({
					props: getRenderProps({ index }),
					state: getRenderState({ errorMessage, index }),
				});
			}}
		/>
	);
};

type FormErrorMessageProps<TControl, TFieldValues extends FieldValues, TTransformedValues> =
	| (TControl extends Control<infer TValues> ?
			{
				className?: string;
				control?: never;
				errorField?: FieldPath<TValues>;
				type?: "regular";
			}
	  :	{
				className?: string;
				control?: Control<TFieldValues, unknown, TTransformedValues>; // == Here for type inference of errorField prop
				errorField?: FieldPath<TFieldValues>;
				type?: "regular";
			})
	| {
			className?: string;
			errorField: string;
			type: "root";
	  };

export function FormErrorMessage<
	TControl,
	TFieldValues extends FieldValues = FieldValues,
	TTransformedValues = TFieldValues,
>(props: FormErrorMessageProps<TControl, TFieldValues, TTransformedValues>) {
	const fieldContextValues = useLaxFormFieldContext();

	const { className, errorField, type = "regular" } = props;

	const { control } = useFormMethodsContext();

	return (
		<FormErrorMessagePrimitive
			control={control}
			fieldName={errorField ?? (fieldContextValues?.name as NonNullable<typeof errorField>)}
			type={type as "root"}
			renderItem={({ props: renderProps, state }) => (
				<li
					key={state.errorMessage}
					{...renderProps}
					className={cnMerge(
						"text-[13px] text-zu-destructive",
						"data-[index=0]:mt-1",
						renderProps.className,
						className
					)}
				>
					{state.errorMessage}
				</li>
			)}
		/>
	);
}

type FormSubmitProps = InferProps<"button"> & { asChild?: boolean };

export function FormSubmit<TElement extends React.ElementType = "button">(
	props: PolymorphicPropsStrict<TElement, FormSubmitProps>
) {
	const { as: Element = "button", asChild, children, type = "submit", ...restOfProps } = props;

	const Component = asChild ? Slot.Root : Element;

	return (
		<Component data-part="submit" data-scope="form" data-slot="form-submit" type={type} {...restOfProps}>
			{children}
		</Component>
	);
}

type FormWatchProps<
	TFieldValues extends FieldValues,
	TFieldName extends
		| Array<FieldPath<TFieldValues>>
		| FieldPath<TFieldValues>
		| ReadonlyArray<FieldPath<TFieldValues>>
		| undefined,
	TTransformedValues,
	TComputeValue,
	TComputedProps extends Omit<
		WatchProps<TFieldName, TFieldValues, unknown, TTransformedValues, TComputeValue>,
		"names"
	> = Omit<WatchProps<TFieldName, TFieldValues, unknown, TTransformedValues, TComputeValue>, "names">,
> = DiscriminatedRenderProps<TComputedProps["render"]> & Omit<TComputedProps, "render">;

export function FormWatch<
	TFieldValues extends FieldValues = FieldValues,
	const TFieldName extends
		| Array<FieldPath<TFieldValues>>
		| FieldPath<TFieldValues>
		| ReadonlyArray<FieldPath<TFieldValues>>
		| undefined = undefined,
	TTransformedValues = TFieldValues,
	TComputeValue = undefined,
>(props: FormWatchProps<TFieldValues, TFieldName, TTransformedValues, TComputeValue>) {
	const fieldContextValue = useLaxFormFieldContext();

	const { children, compute, control, defaultValue, disabled, exact, name, render } = props;

	const methodsContextValue = useFormMethodsContext({ strict: false });

	const formValue = useWatch({
		compute: compute as never,
		control: methodsContextValue?.control ?? (control as never),
		defaultValue,
		disabled,
		exact,
		name: (name ?? fieldContextValue?.name) as string,
	}) as unknown;

	const selectedChildren = typeof children === "function" ? children : render;

	const resolvedChildren = selectedChildren(formValue as never);

	return resolvedChildren;
}

type FormStateSubscribeProps<
	TFieldValues extends FieldValues,
	TTransformedValues,
	TComputedProps extends StateSubscribeProps<TFieldValues, TTransformedValues> = StateSubscribeProps<
		TFieldValues,
		TTransformedValues
	>,
> = DiscriminatedRenderProps<TComputedProps["render"]> & Omit<TComputedProps, "render">;

export function FormStateSubscribe<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: FormStateSubscribeProps<TFieldValues, TTransformedValues>
) {
	const fieldContextValues = useLaxFormFieldContext();

	const { children, control, disabled, exact, name, render } = props;

	const formState = useFormState({
		control,
		disabled,
		exact,
		name: name ?? (fieldContextValues?.name as never),
	});

	const selectedChildren = typeof children === "function" ? children : render;

	const resolvedChildren = selectedChildren(formState as never);

	return resolvedChildren;
}
