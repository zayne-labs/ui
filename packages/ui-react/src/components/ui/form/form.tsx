"use client";

import * as React from "react";

import { Slot } from "@/components/common";
import { getElementList } from "@/components/common/for";
import { EyeIconInvisible, EyeIconVisible } from "@/components/icons";
import { cnMerge } from "@/lib/utils/cn";
import { toArray } from "@zayne-labs/toolkit-core";
import { useToggle } from "@zayne-labs/toolkit-react";
import {
	type DiscriminatedRenderProps,
	type InferProps,
	type PolymorphicProps,
	getMultipleSlots,
} from "@zayne-labs/toolkit-react/utils";
import { Fragment as ReactFragment, useEffect, useId, useMemo, useRef } from "react";
import {
	type Control,
	Controller,
	type ControllerFieldState,
	type ControllerProps,
	type ControllerRenderProps,
	type FieldPath,
	type FieldPathValue,
	type FieldPathValues,
	FormProvider as HookFormProvider,
	type RegisterOptions,
	type UseFormReturn,
	type UseFormStateReturn,
	useFormState,
	useWatch,
} from "react-hook-form";
import {
	type FieldContextValue,
	type FieldState,
	type FormFieldContextProps,
	LaxFormFieldProvider,
	StrictFormFieldProvider,
	useFormRootContext,
	useLaxFormFieldContext,
	useLaxFormFieldState,
	useStrictFormFieldContext,
} from "./form-context";

export type FieldValues = Record<string, unknown>;

const dataAttr = (condition: unknown) => (condition ? "" : undefined) as unknown as boolean;

type FormRootProps<TFieldValues extends FieldValues> = React.ComponentPropsWithoutRef<"form"> & {
	children: React.ReactNode;
	methods: UseFormReturn<TFieldValues>;
};

export function FormRoot<TValues extends FieldValues>(props: FormRootProps<TValues>) {
	const { children, className, methods, ...restOfProps } = props;

	return (
		<HookFormProvider {...methods}>
			<form
				className={cnMerge("flex flex-col", className)}
				{...restOfProps}
				data-scope="form"
				data-part="root"
			>
				{children}
			</form>
		</HookFormProvider>
	);
}

type FormFieldProps<TControl, TFieldValues extends FieldValues> = (TControl extends Control<infer TValues>
	? {
			control?: never;
			name: FieldPath<TValues>;
		}
	: {
			control?: Control<TFieldValues>;
			name: FieldPath<TFieldValues>;
		})
	& (
		| (InferProps<"div"> & {
				withWrapper?: true;
		  })
		| { children: React.ReactNode; className?: never; withWrapper: false }
	);

export function FormField<TControl, TFieldValues extends FieldValues = FieldValues>(
	props: FormFieldProps<TControl, TFieldValues>
) {
	const { children, className, name, withWrapper = true } = props;

	const { isDisabled, isInvalid } = useLaxFormFieldState({ name });

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
		className: cnMerge("flex flex-col", className),
		"data-part": "field",
		"data-scope": "form",
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

export function FormControlledField<TFieldValues extends FieldValues>(
	props: ControllerProps<TFieldValues>
) {
	const { name } = props;

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
				<Controller {...props} />
			</LaxFormFieldProvider>
		</StrictFormFieldProvider>
	);
}

type FormFieldControllerRenderFn = (props: {
	field: Omit<ControllerRenderProps, "value"> & {
		value: never;
	};
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<never>;
}) => React.ReactElement;

type FormFieldControllerProps = Omit<
	ControllerProps<FieldValues, FieldPath<FieldValues>>,
	"control" | "name" | "render"
> & {
	render: FormFieldControllerRenderFn;
};

