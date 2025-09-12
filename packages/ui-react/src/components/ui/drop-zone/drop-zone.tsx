"use client";

import { dataAttr, formatBytes } from "@zayne-labs/toolkit-core";
import type { CssWithCustomProperties, PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import { isFunction, isNumber, type SelectorFn } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";
import { useMemo } from "react";
import { Slot } from "@/components/common/slot";
import { cnMerge } from "@/lib/utils/cn";
import {
	DropZoneRootContextProvider,
	type DropZoneRootContextType,
	DropZoneStoreContextProvider,
	FileItemContextProvider,
	type FileItemContextType,
	useDropZoneRootContext,
	useDropZoneStoreContext,
	useFileItemContext,
} from "./drop-zone-context";
import type { DropZoneStore } from "./drop-zone-store";
import {
	FileArchiveIcon,
	FileAudioIcon,
	FileCodeIcon,
	FileCogIcon,
	FileIcon,
	FileTextIcon,
	FileVideoIcon,
} from "./icons";
import type { PartInputProps, UseDropZoneProps } from "./types";
import { useDropZone } from "./use-drop-zone";

type DropZoneRootProps = UseDropZoneProps & { children: React.ReactNode };

export function DropZoneRoot(props: DropZoneRootProps) {
	const { children, ...restOfProps } = props;

	const { disabled, disableInternalStateSubscription, inputRef, propGetters, storeApi } =
		useDropZone(restOfProps);

	const rootContextValue = useMemo<DropZoneRootContextType>(
		() =>
			({
				disabled,
				disableInternalStateSubscription,
				inputRef,
				propGetters,
			}) satisfies DropZoneRootContextType,
		[disableInternalStateSubscription, disabled, inputRef, propGetters]
	);

	return (
		<DropZoneStoreContextProvider store={storeApi}>
			<DropZoneRootContextProvider value={rootContextValue}>{children}</DropZoneRootContextProvider>
		</DropZoneStoreContextProvider>
	);
}

type DropZoneContextProps<TSlice> = {
	children: React.ReactNode | ((props: TSlice) => React.ReactNode);
	selector?: SelectorFn<DropZoneStore, TSlice>;
};

export function DropZoneContext<TSlice = DropZoneStore>(props: DropZoneContextProps<TSlice>) {
	const { children, selector } = props;

	const dropZoneCtx = useDropZoneStoreContext(selector);

	const resolvedChildren = isFunction(children) ? children(dropZoneCtx) : children;

	return resolvedChildren;
}

type DropZoneContainerProps = PartInputProps["container"] & { asChild?: boolean };

export function DropZoneContainer<TElement extends React.ElementType = "div">(
	props: PolymorphicProps<TElement, DropZoneContainerProps>
) {
	const { as: Element = "div", asChild, ...restOfProps } = props;

	const { disableInternalStateSubscription, propGetters } = useDropZoneRootContext();

	const isDraggingOver = useDropZoneStoreContext((store) =>
		disableInternalStateSubscription ? store.isDraggingOver : null
	);

	const Component = asChild ? Slot.Root : Element;

	return (
		<Component
			{...propGetters.getContainerProps({
				...(disableInternalStateSubscription && { "data-drag-over": dataAttr(isDraggingOver) }),
				...restOfProps,
			})}
		/>
	);
}

type DropZoneInputProps = PartInputProps["input"] & { asChild?: boolean };

export function DropZoneInput(props: DropZoneInputProps) {
	const { asChild, ...restOfProps } = props;

	const { disableInternalStateSubscription, propGetters } = useDropZoneRootContext();

	const isDraggingOver = useDropZoneStoreContext((store) =>
		disableInternalStateSubscription ? store.isDraggingOver : null
	);

	const Component = asChild ? Slot.Root : "input";

	return (
		<Component
			{...propGetters.getInputProps({
				...(disableInternalStateSubscription && { "data-drag-over": dataAttr(isDraggingOver) }),
				...restOfProps,
			})}
		/>
	);
}

type DropZoneAreaProps<TSlice> = {
	children: React.ReactNode | ((props: TSlice) => React.ReactNode);
	classNames?: Partial<Record<Extract<keyof PartInputProps, "container" | "input">, string>>;
	extraProps?: Pick<PartInputProps, "container" | "input">;
	selector?: SelectorFn<DropZoneStore, TSlice>;
};

export function DropZoneArea<TSlice = DropZoneStore>(props: DropZoneAreaProps<TSlice>) {
	const { children, classNames, extraProps, selector } = props;

	return (
		<DropZoneContainer {...extraProps?.container} className={classNames?.container}>
			<DropZoneInput {...extraProps?.input} className={classNames?.input} />

			<DropZoneContext selector={selector}>{children}</DropZoneContext>
		</DropZoneContainer>
	);
}

type DropZoneTriggerProps = PartInputProps["trigger"] & { asChild?: boolean };

export function DropZoneTrigger(props: DropZoneTriggerProps) {
	const { asChild, ...restOfProps } = props;

	const { propGetters } = useDropZoneRootContext();

	const Component = asChild ? Slot.Root : "button";

	return <Component {...propGetters.getTriggerProps(restOfProps)} />;
}

type DropZoneFileGroupProps = Omit<PartInputProps["fileGroup"], "children"> & {
	asChild?: boolean;
	children:
		| React.ReactNode
		| ((props: Pick<DropZoneStore, "actions" | "fileStateArray">) => React.ReactNode);
	forceMount?: boolean;
};

export function DropZoneFileGroup<TElement extends React.ElementType = "ul">(
	props: PolymorphicProps<TElement, DropZoneFileGroupProps>
) {
	const { as: Element = "ul", asChild, children, forceMount = false, ...restOfProps } = props;

	const fileStateArray = useDropZoneStoreContext((store) => store.fileStateArray);
	const actions = useDropZoneStoreContext((store) => store.actions);

	const { disableInternalStateSubscription, propGetters } = useDropZoneRootContext();

	const hasFiles = fileStateArray.length > 0;

	const shouldRender = forceMount || hasFiles;

	if (!shouldRender) {
		return null;
	}

	const resolvedChildren = isFunction(children) ? children({ actions, fileStateArray }) : children;

	const Component = asChild ? Slot.Root : Element;

	return (
		<Component
			{...propGetters.getFileGroupProps({
				...(disableInternalStateSubscription && { "data-state": hasFiles ? "active" : "inactive" }),
				...restOfProps,
			})}
		>
			{resolvedChildren}
		</Component>
	);
}

type DropZoneFileItemProps = FileItemContextType & PartInputProps["fileItem"] & { asChild?: boolean };

export function DropZoneFileItem<TElement extends React.ElementType = "li">(
	props: PolymorphicProps<TElement, DropZoneFileItemProps>
) {
	const { as: Element = "li", asChild, fileState, ...restOfProps } = props;

	const { propGetters } = useDropZoneRootContext();

	const Component = asChild ? Slot.Root : Element;

	const contextValue = useMemo<FileItemContextType>(
		() => ({ fileState }) satisfies FileItemContextType,
		[fileState]
	);

	return (
		<FileItemContextProvider value={contextValue}>
			<Component {...propGetters.getFileItemProps(restOfProps)} />
		</FileItemContextProvider>
	);
}

type DropZoneFileItemDeleteProps = PartInputProps["fileItemDelete"] & { asChild?: boolean };

export function DropZoneFileItemDelete(props: DropZoneFileItemDeleteProps) {
	const { asChild, fileStateOrID, ...restOfProps } = props;

	const { propGetters } = useDropZoneRootContext();

	const fileItemContextValue = useFileItemContext();

	const Component = asChild ? Slot.Root : "button";

	const resolvedFileStateOrID = fileStateOrID ?? fileItemContextValue?.fileState;

	return (
		<Component
			{...propGetters.getFileItemDeleteProps({ fileStateOrID: resolvedFileStateOrID, ...restOfProps })}
		/>
	);
}

type DropZoneFileItemProgressProps = PartInputProps["fileItemProgress"] & {
	asChild?: boolean;
	forceMount?: boolean;
	size?: number;
};

export function DropZoneFileItemProgress<TElement extends React.ElementType = "span">(
	props: PolymorphicProps<TElement, DropZoneFileItemProgressProps>
) {
	const {
		as: Element = "span",
		asChild,
		forceMount = false,
		size = 40,
		variant = "linear",
		...restOfProps
	} = props;

	const fileItemContextValue = useFileItemContext();

	const fileState = fileItemContextValue?.fileState;

	const { propGetters } = useDropZoneRootContext();

	if (!fileState) {
		return null;
	}

	const currentProgress = fileState.progress;

	const shouldRender = forceMount || fileState.progress !== 100;

	if (!shouldRender) {
		return null;
	}

	const Component = asChild ? Slot.Root : Element;

	const componentProps = propGetters.getFileItemProgressProps({ variant, ...restOfProps });

	switch (variant) {
		case "circular": {
			const circumference = 2 * Math.PI * ((size - 4) / 2);
			const strokeDashoffset = circumference - (currentProgress / 100) * circumference;

			return (
				<Component {...componentProps}>
					<svg
						className="-rotate-90"
						width={size}
						height={size}
						viewBox={`0 0 ${size} ${size}`}
						fill="none"
						stroke="currentColor"
					>
						<circle
							className="text-zu-primary/20"
							strokeWidth="2"
							cx={size / 2}
							cy={size / 2}
							r={(size - 4) / 2}
						/>
						<circle
							className="text-zu-primary transition-[stroke-dashoffset] duration-300 ease-linear"
							strokeWidth="2"
							strokeLinecap="round"
							strokeDasharray={circumference}
							strokeDashoffset={strokeDashoffset}
							cx={size / 2}
							cy={size / 2}
							r={(size - 4) / 2}
						/>
					</svg>
				</Component>
			);
		}

		case "fill": {
			const topInset = 100 - currentProgress;

			return (
				<Component
					{...componentProps}
					style={
						{
							"--clip-path": `inset(${topInset}% 0% 0% 0%)`,
						} satisfies CssWithCustomProperties as CssWithCustomProperties
					}
				/>
			);
		}

		case "linear": {
			return (
				<Component {...componentProps}>
					<span
						className="inline-block size-full grow translate-x-(--translate-distance) bg-zu-primary transition-transform duration-300 ease-linear"
						style={
							{
								"--translate-distance": `-${100 - currentProgress}%`,
							} satisfies CssWithCustomProperties as CssWithCustomProperties
						}
					/>
				</Component>
			);
		}

		default: {
			variant satisfies never;
			return null;
		}
	}
}

type RenderPreviewDetails = { className?: string; node?: React.ReactNode };

type RenderPreviewProp = (props: Pick<FileItemContextType, "fileState">) => {
	archive?: RenderPreviewDetails;
	audio?: RenderPreviewDetails;
	code?: RenderPreviewDetails;
	default?: RenderPreviewDetails;
	executable?: RenderPreviewDetails;
	image?: RenderPreviewDetails;
	text?: RenderPreviewDetails;
	video?: RenderPreviewDetails;
};

type DropZoneFileItemPreviewProps = Omit<PartInputProps["fileItemPreview"], "children">
	& Partial<Pick<FileItemContextType, "fileState">> & {
		asChild?: boolean;
		children?: React.ReactNode | ((props: Pick<FileItemContextType, "fileState">) => React.ReactNode);
		renderPreview?: boolean | RenderPreviewProp;
	};

export function DropZoneFileItemPreview<TElement extends React.ElementType = "span">(
	props: PolymorphicProps<TElement, DropZoneFileItemPreviewProps>
) {
	const {
		as: Element = "span",
		asChild,
		children,
		fileState: fileStateProp,
		renderPreview = true,
		...restOfProps
	} = props;

	const fileItemContextValue = useFileItemContext();

	const { propGetters } = useDropZoneRootContext();

	const fileState = fileStateProp ?? fileItemContextValue?.fileState;

	if (!fileState) {
		return null;
	}

	const Component = asChild ? Slot.Root : Element;

	const resolvedChildren = isFunction(children) ? children({ fileState }) : children;

	return (
		<Component {...propGetters.getFileItemPreviewProps(restOfProps)}>
			{renderPreview && getFilePreviewOrIcon({ fileState, renderPreview })}
			{resolvedChildren}
		</Component>
	);
}

const getFilePreviewOrIcon = (
	context: Pick<DropZoneFileItemPreviewProps, "fileState" | "renderPreview">
) => {
	const { fileState, renderPreview } = context;

	const type = fileState?.file.type;
	const extension = fileState?.file.name?.split(".").pop()?.toLowerCase() ?? "";

	const renderPreviewObject = isFunction(renderPreview) ? renderPreview({ fileState }) : {};

	const getDefaultPreview = () => {
		return (
			renderPreviewObject.default?.node ?? (
				<FileIcon className={renderPreviewObject.default?.className} />
			)
		);
	};

	if (!type) {
		return getDefaultPreview();
	}

	switch (true) {
		case type.startsWith("image/"): {
			return (
				renderPreviewObject.image?.node ?? (
					<img
						src={fileState.preview}
						alt={fileState.file.name}
						className={cnMerge("size-full object-cover", renderPreviewObject.image?.className)}
					/>
				)
			);
		}

		case type.startsWith("video/"): {
			return (
				renderPreviewObject.video?.node ?? (
					<FileVideoIcon
						className={cnMerge("size-full object-cover", renderPreviewObject.video?.className)}
					/>
				)
			);
		}

		case type.startsWith("audio/"): {
			return (
				renderPreviewObject.audio?.node ?? (
					<FileAudioIcon
						className={cnMerge("size-full object-cover", renderPreviewObject.audio?.className)}
					/>
				)
			);
		}

		case type.startsWith("text/") || ["md", "pdf", "rtf", "txt"].includes(extension): {
			return (
				renderPreviewObject.text?.node ?? (
					<FileTextIcon className={renderPreviewObject.text?.className} />
				)
			);
		}

		case [
			"c",
			"cpp",
			"cs",
			"css",
			"html",
			"java",
			"js",
			"json",
			"jsx",
			"php",
			"py",
			"rb",
			"ts",
			"tsx",
			"xml",
		].includes(extension): {
			return (
				renderPreviewObject.code?.node ?? (
					<FileCodeIcon className={renderPreviewObject.code?.className} />
				)
			);
		}

		case ["7z", "bz2", "gz", "rar", "tar", "zip"].includes(extension): {
			return (
				renderPreviewObject.archive?.node ?? (
					<FileArchiveIcon className={renderPreviewObject.archive?.className} />
				)
			);
		}

		case ["apk", "app", "deb", "exe", "msi", "rpm"].includes(extension): {
			return (
				renderPreviewObject.executable?.node ?? (
					<FileCogIcon className={renderPreviewObject.executable?.className} />
				)
			);
		}

		default: {
			return getDefaultPreview();
		}
	}
};

type DropZoneFileItemMetadataProps = Omit<PartInputProps["fileItemMetadata"], "children">
	& Partial<Pick<FileItemContextType, "fileState">> & {
		asChild?: boolean;
		children?: React.ReactNode | ((props: Pick<FileItemContextType, "fileState">) => React.ReactNode);
		classNames?: {
			name?: string;
			size?: string;
		};
		size?: "default" | "sm";
	};

export function DropZoneFileItemMetadata(props: DropZoneFileItemMetadataProps) {
	const {
		asChild,
		children,
		classNames,
		fileState: fileStateProp,
		size = "default",
		...restOfProps
	} = props;

	const fileItemContextValue = useFileItemContext();

	const { propGetters } = useDropZoneRootContext();

	const fileState = fileStateProp ?? fileItemContextValue?.fileState;

	if (!fileState) {
		return null;
	}

	const Component = asChild ? Slot.Root : "div";

	const resolvedChildren = isFunction(children) ? children({ fileState }) : children;

	const getDefaultMetadataChildren = () => {
		return (
			<>
				<p
					className={cnMerge(
						"truncate",
						size === "default" && "text-[14px] font-medium",
						size === "sm" && "text-[13px] leading-snug",
						classNames?.name
					)}
				>
					{fileState.file.name}
				</p>
				<p
					className={cnMerge(
						"truncate text-zu-muted-foreground",
						size === "default" && "text-[12px]",
						size === "sm" && "text-[11px] leading-snug",
						classNames?.size
					)}
				>
					{isNumber(fileState.file.size) && formatBytes(fileState.file.size)}
				</p>
				{fileState.error && (
					<p className="text-[12px] text-zu-destructive">{fileState.error.message}</p>
				)}
			</>
		);
	};

	return (
		<Component {...propGetters.getFileItemMetadataProps(restOfProps)}>
			{resolvedChildren ?? getDefaultMetadataChildren()}
		</Component>
	);
}

type DropZoneFileClearProps = PartInputProps["fileItemClear"] & {
	asChild?: boolean;
	forceMount?: boolean;
};

export function DropZoneFileClear(props: DropZoneFileClearProps) {
	const { asChild, forceMount = false, ...restOfProps } = props;

	const { propGetters } = useDropZoneRootContext();

	const fileCount = useDropZoneStoreContext((state) => state.fileStateArray.length);

	const shouldRender = forceMount || fileCount > 0;

	if (!shouldRender) {
		return null;
	}

	const Component = asChild ? Slot.Root : "button";

	return <Component {...propGetters.getFileItemClearProps(restOfProps)} />;
}

type DropZoneErrorGroupProps = {
	children: React.ReactNode | ((props: Pick<DropZoneStore, "actions" | "errors">) => React.ReactNode);
	forceMount?: boolean;
};

export function DropZoneErrorGroup(props: DropZoneErrorGroupProps) {
	const { children, forceMount = false } = props;

	const errors = useDropZoneStoreContext((store) => store.errors);
	const actions = useDropZoneStoreContext((store) => store.actions);

	const hasErrors = errors.length > 0;

	const shouldRender = forceMount || hasErrors;

	if (!shouldRender) {
		return null;
	}

	const resolvedChildren = isFunction(children) ? children({ actions, errors }) : children;

	return resolvedChildren;
}
