import * as React from "react";

import { type UseDropZoneProps, type UseDropZoneResult, useDropZone } from "./use-drop-zone";

export function DropZone(props: UseDropZoneProps) {
	const api = useDropZone(props);

	return (
		<div {...api.getRootProps()}>
			<input {...api.getInputProps()} />

			{api.getChildren()}
		</div>
	);
}

export function DropZonePrimitive(
	props: UseDropZoneProps<Pick<UseDropZoneResult, "getInputProps" | "getRootProps">>
) {
	const api = useDropZone(props);

	return api.getChildren({
		getInputProps: api.getInputProps,
		getRootProps: api.getRootProps,
	});
}
