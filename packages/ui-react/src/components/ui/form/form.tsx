"use client";

import { dataAttr, on, toArray, tw } from "@zayne-labs/toolkit-core";
import {
	ContextError,
	useCallbackRef,
	useCompareValue,
	useComposeRefs,
	useToggle,
} from "@zayne-labs/toolkit-react";
import {
	composeTwoEventHandlers,
	getMultipleSlots,
	type DiscriminatedRenderItemProps,
	type DiscriminatedRenderProps,
	type InferProps,
	type PolymorphicPropsStrict,
} from "@zayne-labs/toolkit-react/utils";
import {
	defineEnum,
	isFunction,
	type AnyString,
	type DistributivePick,
} from "@zayne-labs/toolkit-type-helpers";
import { Fragment as ReactFragment, useEffect, useId, useMemo, useRef } from "react";
import {
	Controller,
	FormProvider as HookFormProvider,
	useFormState,
	useWatch,
	type Control,
	type ControllerProps,
	type FieldPath,
	type FieldValues,
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
	useFormContext,
	useLaxFormFieldContext,
	useLaxFormFieldState,
	useLaxFormRootContext,
	useStrictFormFieldContext,
	type FieldContextType,
	type FieldState,
	type FormRootContextType,
} from "./form-context";
import { FieldContext } from "./form-parts";
import { getEyeIcon, getFieldErrorMessage, getFormScopeAttrs } from "./utils";

export type FormRootProps<TFieldValues extends FieldValues, TTransformedValues> = InferProps<"form">
	& Partial<FormRootContextType> & {
		children: React.ReactNode;
		form: UseFormReturn<TFieldValues, unknown, TTransformedValues>;
	};

export function FormRoot<TFieldValues extends FieldValues, TTransformedValues = TFieldValues>(
	props: FormRootProps<TFieldValues, TTransformedValues>
) {
	const { children, className, form, ref, withEyeIcon, ...restOfProps } = props;

	const formRootRef = useRef<HTMLFormElement>(null);

	const shallowedComparedWithEyeIcon = useCompareValue(withEyeIcon);

	const formRootContextValue = useMemo<FormRootContextType>(
		() =>
			({
				formRootRef,
				withEyeIcon: shallowedComparedWithEyeIcon,
			}) satisfies FormRootContextType,
		[shallowedComparedWithEyeIcon]
	);

	const combinedRef = useComposeRefs(ref, formRootRef);

	return (
		<HookFormProvider {...form}>
			<LaxFormRootProvider value={formRootContextValue}>
				<form
					{...getFormScopeAttrs("root")}
					ref={combinedRef}
					className={cnMerge("flex flex-col", className)}
					{...restOfProps}
				>
					{children}
				</form>
			</LaxFormRootProvider>
		</HookFormProvider>
	);
}

export type FormFieldProps<
	TControl,
	TFieldValues extends FieldValues,
	TTransformedValues,
	TElement extends React.ElementType,
> = (TControl extends Control<infer TValues> ?
	{
		control?: never;
		name: FieldPath<TValues>;
	}
:	{
		control?: Control<TFieldValues, unknown, TTransformedValues>;
		name: FieldPath<TFieldValues>;
	})
	& (
		| PolymorphicPropsStrict<
				TElement,
				{ children: React.ReactNode; className?: string; withWrapper?: true }
		  >
		| { as?: never; children: React.ReactNode; className?: never; withWrapper: false }
	);

const getFieldProps = (ctx: { isDisabled: boolean | undefined; isInvalid: boolean | undefined }) => ({
	...getFormScopeAttrs("field"),
	"data-disabled": dataAttr(ctx.isDisabled),
	"data-invalid": dataAttr(ctx.isInvalid),
});

export function FormField<
	TControl,
	TFieldValues extends FieldValues = FieldValues,
	TTransformedValues = TFieldValues,
	TElement extends React.ElementType = "div",
