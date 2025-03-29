import { useCallbackRef } from "@zayne-labs/toolkit-react";
import { useState } from "react";
import { useErrorBoundaryContext } from "./error-boundary-context";

type UseErrorBoundaryState<TError extends Error> =
	| {
			error: null;
			hasError: false;
	  }
	| {
			error: TError;
			hasError: true;
	  };

export const useErrorBoundary = <TError extends Error>() => {
	const { resetErrorBoundary } = useErrorBoundaryContext();

	const [state, setState] = useState<UseErrorBoundaryState<TError>>({
		error: null,
		hasError: false,
	});

	if (state.hasError) {
		throw state.error;
	}

	const resetBoundary = useCallbackRef(() => {
		resetErrorBoundary();

		setState({
			error: null,
			hasError: false,
		});
	});

	const showBoundary = useCallbackRef((error: TError) => {
		setState({
			error,
			hasError: true,
		});
	});

	return { resetBoundary, showBoundary };
};
