// FIXME - To be replaced with `WatchProps` from react-hook-form once they update their types

import type {
	Control,
	DeepPartialSkipArrayKey,
	FieldPath,
	FieldPathValue,
	FieldPathValues,
	FieldValues,
} from "react-hook-form";

type WatchDefaultValue<TFieldName, TFieldValues extends FieldValues = FieldValues> =
	TFieldName extends FieldPath<TFieldValues> ? FieldPathValue<TFieldValues, TFieldName>
	:	DeepPartialSkipArrayKey<TFieldValues>;

type WatchValue<TFieldName, TFieldValues extends FieldValues = FieldValues> =
	TFieldName extends Array<FieldPath<TFieldValues>> | ReadonlyArray<FieldPath<TFieldValues>> ?
		FieldPathValues<TFieldValues, TFieldName>
	: TFieldName extends FieldPath<TFieldValues> ? FieldPathValue<TFieldValues, TFieldName>
	: TFieldValues;

type WatchRenderValue<TFieldName, TFieldValues extends FieldValues, TComputeValue> =
	TComputeValue extends undefined ? WatchValue<TFieldName, TFieldValues> : TComputeValue;

export type WatchProps<
	TFieldName extends
		| Array<FieldPath<TFieldValues>>
		| FieldPath<TFieldValues>
		| ReadonlyArray<FieldPath<TFieldValues>>
		| undefined = undefined,
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues = TFieldValues,
	TComputeValue = undefined,
> = {
	compute?: (value: WatchValue<TFieldName, TFieldValues>) => TComputeValue;
	control?: Control<TFieldValues, TContext, TTransformedValues>;
	defaultValue?: WatchDefaultValue<TFieldName, TFieldValues>;
	disabled?: boolean;
	exact?: boolean;
	name?: TFieldName;
	render: (value: WatchRenderValue<TFieldName, TFieldValues, TComputeValue>) => React.ReactNode;
};
