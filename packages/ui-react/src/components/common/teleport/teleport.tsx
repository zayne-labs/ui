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

	const [reactPortal, setReactPortal] = useState<React.ReactPortal | null>(null);

	/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect -- Allow */

	useEffect(() => {
		if (!to) return;

		if (insertPosition) return;

		const destination = isString(to) ? document.querySelector<HTMLElement>(to) : to;

		destination && setReactPortal(createPortal(children, destination));
		// eslint-disable-next-line react-hooks/exhaustive-deps -- children should not be part of the dependency array
	}, [to, insertPosition]);

	useEffect(() => {
		if (!to) return;

		if (!insertPosition) return;

		const destination = isString(to) ? document.querySelector<HTMLElement>(to) : to;

		const tempWrapper = document.createElement("div");
		tempWrapper.style.display = "contents";

		destination?.insertAdjacentElement(insertPosition, tempWrapper);

		setReactPortal(createPortal(children, tempWrapper));

		return () => {
			tempWrapper.remove();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- children should not be part of the dependency array
	}, [to, insertPosition]);

	/* eslint-enable react-hooks-extra/no-direct-set-state-in-use-effect -- Allow */

	return reactPortal;
}

export { Teleport };
