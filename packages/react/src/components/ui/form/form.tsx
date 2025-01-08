"use client";

import * as React from "react";

import { getElementList } from "@/components/common/for";
import { EyeIconInvisible, EyeIconVisible } from "@/components/icons";
import { cnMerge } from "@/lib/utils/cn";
import { toArray } from "@zayne-labs/toolkit-core";
import { useToggle } from "@zayne-labs/toolkit-react";
import {
	type DiscriminatedRenderProps,
	type InferProps,
	type PolymorphicProps,
	getOtherChildren,
	getSlotElement,
} from "@zayne-labs/toolkit-react/utils";
import { Fragment as ReactFragment, useEffect, useId, useMemo, useRef } from "react";
import {
	type Control,
	type ControllerFieldState,
	Controller as ControllerPrimitive,
	type ControllerProps,
	type ControllerRenderProps,
	type FieldPath,
	type FormState,
	FormProvider as HookFormProvider,
	type RegisterOptions,
	type UseFormReturn,
	type UseFormStateReturn,
	useFormState,
} from "react-hook-form";
import {
	type ContextValue,
	LaxFormItemProvider,
	StrictFormItemProvider,
	useFormFieldContext,
	useLaxFormItemContext,
	useStrictFormItemContext,
} from "./form-context";

type FieldValues = Record<string, unknown>;