>(props: FormFieldProps<TControl, TFieldValues, TTransformedValues, TElement>) {
	const {
		as: Element = "div",
		children,
		className,
		control,
		name,
		withWrapper = true,
		...restOfProps
	} = props;

	const { isDisabled, isInvalid } = useLaxFormFieldState({ control, name });

	const uniqueId = useId();

	const fieldContextValue = useMemo<FieldContextType>(
		() =>
			({
				formDescriptionId: `${name}-(${uniqueId})-form-item-description`,
				formItemId: `${name}-(${uniqueId})-form-item`,
				formMessageId: `${name}-(${uniqueId})-form-item-message`,
				isDisabled,
				isInvalid,
				name,
			}) satisfies FieldContextType,
		[name, uniqueId, isDisabled, isInvalid]
	);

	const WrapperElement = withWrapper ? Element : ReactFragment;

	const wrapperElementProps = withWrapper && {
		className: cnMerge("flex flex-col gap-2", className),
		...getFieldProps({ isDisabled, isInvalid }),
		...restOfProps,
	};
	return (
		<StrictFormFieldProvider value={fieldContextValue}>
			<LaxFormFieldProvider value={fieldContextValue}>
				<WrapperElement {...wrapperElementProps}>{children}</WrapperElement>
			</LaxFormFieldProvider>
		</StrictFormFieldProvider>
	);
}

type ModifiedControllerProps<
	TExtraRenderProps extends Record<string, unknown>,
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
	TControllerProps extends ControllerProps<TFieldValues, TName, TTransformedValues> = ControllerProps<
		TFieldValues,
		TName,
		TTransformedValues
	>,
> = Omit<TControllerProps, "render"> & {
	render: (
		ctx: Parameters<TControllerProps["render"]>[0] & TExtraRenderProps
	) => ReturnType<TControllerProps["render"]>;
};

export type FormFieldWithControllerProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
	TControllerProps extends ControllerProps<TFieldValues, TName, TTransformedValues> = ControllerProps<
		TFieldValues,
		TName,
		TTransformedValues
	>,
> = ModifiedControllerProps<
	{ fieldContext: FieldContextType; fieldProps: ReturnType<typeof getFieldProps> },
	TFieldValues,
	TName,
	TTransformedValues,
	TControllerProps
>;

export function FormFieldWithController<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
>(props: FormFieldWithControllerProps<TFieldValues, TName, TTransformedValues>) {
	const { control, name, render, ...restOfProps } = props;

	const methodsContextValue = useFormContext({ strict: false });

	const resolvedControl = (control ?? methodsContextValue?.control) as typeof control;

	if (!resolvedControl) {
		throw new ContextError(
			"<Form.FormFieldWithController> must be provided with an explicit 'control' prop or used within <Form.Root>"
		);
	}

	return (
		<FormField name={name} withWrapper={false}>
			<FieldContext
				render={(fieldContextValue) => (
					<Controller
						control={resolvedControl}
						name={name}
						render={(ctx) =>
							render({
								...ctx,
								fieldContext: fieldContextValue,
								fieldProps: getFieldProps({
									isDisabled: fieldContextValue.isDisabled,
									isInvalid: fieldContextValue.isInvalid,
								}),
							})
						}
						{...restOfProps}
					/>
				)}
			/>
		</FormField>
	);
}

export type FormFieldBoundControllerProps<TFieldValues extends FieldValues, TTransformedValues> = Omit<
	ModifiedControllerProps<
		{ fieldContext: FieldContextType },
		TFieldValues,
		FieldPath<TFieldValues>,
		TTransformedValues
	>,
	"control" | "name"
>;

export function FormFieldBoundController<
	TFieldValues extends FieldValues = Record<string, never>,
	TTransformedValues = TFieldValues,
