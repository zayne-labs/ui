import { isObject } from "@zayne-labs/toolkit-type-helpers";
import { createElement } from "react";
import type { FieldErrors, FieldValues } from "react-hook-form";
import { cnMerge } from "@/lib/utils/cn";
import type { FormErrorMessagePrimitiveProps, FormInputProps } from "./form";
import type { FormRootContext, RenderIconProps } from "./form-context";
import { EyeIconClosed, EyeIconOpen } from "./icons";

export const getFieldErrorMessage = (options: {
	errors: FieldErrors | undefined;
	fieldName: string | undefined;
	type: FormErrorMessagePrimitiveProps<FieldValues>["type"];
}): string | string[] | null | undefined => {
	const { errors, fieldName, type } = options;

	if (fieldName === undefined || !errors || Object.keys(errors).length === 0) return;

	if (type === "root") {
		return errors.root?.[fieldName]?.message;
	}

	// == Handle nested paths like `notifications.0`
	const pathParts = fieldName.includes(".") ? fieldName.split(".") : null;

	// == If there are no path parts, return the error message
	if (!pathParts) {
		const errorMessage = errors[fieldName]?.message;

		return errorMessage as string | string[];
	}

	let extractedError = errors;

	for (const part of pathParts) {
		const currentError = extractedError[part];

		if (!isObject(currentError)) break;

		extractedError = currentError as never;
	}

	const errorMessage = extractedError.message as unknown as string | string[];

	return errorMessage;
};

export const getEyeIcon = (options: {
	classNames: FormInputProps["classNames"];
	iconType: "closed" | "open";
	renderIconProps: RenderIconProps;
	withEyeIcon: FormRootContext["withEyeIcon"];
}) => {
	const { classNames, iconType, renderIconProps, withEyeIcon } = options;

	if (!withEyeIcon) {
		return null;
	}

	if (withEyeIcon === true) {
		const defaultIconMap = {
			closed: createElement(EyeIconClosed, {
				className: cnMerge("size-full", classNames?.eyeIcon),
			}),

			open: createElement(EyeIconOpen, {
				className: cnMerge("size-full", classNames?.eyeIcon),
			}),
		};

		return defaultIconMap[iconType];
	}

	if (withEyeIcon.renderIcon) {
		return withEyeIcon.renderIcon(renderIconProps);
	}

	if (withEyeIcon[iconType]) {
		return withEyeIcon[iconType];
	}

	return null;
};
