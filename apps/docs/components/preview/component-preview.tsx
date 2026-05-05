import { Suspense } from "react";
import { getExampleComponent } from "@/lib/registry";
import { cnMerge } from "@/lib/utils/cn";

export type ComponentPreviewProps = React.ComponentPropsWithoutRef<"div"> & {
	align?: "center" | "end" | "start";
	fullPreview?: boolean;
	name: Parameters<typeof getExampleComponent>[0];
	preventPreviewFocus?: boolean;
	scalePreview?: boolean;
};

export function ComponentPreview(props: ComponentPreviewProps) {
	const { align = "center", className, fullPreview, name, preventPreviewFocus, scalePreview } = props;

	// eslint-disable-next-line react/static-components
	const Component = getExampleComponent(name);

	return (
		<div
			className={cnMerge(
				"relative",
				preventPreviewFocus && "focus-visible:ring-0 focus-visible:outline-hidden"
			)}
			tabIndex={preventPreviewFocus ? -1 : 0}
		>
			<div
				className={cnMerge(
					// eslint-disable-next-line tailwindcss-better/no-unknown-classes
					`not-prose fd-scroll-container flex h-120 w-full flex-col items-center-safe overflow-auto
					p-8`,
					fullPreview && "h-full p-0",
					align === "center" && "justify-center-safe",
					align === "end" && "justify-end",
					align === "start" && "justify-start",
					scalePreview && "sm:p-8",
					className
				)}
			>
				<Suspense fallback={<p className="text-fd-muted-foreground">Loading...</p>}>
					{/* eslint-disable-next-line react/static-components */}
					<Component />
				</Suspense>
			</div>
		</div>
	);
}
