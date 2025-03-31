import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";
import { Component } from "react";
import { ErrorBoundaryContextProvider } from "./error-boundary-context";
import type { ErrorBoundaryProps, FallbackProps } from "./types";

type ErrorBoundaryState =
	| {
			error: Error;
			hasError: true;
	  }
	| {
			error: null;
			hasError: false;
	  };

const initialState: ErrorBoundaryState = {
	error: null,
	hasError: false,
};

const hasArrayChanged = (a: unknown[] = [], b: unknown[] = []) => {
	return a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
};

/**
 * Copied from react-error-boundary package
 * @see https://github.com/bvaughn/react-error-boundary
 */

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);

		this.state = initialState;
	}

	static getDerivedStateFromError(error: Error) {
		return { error, hasError: true };
	}

	override componentDidCatch(error: Error, info: React.ErrorInfo) {
		this.props.onError?.(error, info);
	}

	override componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
		const { hasError } = this.state;
		const { resetKeys } = this.props;

		// There's an edge case where if the thing that triggered the error happens to *also* be in the resetKeys array, we'd end up resetting the error boundary immediately.
		// This would likely trigger a second error to be thrown.
		// So we make sure that we don't check the resetKeys on the first call of cDU after the error is set.

		if (hasError && prevState.error !== null && hasArrayChanged(prevProps.resetKeys, resetKeys)) {
			this.props.onReset?.({ next: resetKeys, prev: prevProps.resetKeys, reason: "keys" });

			this.setState(initialState);
		}
	}

	override render() {
		const { children, fallback } = this.props;
		const { error, hasError } = this.state;

		let childToRender = children;

		if (hasError) {
			switch (true) {
				case isFunction(fallback): {
					const props: FallbackProps = { error, resetErrorBoundary: this.#resetErrorBoundary };

					childToRender = fallback(props);
					break;
				}

				case fallback !== undefined: {
					childToRender = fallback;
					break;
				}

				default: {
					console.error("error-boundary requires a fallback prop");
					throw error;
				}
			}
		}

		return (
			<ErrorBoundaryContextProvider
				value={{ error, hasError, resetErrorBoundary: this.#resetErrorBoundary }}
			>
				{childToRender}
			</ErrorBoundaryContextProvider>
		);
	}

	#resetErrorBoundary = (...parameters: unknown[]) => {
		const { error } = this.state;

		if (error !== null) {
			this.props.onReset?.({ parameters, reason: "imperative-api" });

			this.setState(initialState);
		}
	};
}

export { ErrorBoundary };
