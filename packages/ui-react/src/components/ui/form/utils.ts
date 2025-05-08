import { isObject, isString } from "@zayne-labs/toolkit-type-helpers";
import type { FieldErrors, FieldValues } from "react-hook-form";
import type { FormErrorMessagePrimitiveProps } from "./form";

export const getFormErrorMessage = (options: {
	errorField: FormErrorMessagePrimitiveProps<FieldValues>["errorField"] | undefined;
	errors: FieldErrors | undefined;
	type: FormErrorMessagePrimitiveProps<FieldValues>["type"];
}): string | string[] | null | undefined => {
	const { errorField, errors, type } = options;

	if (!errorField || !errors || Object.keys(errors).length === 0) return;

	if (type === "root") {
		return errors.root?.[errorField]?.message;
	}

	// Handle nested paths like 'notifications.0'
	const pathParts = errorField.includes(".") ? errorField.split(".") : null;

	// If there are no path parts, return the error message
	if (!pathParts) {
		const errorMessage = errors[errorField]?.message;

		return isString(errorMessage) ? errorMessage : null;
	}

	let extractedError = errors;

	for (const part of pathParts) {
		const currentError = extractedError[part];

		if (!isObject(currentError)) break;

		extractedError = currentError as never;
	}

	const errorMessage = isString(extractedError.message) ? extractedError.message : null;

	return errorMessage;
};