>(props: FormFieldBoundControllerProps<TFieldValues, TTransformedValues>) {
	const { render, ...restOfProps } = props;

	const methodsContextValue = useFormContext();

	const fieldContextValue = useStrictFormFieldContext();

	return (
		<Controller
			name={fieldContextValue.name as FieldPath<TFieldValues>}
			control={methodsContextValue.control as Control<TFieldValues, unknown, TTransformedValues>}
			render={(ctx) => render({ ...ctx, fieldContext: fieldContextValue })}
			{...restOfProps}
		/>
	);
}

export type FormFieldContextProps = DiscriminatedRenderProps<
	(contextValue: FieldContextType) => React.ReactNode
>;

export function FormFieldContext(props: FormFieldContextProps) {
	const { children, render } = props;
	const fieldContextValues = useStrictFormFieldContext();

	if (typeof children === "function") {
		return children(fieldContextValues);
	}

	return render(fieldContextValues);
}

export type FormLabelProps = InferProps<"label">;

export function FormLabel(props: FormLabelProps) {
	const fieldContextValues = useStrictFormFieldContext();

	const { children, htmlFor, ...restOfProps } = props;

	const { isDisabled, isInvalid } = useLaxFormFieldState({ name: fieldContextValues.name });

	return (
		<label
			{...getFormScopeAttrs("label")}
			data-disabled={dataAttr(isDisabled)}
			data-invalid={dataAttr(isInvalid)}
			htmlFor={Object.hasOwn(props, "htmlFor") ? htmlFor : fieldContextValues.formItemId}
			{...restOfProps}
		>
			{children}
		</label>
	);
}

export type FormInputGroupProps = InferProps<"div">;

