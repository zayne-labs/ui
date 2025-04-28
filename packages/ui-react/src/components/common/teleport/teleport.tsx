"use client";

import * as React from "react";

import { type AnyString, isString } from "@zayne-labs/toolkit-type-helpers";
import { useEffect, useState } from "react";
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

	/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect -- Allow */

	useEffect(() => {
		if (!to) return;

		if (insertPosition) return;

		const destination = isString(to) ? document.querySelector<HTMLElement>(to) : to;

		destination && setPortalContainer(destination);
	}, [to, insertPosition]);

	useEffect(() => {
		if (!to) return;

		if (!insertPosition) return;

		const destination = isString(to) ? document.querySelector<HTMLElement>(to) : to;

		const tempWrapper = document.createElement("div");
		tempWrapper.style.display = "contents";

		destination?.insertAdjacentElement(insertPosition, tempWrapper);

		setPortalContainer(tempWrapper);

		return () => {
			tempWrapper.remove();
		};
	}, [to, insertPosition]);

	/* eslint-enable react-hooks-extra/no-direct-set-state-in-use-effect -- Allow */

	return portalContainer && createPortal(children, portalContainer);
}

export { Teleport };
