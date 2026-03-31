"use client";

import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import { Component } from "react";
import { ErrorBoundaryContext } from "./error-boundary-context";
import type { ErrorBoundaryProps } from "./types";

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

const hasArrayChanged = (arrayOne: unknown[] = [], arrayTwo: unknown[] = []) => {
	return (
		arrayOne.length !== arrayTwo.length
		|| arrayOne.some((item, index) => !Object.is(item, arrayTwo[index]))
	);
};

/**
 * Copied from react-error-boundary package
 * @see https://github.com/bvaughn/react-error-boundary
 */

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);

		this.state = initialState;
	}

	static getDerivedStateFromError(error: Error) {
		return { error, hasError: true };
	}

	override componentDidCatch(error: Error, info: React.ErrorInfo) {
		this.props.onError?.({ error, info });
	}

	override componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
		const { hasError } = this.state;
		const { errorResetKeys } = this.props;

		// == There's an edge case where if the thing that triggered the error happens to *also* be in the resetKeys array, we'd end up resetting the error boundary immediately.
		// == This would likely trigger a second error to be thrown.
		// == So we make sure that we don't check the resetKeys on the first call of cDU after the error is set.

		if (
			hasError
			&& prevState.error !== null
			&& hasArrayChanged(prevProps.errorResetKeys, errorResetKeys)
		) {
			this.props.onErrorReset?.({
				next: errorResetKeys,
				prev: prevProps.errorResetKeys,
				reason: "keys",
			});

			this.setState(initialState);
		}
	}

	override render() {
		const { children, errorFallback } = this.props;
		const { error, hasError } = this.state;

		let childToRender = children;

		if (hasError) {
			switch (true) {
				case isFunction(errorFallback): {
					childToRender = errorFallback({
						error,
						resetErrorBoundary: this.#resetErrorBoundary,
					});
					break;
				}

				case Boolean(errorFallback): {
					childToRender = errorFallback;
					break;
				}

				default: {
					console.warn("No fallback provided to error boundary");
				}
			}

			return (
				<ErrorBoundaryContext
					value={{
						error,
						hasError,
						resetErrorBoundary: this.#resetErrorBoundary,
					}}
				>
					{childToRender}
				</ErrorBoundaryContext>
			);
		}

		return childToRender;
	}

	#resetErrorBoundary = (...parameters: unknown[]) => {
		const { error } = this.state;

		if (error === null) return;

		this.props.onErrorReset?.({
			args: parameters,
			reason: "imperative-api",
		});

		this.setState(initialState);
	};
}
