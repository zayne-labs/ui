"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cnMerge } from "@/lib/utils/cn";

export function CodeCollapsibleWrapper(props: { children: React.ReactNode; className?: string }) {
	const { children, className } = props;
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div
			data-state={isOpen ? "open" : "closed"}
			className={cnMerge("relative overflow-hidden data-[state=closed]:max-h-64", className)}
		>
			{children}

			{!isOpen && (
				<div
					className="absolute inset-x-0 bottom-0 flex h-16 items-center justify-center bg-linear-to-t
						from-fd-background to-transparent"
				>
					<Button theme="secondary" onClick={() => setIsOpen(true)}>
						Expand
					</Button>
				</div>
			)}
		</div>
	);
}