export function FormFieldController(props: FormFieldControllerProps) {
	const { control } = useFormRootContext();
	const { name } = useStrictFormFieldContext();
	const { render, ...restOfProps } = props;

	return <Controller name={name} control={control} render={render as never} {...restOfProps} />;
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
	const { formItemId, name } = useStrictFormFieldContext();
	const { children, className, ...restOfProps } = props;

	const { isDisabled, isInvalid } = useLaxFormFieldState({ name });

	return (
		<label
			data-scope="form"
			data-part="label"
			data-disabled={dataAttr(isDisabled)}
			data-invalid={dataAttr(isInvalid)}
			htmlFor={formItemId}
			className={className}
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
	props: PolymorphicProps<TElement, FormSideItemProps>
) {
	const { as: Element = "span", children, className, ...restOfProps } = props;

	return (
		<Element
			data-scope="form"
			data-part="left-item"
			className={cnMerge("inline-flex items-center justify-center", className)}
			{...restOfProps}
		>
			{children}
		</Element>
	);
}
FormInputLeftItem.slotSymbol = Symbol("leftItem");

export function FormInputRightItem<TElement extends React.ElementType = "span">(
	props: PolymorphicProps<TElement, FormSideItemProps>
) {
	const { as: Element = "span", children, className, ...restOfProps } = props;

	return (
		<Element
			data-scope="form"
			data-part="right-item"
			className={cnMerge("inline-flex items-center justify-center", className)}
			{...restOfProps}
		>
			{children}
		</Element>
	);
}
FormInputRightItem.slotSymbol = Symbol("rightItem");

type FormInputPrimitiveProps<TFieldValues extends FieldValues = FieldValues> = Omit<
	React.ComponentPropsWithRef<"input">,
	"children"
> & {
	classNames?: { error?: string; eyeIcon?: string; input?: string; inputGroup?: string };
	control?: Control<TFieldValues>;
	fieldState?: FieldState;
	name?: FieldPath<TFieldValues>;
	withEyeIcon?: boolean;
};

type FormTextAreaPrimitiveProps<TFieldValues extends FieldValues = FieldValues> =
	React.ComponentPropsWithRef<"textarea"> & {
		control?: Control<TFieldValues>;
		errorClassName?: string;
		fieldState?: FieldState;
		name?: FieldPath<TFieldValues>;
		type: "textarea";
	};

const inputTypesWithoutFullWith = new Set<React.HTMLInputTypeAttribute>(["checkbox", "radio"]);

export function FormInputPrimitive<TFieldValues extends FieldValues>(
	props: FormInputPrimitiveProps<TFieldValues> & { rules?: RegisterOptions }
) {
	const fieldContextValues = useLaxFormFieldContext();

	const {
		className,
		classNames,
		control,
		fieldState,
		id = fieldContextValues?.formItemId,
		name = fieldContextValues?.name,
		rules,
		type = "text",
		withEyeIcon = true,
		...restOfProps
	} = props;

	const fieldStateFromLaxFormField = useLaxFormFieldState({ control, name });

	const { isDisabled, isInvalid } = fieldState ?? fieldStateFromLaxFormField;

	const [isPasswordVisible, toggleVisibility] = useToggle(false);

	const shouldHaveEyeIcon = withEyeIcon && type === "password";

	const WrapperElement = shouldHaveEyeIcon ? FormInputGroup : ReactFragment;

	const wrapperElementProps = shouldHaveEyeIcon && {
		className: cnMerge("w-full", classNames?.inputGroup, isInvalid && classNames?.error),
		"data-disabled": dataAttr(isDisabled),
		"data-invalid": dataAttr(isInvalid),
	};

	const { register } = useFormRootContext({ strict: false }) ?? {};

	return (
		<WrapperElement {...wrapperElementProps}>
			<input
				data-scope="form"
				data-part="input"
				aria-describedby={
					!isInvalid
						? fieldContextValues?.formDescriptionId
						: `${fieldContextValues?.formDescriptionId} ${fieldContextValues?.formMessageId}`
				}
				aria-invalid={dataAttr(isInvalid)}
				data-invalid={dataAttr(isInvalid)}
				data-disabled={dataAttr(isDisabled)}
				id={id}
				name={name}
				type={type === "password" && isPasswordVisible ? "text" : type}
				className={cnMerge(
					!inputTypesWithoutFullWith.has(type) && "flex w-full",
					`bg-transparent text-sm file:border-0 file:bg-transparent
					placeholder:text-shadcn-muted-foreground focus-visible:outline-none
					disabled:cursor-not-allowed disabled:opacity-50`,
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
					onClick={toggleVisibility}
					className="size-5 shrink-0 lg:size-6"
				>
					{isPasswordVisible ? (
						<EyeIconInvisible className={cnMerge("size-full", classNames?.eyeIcon)} />
					) : (
						<EyeIconVisible className={cnMerge("size-full", classNames?.eyeIcon)} />
					)}
				</FormInputRightItem>
			)}
		</WrapperElement>
	);
}

export function FormTextAreaPrimitive<TFieldValues extends FieldValues>(
	props: FormTextAreaPrimitiveProps<TFieldValues> & { rules?: RegisterOptions }
) {
	const fieldContextValues = useLaxFormFieldContext();

	const {
		className,
		control,
		errorClassName,
		fieldState,
		id = fieldContextValues?.formItemId,
		name = fieldContextValues?.name,
		rules,
		...restOfProps
	} = props;

	const fieldStateFromLaxFormField = useLaxFormFieldState({ control, name });

	const { isDisabled, isInvalid } = fieldState ?? fieldStateFromLaxFormField;

	const { register } = useFormRootContext({ strict: false }) ?? {};

	return (
		<textarea
			data-scope="form"
			data-part="textarea"
			aria-describedby={
				!isInvalid
					? fieldContextValues?.formDescriptionId
					: `${fieldContextValues?.formDescriptionId} ${fieldContextValues?.formMessageId}`
			}
			aria-invalid={dataAttr(isInvalid)}
			data-disabled={dataAttr(isDisabled)}
			data-invalid={dataAttr(isInvalid)}
			id={id}
			name={name}
			className={cnMerge(
				`w-full bg-transparent text-sm placeholder:text-shadcn-muted-foreground
				focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
				className,
				isInvalid && errorClassName
			)}
			{...(Boolean(name) && register?.(name, rules))}
			{...restOfProps}
		/>
	);
}

type PrimitivePropsToOmit = "control" | "formState" | "name" | "ref";
type FormInputProps =
	| Omit<FormInputPrimitiveProps, PrimitivePropsToOmit>
	| Omit<FormTextAreaPrimitiveProps & { type: "textarea" }, PrimitivePropsToOmit>;

export function FormInput(props: FormInputProps & { rules?: RegisterOptions }) {
	const { rules, type, ...restOfProps } = props;

	const { name } = useStrictFormFieldContext();
	const { register } = useFormRootContext();

	const SelectedInput = type === "textarea" ? FormTextAreaPrimitive : FormInputPrimitive;

	return (
		<SelectedInput
			type={type as never}
			name={name}
			{...(Boolean(name) && register(name, rules))}
			{...(restOfProps as NonNullable<unknown>)}
		/>
	);
}

export function FormDescription(props: InferProps<"p">) {
	const { className, ...restOfProps } = props;

	const { formDescriptionId } = useLaxFormFieldContext() ?? {};

	return <p id={formDescriptionId} className={cnMerge("text-[12px]", className)} {...restOfProps} />;
}

type ErrorMessageRenderProps = {
	className: string;
	"data-index": number;
	"data-part": string;
	"data-scope": string;
	id: string | undefined;
	onAnimationEnd?: React.ReactEventHandler<HTMLElement>;
};

type ErrorMessageRenderState = { errorMessage: string; errorMessageArray: string[]; index: number };

type ErrorMessageRenderFn = (context: {
	props: ErrorMessageRenderProps;
	state: ErrorMessageRenderState;
}) => React.ReactNode;

type FormErrorMessagePrimitiveProps<TFieldValues extends FieldValues> =
	DiscriminatedRenderProps<ErrorMessageRenderFn> & {
		className?: string;
		classNames?: {
			container?: string;
			errorMessage?: string;
			errorMessageAnimation?: string;
		};
		control?: Control<TFieldValues>; // == Here for type inference of errorField prop
		withAnimationOnInvalid?: boolean;
	} & (
			| {
					errorField: FieldPath<TFieldValues>;
					type?: "regular";
			  }
			| {
					errorField: string;
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
	const fieldContextValues = useLaxFormFieldContext();
	const rootContextValues = useFormRootContext({ strict: false });

	const {
		children,
		className,
		classNames,
		control = rootContextValues?.control,
		errorField = fieldContextValues?.name,
		render,
		type = "regular",
		withAnimationOnInvalid = true,
	} = props;

	const { errors } = useLaxFormFieldState({ control, name: errorField });

	const { formMessageId } = useLaxFormFieldContext() ?? {};

	const wrapperRef = useRef<HTMLUListElement>(null);

	const errorAnimationClass = classNames?.errorMessageAnimation ?? "animate-shake";

	useEffect(() => {
		if (!withAnimationOnInvalid) return;

		const errorMessageElements = wrapperRef.current?.children;

		if (!errorMessageElements) return;

		for (const element of errorMessageElements) {
			element.classList.add(errorAnimationClass);
		}
	}, [errorAnimationClass, withAnimationOnInvalid]);

	useEffect(() => {
		const errorMessageElements = wrapperRef.current?.children;

		if (!errorMessageElements || !errors) return;

		// == Scroll to first error message
		if (Object.keys(errors).indexOf(errorField as string) === 0) {
			errorMessageElements[0]?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});

			window.scrollBy({ behavior: "smooth", top: -100 });
		}
	}, [errorField, errors]);

	const message = (
		type === "root"
			? errors?.root?.[errorField as string]?.message
			: errors?.[errorField as string]?.message
	) as string | string[];

	if (!message) {
		return null;
	}

	const errorMessageArray = toArray(message);

	const [ErrorMessageList] = getElementList();

	const onAnimationEnd: React.AnimationEventHandler<HTMLElement> | undefined = withAnimationOnInvalid
		? (event) => event.currentTarget.classList.remove(errorAnimationClass)
		: undefined;

	const getRenderProps = ({ index }: { index: number }) =>
		({
			className: cnMerge(errorAnimationClass, className, classNames?.errorMessage),
			"data-index": index,
			"data-part": "error-message",
			"data-scope": "form",
			id: formMessageId,
			onAnimationEnd,
		}) satisfies ErrorMessageRenderProps;

	const getRenderState = ({ errorMessage, index }: { errorMessage: string; index: number }) =>
		({
			errorMessage,
			errorMessageArray,
			index,
		}) satisfies ErrorMessageRenderState;

	const renderFn = typeof children === "function" ? children : render;

	return (
		<ErrorMessageList
			ref={wrapperRef}
			each={errorMessageArray}
			className={cnMerge("flex flex-col", classNames?.container)}
			render={(errorMessage, index) => {
				return renderFn({
					props: getRenderProps({ index }),
					state: getRenderState({ errorMessage, index }),
				});
			}}
		/>
	);
};

type FormErrorMessageProps<TControl, TFieldValues extends FieldValues> =
	| (TControl extends Control<infer TValues>
			? {
					className?: string;
					control?: never;
					errorField?: FieldPath<TValues>;
					type?: "regular";
				}
			: {
					className?: string;
					control?: Control<TFieldValues>; // == Here for type inference of errorField prop
					errorField?: FieldPath<TFieldValues>;
					type?: "regular";
				})
	| {
			className?: string;
			control?: never;
			errorField: string;
			type: "root";
	  };

export function FormErrorMessage<TControl, TFieldValues extends FieldValues = FieldValues>(
	props: FormErrorMessageProps<TControl, TFieldValues>
) {
	const fieldContextValues = useLaxFormFieldContext();

	const { className, errorField = fieldContextValues?.name, type = "regular" } = props;

	const { control } = useFormRootContext();

	return (
		<FormErrorMessagePrimitive
			control={control}
			errorField={errorField as NonNullable<typeof errorField>}
			type={type as "root"}
			render={({ props: renderProps, state: { errorMessage } }) => (
				<p
					{...renderProps}
					key={errorMessage}
					className={cnMerge("text-[13px]", "data-[index=0]:mt-1", renderProps.className, className)}
				>
					{errorMessage}
				</p>
			)}
		/>
	);
}

type FormSubmitProps = InferProps<"button"> & { asChild?: boolean };

export function FormSubmit<TElement extends React.ElementType = "button">(
	props: PolymorphicProps<TElement, FormSubmitProps>
) {
	const { as: Element = "button", asChild, children, type = "submit", ...restOfProps } = props;

	const Component = asChild ? Slot : Element;

	return (
		<Component type={type} {...restOfProps}>
			{children}
		</Component>
	);
}

type GetFieldValue<TFieldPathOrPaths, TFieldValues extends FieldValues> =
	TFieldPathOrPaths extends Array<FieldPath<TFieldValues>>
		? FieldPathValues<TFieldValues, TFieldPathOrPaths>
		: TFieldPathOrPaths extends FieldPath<TFieldValues>
			? FieldPathValue<TFieldValues, TFieldPathOrPaths>
			: unknown;

type FormSubscribeToFieldValueRenderFn<TFieldValues extends FieldValues, TFieldPathOrPaths> = (props: {
	value: GetFieldValue<TFieldPathOrPaths, TFieldValues>;
}) => React.ReactNode;

type FormSubscribeToFieldValueProps<
	TFieldValues extends FieldValues,
	TFieldPathOrPaths,
> = DiscriminatedRenderProps<FormSubscribeToFieldValueRenderFn<TFieldValues, TFieldPathOrPaths>> & {
	control: Control<TFieldValues>;
	name?: TFieldPathOrPaths;
};

export function FormSubscribeToFieldValue<
	TFieldValues extends FieldValues,
	const TFieldPathOrPaths extends Array<FieldPath<TFieldValues>> | FieldPath<TFieldValues>,
>(props: FormSubscribeToFieldValueProps<TFieldValues, TFieldPathOrPaths>) {
	const fieldContextValues = useLaxFormFieldContext();

	const { children, name = fieldContextValues?.name, render } = props;

	const { control } = useFormRootContext();

	const formValue = useWatch({ control, name: name as string });

	const fieldProps = { value: formValue };

	if (typeof children === "function") {
		return children(fieldProps as never);
	}

	return render(fieldProps as never);
}

type FormSubscribeToFormStateRenderFn<TFieldValues extends FieldValues> = (
	props: UseFormStateReturn<TFieldValues>
) => React.ReactNode;

type FormSubscribeToFormStateProps<TFieldValues extends FieldValues> = DiscriminatedRenderProps<
	FormSubscribeToFormStateRenderFn<TFieldValues>
> & {
	control?: Control<TFieldValues>;
	name?: Array<FieldPath<TFieldValues>> | FieldPath<TFieldValues>;
};

export function FormSubscribeToFormState<TFieldValues extends FieldValues = FieldValues>(
	props: FormSubscribeToFormStateProps<TFieldValues>
) {
	const fieldContextValues = useLaxFormFieldContext();

	const { children, control, name = fieldContextValues?.name, render } = props;

	const formState = useFormState({ control, name: name as FieldPath<TFieldValues> });

	if (typeof children === "function") {
		return children(formState as never);
	}

	return render(formState as never);
}
