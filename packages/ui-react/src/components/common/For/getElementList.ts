import * as For from "./For";

type GetElementListResult<TVariant extends "base" | "withWrapper"> = TVariant extends "base"
	? [typeof For.Base]
	: [typeof For.List];

const getElementList = <TVariant extends "base" | "withWrapper" = "withWrapper">(
	variant?: TVariant
): GetElementListResult<TVariant> => {
	switch (variant) {
		case "base": {
			return [For.Base] as never;
		}
		case "withWrapper": {
			return [For.List] as never;
		}
		default: {
			return [For.List] as never;
		}
	}
};

export { getElementList };
