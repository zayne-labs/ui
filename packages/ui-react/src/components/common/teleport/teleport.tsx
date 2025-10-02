"use client";

import { type AnyString, isString } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";
import { useEffectEvent, useInsertionEffect, useState } from "react";
import { createPortal } from "react-dom";

type ValidHtmlTags = keyof HTMLElementTagNameMap;

type PortalProps = {
	children: React.ReactNode;
	insertPosition?: InsertPosition;
	to: AnyString | HTMLElement | ValidHtmlTags | null;
};

function Teleport(props: PortalProps) {
	const { children, insertPosition, to } = props;

	const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

	const updatePortalContainer = useEffectEvent((destination: HTMLElement | null) => {
		setPortalContainer(destination);
	});

	useInsertionEffect(() => {
		if (!to) return;

		if (insertPosition) return;

		const destination = isString(to) ? document.querySelector<HTMLElement>(to) : to;

		destination && updatePortalContainer(destination);
	}, [to, insertPosition]);

	useInsertionEffect(() => {
		if (!to) return;

		if (!insertPosition) return;

		const destination = isString(to) ? document.querySelector<HTMLElement>(to) : to;

		const tempWrapper = document.createElement("div");
		tempWrapper.style.display = "contents";

		destination?.insertAdjacentElement(insertPosition, tempWrapper);

		updatePortalContainer(tempWrapper);

		return () => {
			tempWrapper.remove();
		};
	}, [to, insertPosition]);

	return portalContainer && createPortal(children, portalContainer);
}

export { Teleport };