type FormRootProps<TValues extends FieldValues> = React.ComponentPropsWithoutRef<"form"> & {
	children: React.ReactNode;
	methods: UseFormReturn<TValues>;
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

type FormItemProps<TControl, TFieldValues extends FieldValues> = (TControl extends Control<infer TValues>
	? {
			control?: never;
			name: keyof TValues;
		}
	: {
			control?: Control<TFieldValues>;
			name: keyof TFieldValues;
		}) & {
	children: React.ReactNode;
	className?: string;
	withWrapper?: boolean;
};

export function FormItem<TControl, TFieldValues extends FieldValues = FieldValues>(
	props: FormItemProps<TControl, TFieldValues>
) {
	const { children, className, name, withWrapper = true } = props;

	const uniqueId = useId();

	const value = useMemo(
		() => ({ name: String(name), uniqueId: `${String(name)}-(${uniqueId})` }),
		[name, uniqueId]
	);

	const WrapperElement = withWrapper ? "div" : ReactFragment;

	const wrapperElementProps = withWrapper && {
		className: cnMerge("flex flex-col", className),
		"data-part": "item",
		"data-scope": "form",
	};

	return (
		<StrictFormItemProvider value={value}>
			<LaxFormItemProvider value={value}>
				<WrapperElement {...wrapperElementProps}>{children}</WrapperElement>
			</LaxFormItemProvider>
		</StrictFormItemProvider>
	);
}

type FormItemContextProps = DiscriminatedRenderProps<(contextValue: ContextValue) => React.ReactNode>;

export function FormItemContext(props: FormItemContextProps) {
	const { children, render } = props;
	const contextValues = useStrictFormItemContext();

	if (typeof children === "function") {
		return children(contextValues);
	}

	return render(contextValues);
}

export function FormLabel(props: InferProps<"label">) {
	const { uniqueId } = useStrictFormItemContext();
	const { children, className, ...restOfProps } = props;

	return (
		<label data-scope="form" data-part="label" htmlFor={uniqueId} className={className} {...restOfProps}>
			{children}
		</label>
	);
}

export function FormInputGroup(props: React.ComponentPropsWithRef<"div">) {
	const { children, className, ...restOfProps } = props;
	const LeftItemSlot = getSlotElement(children, FormInputLeftItem);
	const RightItemSlot = getSlotElement(children, FormInputRightItem);

	const otherChildren = getOtherChildren(children, [FormInputLeftItem, FormInputRightItem]);

	return (
		<div
			data-scope="form"
			data-part="input-group"
			className={cnMerge("flex items-center justify-between gap-2", className)}
			{...restOfProps}
		>
			{LeftItemSlot}
			{otherChildren}
			{RightItemSlot}
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
FormInputLeftItem.slot = Symbol.for("leftItem");

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
FormInputRightItem.slot = Symbol.for("rightItem");

type FormInputPrimitiveProps<TFieldValues extends FieldValues = FieldValues> = Omit<
	React.ComponentPropsWithRef<"input">,
	"children"
> & {
	classNames?: { error?: string; eyeIcon?: string; input?: string; inputGroup?: string };
	name?: keyof TFieldValues;
	withEyeIcon?: boolean;
} & (
		| { control: Control<TFieldValues>; formState?: never }
		| { control?: never; formState?: FormState<TFieldValues> }
	);

const inputTypesWithoutFullWith = new Set<React.HTMLInputTypeAttribute>(["checkbox", "radio"]);

export function FormInputPrimitive<TFieldValues extends FieldValues>(
	props: FormInputPrimitiveProps<TFieldValues>
) {
	const contextValues = useLaxFormItemContext();

	const {
		className,
		classNames,
		control,
		formState,
		id = contextValues?.uniqueId,
		name = contextValues?.name,
		type = "text",
		withEyeIcon = true,
		...restOfProps
	} = props;

	const getFormState = (control ? useFormState : () => formState) as typeof useFormState;

	const { errors } = (getFormState({ control }) as UseFormStateReturn<TFieldValues> | undefined) ?? {};

	const [isPasswordVisible, toggleVisibility] = useToggle(false);

	const shouldHaveEyeIcon = withEyeIcon && type === "password";

	const WrapperElement = shouldHaveEyeIcon ? FormInputGroup : ReactFragment;

	const wrapperElementProps = shouldHaveEyeIcon && {
		className: cnMerge("w-full", classNames?.inputGroup, name && errors?.[name] && classNames?.error),
	};

	return (
		<WrapperElement {...wrapperElementProps}>
			<input
				data-scope="form"
				data-part="input"
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
					type !== "password" && name && errors?.[name] && classNames?.error
				)}
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

export function FormInput(
	props: Omit<FormInputPrimitiveProps, "control" | "formState" | "name" | "ref"> & {
		rules?: RegisterOptions;
	}
) {
	const { rules, ...restOfProps } = props;

	const { name } = useStrictFormItemContext();
	const { formState, register } = useFormFieldContext();

	return (
		<FormInputPrimitive
			name={name}
			formState={formState}
			{...(Boolean(name) && register(name, rules))}
			{...restOfProps}
		/>
	);
}

type FormTextAreaPrimitiveProps<TFieldValues extends FieldValues = FieldValues> =
	React.ComponentPropsWithRef<"textarea"> & {
		errorClassName?: string;
		name?: keyof TFieldValues;
	} & (
			| { control: Control<TFieldValues>; formState?: never }
			| { control?: never; formState?: FormState<TFieldValues> }
		);

export function FormTextAreaPrimitive<TFieldValues extends FieldValues>(
	props: FormTextAreaPrimitiveProps<TFieldValues>
) {
	const contextValues = useLaxFormItemContext();

	const {
		className,
		control,
		errorClassName,
		formState,
		id = contextValues?.uniqueId,
		name = contextValues?.name,
		...restOfProps
	} = props;

	const getFormState = (control ? useFormState : () => formState) as typeof useFormState;

	const { errors } = (getFormState({ control }) as UseFormStateReturn<TFieldValues> | undefined) ?? {};

	return (
		<textarea
			data-scope="form"
			data-part="textarea"
			id={id}
			name={name}
			className={cnMerge(
				`w-full bg-transparent text-sm placeholder:text-shadcn-muted-foreground
				focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
				className,
				name && errors?.[name] && errorClassName
			)}
			{...restOfProps}
		/>
	);
}

export function FormTextArea(
	props: Omit<FormTextAreaPrimitiveProps, "control" | "formState" | "id" | "name" | "ref"> & {
		rules?: RegisterOptions;
	}
) {
	const { rules, ...restOfProps } = props;

	const { name } = useStrictFormItemContext();
	const { formState, register } = useFormFieldContext();

	return (
		<FormTextAreaPrimitive
			name={name}
			formState={formState}
			{...(Boolean(name) && register(name, rules))}
			{...restOfProps}
		/>
	);
}

type FormControllerProps<TFieldValues> = Omit<
	ControllerProps<FieldValues, FieldPath<FieldValues>>,
	"control" | "name" | "render"
> & {
	render: (props: {
		field: Omit<ControllerRenderProps, "value"> & { value: TFieldValues };
		fieldState: ControllerFieldState;
		formState: UseFormStateReturn<FieldValues>;
	}) => React.ReactElement;
};

export function FormController<TFieldValues = never>(props: FormControllerProps<TFieldValues>) {
	const { control } = useFormFieldContext();
	const { name } = useStrictFormItemContext();

	return <ControllerPrimitive name={name} control={control} {...props} />;
}

export function FormDescription(props: InferProps<"p">) {
	const { className, ...restOfProps } = props;

	return <p className={cnMerge("text-[12px]", className)} {...restOfProps} />;
}

type ErrorMessageRenderProps = {
	className: string;
	"data-index": number;
	"data-part": string;
	"data-scope": string;
	onAnimationEnd?: React.ReactEventHandler<HTMLElement>;
};

type ErrorMessageRenderState = { errorMessage: string; errorMessageArray: string[]; index: number };

type FormErrorMessagePrimitiveProps<TFieldValues extends FieldValues> = {
	className?: string;
	classNames?: {
		container?: string;
		errorMessage?: string;
		errorMessageAnimation?: string;
	};
	control: Control<TFieldValues>; // == Here for type inference of errorField prop
	render: (context: {
		props: ErrorMessageRenderProps;
		state: ErrorMessageRenderState;
	}) => React.ReactNode;
	withAnimationOnInvalid?: boolean;
} & (
	| {
			errorField: keyof TFieldValues;
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

export const FormErrorMessagePrimitive: FormErrorMessagePrimitiveType = <TFieldValues extends FieldValues>(
	props: FormErrorMessagePrimitiveProps<TFieldValues>
) => {
	const {
		className,
		classNames,
		control,
		errorField,
		render,
		type = "regular",
		withAnimationOnInvalid = true,
	} = props;

	const formState = useFormState({ control });

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

		if (!errorMessageElements) return;

		// == Scroll to first error message
		if (Object.keys(formState.errors).indexOf(errorField as string) === 0) {
			errorMessageElements[0]?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});

			window.scrollBy({ behavior: "smooth", top: -100 });
		}
	}, [errorField, formState.errors]);

	const message = (
		type === "root"
			? formState.errors.root?.[errorField as string]?.message
			: formState.errors[errorField]?.message
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
			onAnimationEnd,
		}) satisfies ErrorMessageRenderProps;

	const getRenderState = ({ errorMessage, index }: { errorMessage: string; index: number }) =>
		({
			errorMessage,
			errorMessageArray,
			index,
		}) satisfies ErrorMessageRenderState;

	return (
		<ErrorMessageList
			ref={wrapperRef}
			each={errorMessageArray}
			className={cnMerge("flex flex-col", classNames?.container)}
			render={(errorMessage, index) => {
				return render({
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
					errorField?: keyof TValues;
					type?: "regular";
				}
			: {
					className?: string;
					control?: Control<TFieldValues>; // == Here for type inference of errorField prop
					errorField?: keyof TFieldValues;
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
	const contextValues = useLaxFormItemContext();

	const { className, errorField = contextValues?.name, type = "regular" } = props;

	const { control } = useFormFieldContext();

	return (
		<FormErrorMessagePrimitive
			control={control}
			errorField={errorField as string}
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