export function FormInputGroup(props: FormInputGroupProps) {
	const { children, className, ...restOfProps } = props;

	const { isDisabled, isInvalid } = useLaxFormFieldState();

	const {
		regularChildren,
		slots: [leftItemSlot, rightItemSlot],
	} = getMultipleSlots(children, [FormInputLeftItem, FormInputRightItem]);

	return (
		<div
			{...getFormScopeAttrs("input-group")}
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

export type FormSideItemProps = {
	children?: React.ReactNode;
	className?: string;
};

export function FormInputLeftItem<TElement extends React.ElementType = "span">(
	props: PolymorphicPropsStrict<TElement, FormSideItemProps>
) {
	const { as: Element = "span", children, className, ...restOfProps } = props;

	return (
		<Element
			{...getFormScopeAttrs("left-item")}
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
			{...getFormScopeAttrs("right-item")}
			className={cnMerge("inline-flex items-center justify-center", className)}
			{...restOfProps}
		>
			{children}
		</Element>
	);
}
FormInputRightItem.slotSymbol = Symbol("input-right-item");

type RulesProp = {
	rules?: RegisterOptions;
};

export type FormInputPrimitiveProps<TFieldValues extends FieldValues> = Omit<
	InferProps<"input">,
	"children"
>
	& RulesProp & {
		classNames?: { error?: string; eyeIcon?: string; input?: string; inputGroup?: string };
		control?: Control<TFieldValues>;
		fieldState?: FieldState;
		name?: FieldPath<TFieldValues>;
		withEyeIcon?: FormRootContextType["withEyeIcon"];
	};

export type FormTextAreaPrimitiveProps<TFieldValues extends FieldValues> = InferProps<"textarea">
	& RulesProp & {
		classNames?: { base?: string; error?: string };
		control?: Control<TFieldValues>;
		fieldState?: FieldState;
		name?: FieldPath<TFieldValues>;
	};

export type FormSelectPrimitiveProps<TFieldValues extends FieldValues> = InferProps<"select">
	& RulesProp & {
		classNames?: { base?: string; error?: string };
		control?: Control<TFieldValues>;
		fieldState?: FieldState;
		name?: FieldPath<TFieldValues>;
	};

const inputTypesWithoutFullWidth = new Set<React.HTMLInputTypeAttribute>(["checkbox", "radio"]);

export function FormInputPrimitive<TFieldValues extends FieldValues>(
	props: FormInputPrimitiveProps<TFieldValues>
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

	const wrapperElementProps =
		shouldHaveEyeIcon
		&& ({
			className: cnMerge("w-full", classNames?.inputGroup, isInvalid && classNames?.error),
		} satisfies InferProps<typeof FormInputGroup>);

	const { register } = useFormContext({ strict: false }) ?? {};

	const eyeIcon = getEyeIcon({
		classNames,
		iconType: isPasswordVisible ? "closed" : "open",
		renderIconProps: { isPasswordVisible },
		withEyeIcon: resolvedWithEyeIcon,
	});

	return (
		<WrapperElement {...wrapperElementProps}>
			<input
				{...getFormScopeAttrs("input")}
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
	props: FormTextAreaPrimitiveProps<TFieldValues>
) {
	const fieldContextValues = useLaxFormFieldContext();

	const { className, classNames, control, fieldState, id, name, rules, ...restOfProps } = props;

	const fieldStateFromLaxFormField = useLaxFormFieldState({ control, name });

	const { isDisabled, isInvalid } = fieldState ?? fieldStateFromLaxFormField;

	const { register } = useFormContext({ strict: false }) ?? {};

	return (
		<textarea
			{...getFormScopeAttrs("textarea")}
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
	props: FormSelectPrimitiveProps<TFieldValues>
) {
	const fieldContextValues = useLaxFormFieldContext();

	const { className, classNames, control, fieldState, id, name, rules, ...restOfProps } = props;

	const fieldStateFromLaxFormField = useLaxFormFieldState({ control, name });

	const { isDisabled, isInvalid } = fieldState ?? fieldStateFromLaxFormField;

	const { register } = useFormContext({ strict: false }) ?? {};

	return (
		<select
			{...getFormScopeAttrs("select")}
			defaultValue=""
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

export type FormInputProps = Omit<FormInputPrimitiveProps<FieldValues>, PrimitivePropsToOmit>;

export type FormTextAreaProps = Omit<FormTextAreaPrimitiveProps<FieldValues>, PrimitivePropsToOmit>;

export type FormSelectProps = Omit<FormSelectPrimitiveProps<FieldValues>, PrimitivePropsToOmit>;

export type FormInputCombinedProps =
	| (FormInputProps & { type?: FormInputProps["type"] })
	| (FormSelectProps & { type: "select" })
	| (FormTextAreaProps & { type: "textarea" });

const InputTypeMap = defineEnum({
	select: FormSelectPrimitive,
	textarea: FormTextAreaPrimitive,
});

export function FormInput(props: FormInputCombinedProps) {
	const { onBlur, onChange, ref, rules, type, ...restOfProps } = props;

	const { name } = useStrictFormFieldContext();
	const { register } = useFormContext();

	const SelectedInput =
		type === "textarea" || type === "select" ?
			InputTypeMap[type as Exclude<typeof type, AnyString>]
		:	FormInputPrimitive;

	const registerProps = name ? register(name, rules) : null;

	const combinedRef = useComposeRefs(registerProps?.ref, ref);

	return (
		<SelectedInput
			type={type}
			name={name}
			{...registerProps}
			{...(restOfProps as NonNullable<unknown>)}
			ref={combinedRef}
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

export type FormDescriptionProps<TElement extends React.ElementType = "p"> = PolymorphicPropsStrict<
	TElement,
	InferProps<TElement>
>;

export function FormDescription<TElement extends React.ElementType = "p">(
	props: FormDescriptionProps<TElement>
) {
	const { as: Element = "p", ...restOfProps } = props;

	const { formDescriptionId } = useLaxFormFieldContext() ?? {};

	return (
		<Element
			{...getFormScopeAttrs("description")}
			id={formDescriptionId}
			{...restOfProps}
			className={cnMerge("text-[12px]", restOfProps.className)}
		/>
	);
}

type ErrorMessageRenderProps = ReturnType<typeof getFormScopeAttrs<"error-message">> & {
	className: string;
	"data-index": number;
	id: string | undefined;
};

type ErrorMessageRenderState = {
	errorMessage: string;
	errorMessageArray: string[];
	index: number;
};

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
		control?: Control<TFieldValues>; // == Here for type inference of name prop
		disableErrorAnimation?: boolean;
		disableScrollToError?: boolean;
		scrollToErrorOffset?: number;
	} & (
			| {
					name: FieldPath<TFieldValues>;
					type?: "regular";
			  }
			| {
					name: string;
					type: "root";
			  }
		);

type FormErrorMessagePrimitiveOverloadType = {
	<TFieldValues extends FieldValues>(
		props: Extract<FormErrorMessagePrimitiveProps<TFieldValues>, { type?: "regular" }>
	): React.ReactNode;
	<TFieldValues extends FieldValues>(
		// eslint-disable-next-line ts-eslint/unified-signatures -- Using overloads are better because it gives better error messages
		props: Extract<FormErrorMessagePrimitiveProps<TFieldValues>, { type: "root" }>
	): React.ReactNode;
};

export const FormErrorMessagePrimitive: FormErrorMessagePrimitiveOverloadType = (props) => {
	const methodsContextValues = useFormContext({ strict: false });

	const {
		children,
		className,
		classNames,
		control,
		disableErrorAnimation = false,
		disableScrollToError = false,
		name,
		renderItem,
		scrollToErrorOffset = 100,
		type = "regular",
	} = props;

	const resolvedControl = (control ?? methodsContextValues?.control) as typeof control;

	if (!resolvedControl) {
		throw new ContextError(
			"<Form.ErrorMessagePrimitive> must be provided with an explicit 'control' prop or used within <Form.Root>"
		);
	}

	const { errors } = useLaxFormFieldState({
		control: resolvedControl,
		name,
	});

	const fieldContextValues = useLaxFormFieldContext();

	const containerRef = useRef<HTMLUListElement>(null);

	const errorAnimationClass = classNames?.errorMessageAnimation ?? tw`animate-shake`;

	const getErrorElements = useCallbackRef(() => containerRef.current?.children ?? []);

	const formRootContextValues = useLaxFormRootContext();

	const { submitCount } = useFormState({ control: resolvedControl as never });

	const prevSubmitCountRef = useRef(submitCount);

	useEffect(() => {
		if (disableScrollToError) return;

		if (!errors || Object.keys(errors).length === 0) return;

		if (submitCount === prevSubmitCountRef.current) return;

		prevSubmitCountRef.current = submitCount;

		const errorMessageElements = getErrorElements();

		if (errorMessageElements.length === 0) return;

		const firstErrorElement = errorMessageElements[0];

		if (!firstErrorElement) return;

		const formElement =
			formRootContextValues?.formRootRef.current ?? containerRef.current?.closest("form") ?? document;

		// == Find the input field associated with this error
		const inputField = formElement.querySelector<HTMLElement>(`[name="${CSS.escape(name)}"]`);

		const isFocusableInput =
			inputField
			&& inputField.matches(":is(input, select, textarea, [contenteditable='true'])")
			&& !inputField.matches(":disabled, [type='hidden']")
			&& inputField.tabIndex >= 0;

		// == Return early if the input field is focusable (Only scrollIntoView for non-focusable fields)
		if (isFocusableInput) return;

		// == Check if we are the FIRST error on the page (to prevent multiple scrolls overriding each other)
		const allVisibleErrors = formElement.querySelectorAll(
			'[data-scope="form"][data-part="error-message"]'
		);
		const isFirstErrorOnPage = allVisibleErrors.length > 0 && allVisibleErrors[0] === firstErrorElement;

		if (!isFirstErrorOnPage) return;

		// == Get the element's position and scroll in one frame
		const frameID = requestAnimationFrame(() => {
			const elementRect = firstErrorElement.getBoundingClientRect();

			if (elementRect.width === 0 && elementRect.height === 0) return;

			const topWithOffset = elementRect.top - scrollToErrorOffset;

			window.scrollTo({
				behavior: "smooth",
				top: window.scrollY + topWithOffset,
			});
		});

		return () => {
			cancelAnimationFrame(frameID);
		};
	}, [
		disableScrollToError,
		name,
		errors,
		getErrorElements,
		scrollToErrorOffset,
		submitCount,
		formRootContextValues?.formRootRef,
	]);

	useEffect(() => {
		if (disableErrorAnimation) return;

		if (!errors || Object.keys(errors).length === 0) return;

		const errorMessageElements = getErrorElements();

		if (errorMessageElements.length === 0) return;

		const controller = new AbortController();

		for (const element of errorMessageElements) {
			element.classList.add(errorAnimationClass);

			const onAnimationEnd = () => element.classList.remove(errorAnimationClass);

			on(element, "animationend", onAnimationEnd, { once: true, signal: controller.signal });
		}

		return () => {
			controller.abort();
		};
	}, [disableErrorAnimation, errorAnimationClass, errors, getErrorElements]);

	const fieldErrorMessage = getFieldErrorMessage({ errors, name, type });

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
			...getFormScopeAttrs("error-message"),
			className: cnMerge(className, classNames?.errorMessage),
			"data-index": index,
			id: fieldContextValues?.formMessageId,
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
			{...getFormScopeAttrs("error-message-container")}
			ref={containerRef}
			className={cnMerge("flex flex-col gap-0.5 pt-1", classNames?.container)}
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

export type FormErrorMessageProps<
	TControl,
	TFieldValues extends FieldValues,
	TTransformedValues,
> = DistributivePick<FormErrorMessagePrimitiveProps<TFieldValues>, "className" | "classNames">
	& (
		| (TControl extends Control<infer TValues> ?
				{
					control?: never;
					name?: FieldPath<TValues>;
					type?: "regular";
				}
		  :	{
					control?: Control<TFieldValues, unknown, TTransformedValues>; // == Here for type inference of name prop
					name?: FieldPath<TFieldValues>;
					type?: "regular";
				})
		| {
				name: string;
				type: "root";
		  }
	);

export function FormErrorMessage<
	TControl,
	TFieldValues extends FieldValues = FieldValues,
	TTransformedValues = TFieldValues,
>(props: FormErrorMessageProps<TControl, TFieldValues, TTransformedValues>) {
	const fieldContextValues = useLaxFormFieldContext();

	const { className, classNames, name, type = "regular" } = props;

	const { control } = useFormContext();

	return (
		<FormErrorMessagePrimitive
			type={type as "root"}
			className={className}
			classNames={classNames}
			control={control}
			name={name ?? (fieldContextValues?.name as NonNullable<typeof name>)}
			renderItem={({ props: innerProps, state }) => (
				<li
					key={state.index}
					{...innerProps}
					className={cnMerge("text-[13px] text-zu-destructive", innerProps.className)}
				>
					{state.errorMessage}
				</li>
			)}
		/>
	);
}

export type FormSubmitProps<TFieldValues extends FieldValues, TTransformedValues> = Omit<
	InferProps<"button">,
	"children"
> & {
	asChild?: boolean;
} & (
		| {
				children: React.ReactNode;
				control?: never;
		  }
		| {
				children: StateSubscribeProps<TFieldValues, TTransformedValues>["render"];
				control?: Control<TFieldValues, unknown, TTransformedValues>;
		  }
	);

export function FormSubmit<
	// eslint-disable-next-line ts-eslint/no-explicit-any -- Allow
	TElement extends React.ElementType<any, "button"> = "button",
	TFieldValues extends FieldValues = Record<string, unknown>,
	TTransformedValues = TFieldValues,
>(props: PolymorphicPropsStrict<TElement, FormSubmitProps<TFieldValues, TTransformedValues>>) {
	const { as: Element = "button", asChild, children, control, type = "submit", ...restOfProps } = props;

	const Component = asChild ? Slot.Root : Element;

	const methodsContextValue = useFormContext({ strict: false });

	const resolvedControl = control ?? methodsContextValue?.control;

	if (isFunction(children) && !resolvedControl) {
		throw new ContextError(
			"<Form.Submit> must be provided with an explicit 'control' prop or used within <Form.Root> if a render prop is passed as children"
		);
	}

	// eslint-disable-next-line react-hooks/hooks -- Ignore for now
	const getFormState = isFunction(children) && resolvedControl ? useFormState : () => ({}) as never;

	// eslint-disable-next-line react-hooks/hooks -- Ignore for now
	const formState = getFormState<TFieldValues>({
		control: resolvedControl as never,
		disabled: restOfProps.disabled,
	});

	const resolvedChildren = isFunction(children) ? children(formState) : children;

	return (
		<Component data-slot="form-submit" data-part="submit" data-scope="form" type={type} {...restOfProps}>
			{resolvedChildren}
		</Component>
	);
}

export type FormWatchProps<
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
	TFieldValues extends FieldValues = Record<string, unknown>,
	const TFieldName extends
		| Array<FieldPath<TFieldValues>>
		| FieldPath<TFieldValues>
		| ReadonlyArray<FieldPath<TFieldValues>>
		| undefined = FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
	TComputeValue = undefined,
>(props: FormWatchProps<TFieldValues, TFieldName, TTransformedValues, TComputeValue>) {
	const fieldContextValue = useLaxFormFieldContext();

	const { children, compute, control, defaultValue, disabled, exact, name, render } = props;

	const methodsContextValue = useFormContext({ strict: false });

	const resolvedControl = control ?? methodsContextValue?.control;

	if (!resolvedControl) {
		throw new ContextError(
			"<Form.Watch> must be provided with an explicit 'control' prop or used within <Form.Root>"
		);
	}

	const formValue = useWatch({
		compute: compute as never,
		control: resolvedControl as never,
		defaultValue,
		disabled,
		exact,
		name: (name ?? fieldContextValue?.name) as string,
	}) as unknown;

	const selectedChildren = typeof children === "function" ? children : render;

	const resolvedChildren = selectedChildren(formValue as never);

	return resolvedChildren;
}

export type FormStateSubscribeProps<
	TFieldValues extends FieldValues,
	TTransformedValues,
	TComputedProps extends StateSubscribeProps<TFieldValues, TTransformedValues> = StateSubscribeProps<
		TFieldValues,
		TTransformedValues
	>,
> = DiscriminatedRenderProps<TComputedProps["render"]> & Omit<TComputedProps, "render">;

export function FormStateSubscribe<
	TFieldValues extends FieldValues = Record<string, unknown>,
	TTransformedValues = TFieldValues,
>(props: FormStateSubscribeProps<TFieldValues, TTransformedValues>) {
	const fieldContextValues = useLaxFormFieldContext();

	const { children, control, disabled, exact, name, render } = props;

	const methodsContextValue = useFormContext({ strict: false });

	const resolvedControl = control ?? methodsContextValue?.control;

	if (!resolvedControl) {
		throw new ContextError(
			"<Form.StateSubscribe> must be provided with an explicit 'control' prop or used within <Form.Root>"
		);
	}

	const formState = useFormState({
		control: resolvedControl as never,
		disabled,
		exact,
		name: name ?? (fieldContextValues?.name as never),
	});

	const selectedChildren = typeof children === "function" ? children : render;

	const resolvedChildren = selectedChildren(formState);

	return resolvedChildren;
}
