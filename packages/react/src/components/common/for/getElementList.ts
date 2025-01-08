import { ForBase, ForList } from "./for";

type GetElementListResult<TVariant extends "base" | "withWrapper"> = TVariant extends "base"
	? [typeof ForBase]
	: [typeof ForList];

const getElementList = <TVariant extends "base" | "withWrapper" = "withWrapper">(
	variant?: TVariant
): GetElementListResult<TVariant> => {
	switch (variant) {
		case "base": {
			return [ForBase] as never;
		}
		case "withWrapper": {
			return [ForList] as never;
		}
		default: {
			return [ForList] as never;
		}
	}
};

export { getElementList };
