import { For, ForWithWrapper } from "./for";

type GetElementListResult<TVariant extends "base" | "withWrapper"> = TVariant extends "base"
	? [typeof For]
	: [typeof ForWithWrapper];

const getElementList = <TVariant extends "base" | "withWrapper" = "withWrapper">(
	variant?: TVariant
): GetElementListResult<TVariant> => {
	switch (variant) {
		case "base": {
			return [For] as never;
		}
		case "withWrapper": {
			return [ForWithWrapper] as never;
		}
		default: {
			return [ForWithWrapper] as never;
		}
	}
};

export { getElementList };
