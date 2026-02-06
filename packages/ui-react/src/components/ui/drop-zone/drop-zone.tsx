"use client";

import { dataAttr, formatBytes } from "@zayne-labs/toolkit-core";
import { useCompareSelector } from "@zayne-labs/toolkit-react";
import type {
	CssWithCustomProperties,
	InferProps,
	PolymorphicPropsStrict,
} from "@zayne-labs/toolkit-react/utils";
import {
	isBoolean,
	isFunction,
	isNumber,
	type AnyFunction,
	type SelectorFn,
	type UnionDiscriminator,
} from "@zayne-labs/toolkit-type-helpers";
import { useMemo } from "react";
import { For } from "@/components/common/for";
import { Presence } from "@/components/common/presence";
import { Slot } from "@/components/common/slot";
import { cnMerge } from "@/lib/utils/cn";
import {
	DropZoneRootContextProvider,
	DropZoneStoreContextProvider,
	FileItemContextProvider,
	useDropZoneRootContext,
	useDropZoneStoreContext,
	useFileItemContext,
	type DropZoneRootContextType,
	type FileItemContextType,
} from "./drop-zone-context";
import {
	FileArchiveIcon,
	FileAudioIcon,
	FileCodeIcon,
	FileCogIcon,
	FileIcon,
	FileTextIcon,
	FileVideoIcon,
} from "./icons";
import type { DropZoneStore, PartInputProps, UseDropZoneProps } from "./types";
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
	children: React.ReactNode | ((context: TSlice) => React.ReactNode);
	selector?: SelectorFn<DropZoneStore, TSlice>;
};

export function DropZoneContext<TSlice = DropZoneStore>(props: DropZoneContextProps<TSlice>) {
	const { children, selector } = props;

	const dropZoneCtx = useDropZoneStoreContext(useCompareSelector(selector));

	const resolvedChildren = isFunction(children) ? children(dropZoneCtx) : children;

	return resolvedChildren;
}

type DropZoneContainerProps = PartInputProps["container"] & { asChild?: boolean };

export function DropZoneContainer<TElement extends React.ElementType = "div">(
	props: PolymorphicPropsStrict<TElement, DropZoneContainerProps>
) {
	const { as: Element = "div", asChild, ...restOfProps } = props;

	const { disableInternalStateSubscription, propGetters } = useDropZoneRootContext();

	const isDraggingOver = useDropZoneStoreContext((store) =>
		disableInternalStateSubscription ? store.isDraggingOver : null
	);

	const isInvalid = useDropZoneStoreContext((store) =>
		disableInternalStateSubscription ? store.isInvalid : null
	);

	const Component = asChild ? Slot.Root : Element;

	return (
		<Component
			{...propGetters.getContainerProps({
				...(disableInternalStateSubscription && {
					"data-drag-over": dataAttr(isDraggingOver),
					"data-invalid": dataAttr(isInvalid),
				}),
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

type DropZoneAreaProps<TSlice> = DropZoneContextProps<TSlice>
	& PartInputProps["container"] & {
		classNames?: Partial<Record<Extract<keyof PartInputProps, "container" | "input">, string>>;
		extraProps?: Partial<Pick<PartInputProps, "container" | "input">>;
	};

export function DropZoneArea<TSlice = DropZoneStore>(props: DropZoneAreaProps<TSlice>) {
	const { children, className, classNames, extraProps, selector, ...restOfProps } = props;

	return (
		<DropZoneContainer
			{...extraProps?.container}
			{...restOfProps}
			className={cnMerge(extraProps?.container?.className, className, classNames?.container)}
		>
			<DropZoneInput
				{...extraProps?.input}
				className={cnMerge(extraProps?.input?.className, classNames?.input)}
			/>

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

type ListPerItemContext = Pick<DropZoneStore, "actions"> & {
	array: DropZoneStore["fileStateArray"];
	fileState: DropZoneStore["fileStateArray"][number];
	index: number;
};

type FileListPerItemVariant = {
	children: React.ReactNode | ((context: ListPerItemContext) => React.ReactNode);
	renderMode?: "per-item";
};

type ListManualListContext = Pick<DropZoneStore, "actions" | "fileStateArray">;

type FileListManualListVariant = {
	children: React.ReactNode | ((context: ListManualListContext) => React.ReactNode);
	renderMode: "manual-list";
};

type DropZoneFileListProps = Omit<PartInputProps["fileList"], "children"> & {
	asChild?: boolean;
	forceMount?: boolean;
} & (FileListManualListVariant | FileListPerItemVariant);

export function DropZoneFileList<TElement extends React.ElementType = "ul">(
	props: PolymorphicPropsStrict<TElement, DropZoneFileListProps>
) {
	const {
		as: Element = "ul",
		asChild,
		children,
		forceMount = false,
		renderMode = "per-item",
		...restOfProps
	} = props;

	const fileStateArray = useDropZoneStoreContext((store) => store.fileStateArray);
	const actions = useDropZoneStoreContext((store) => store.actions);

	const { disableInternalStateSubscription, propGetters } = useDropZoneRootContext();

	const childrenMap = {
		"manual-list": () => {
			const childrenFn = children as Extract<FileListManualListVariant["children"], AnyFunction>;
			return childrenFn({ actions, fileStateArray });
		},
		"per-item": () => {
			const childrenFn = children as Extract<FileListPerItemVariant["children"], AnyFunction>;

			return (
				<For
					each={fileStateArray}
					renderItem={(fileState, index, array) => childrenFn({ actions, array, fileState, index })}
				/>
			);
		},
	} satisfies Record<typeof renderMode, () => React.ReactNode>;

	const hasFiles = fileStateArray.length > 0;

	const Component = asChild ? Slot.Root : Element;

	return (
		<Presence present={hasFiles} forceMount={forceMount}>
			<Component
				{...propGetters.getFileListProps({
					...(disableInternalStateSubscription && { "data-state": hasFiles ? "active" : "inactive" }),
					...restOfProps,
				})}
			>
				{isFunction(children) ? childrenMap[renderMode]() : children}
			</Component>
		</Presence>
	);
}

type DropZoneFileItemProps = FileItemContextType & PartInputProps["fileItem"] & { asChild?: boolean };

export function DropZoneFileItem<TElement extends React.ElementType = "li">(
	props: PolymorphicPropsStrict<TElement, DropZoneFileItemProps>
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
	props: PolymorphicPropsStrict<TElement, DropZoneFileItemProgressProps>
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

type NodeCtx<TElement extends React.ElementType> = {
	getProps: (innerProps: Partial<InferProps<TElement>>) => InferProps<TElement>;
};

type RenderPreviewDetails<TElement extends React.ElementType = "svg"> = UnionDiscriminator<
	[
		{ props: InferProps<TElement> },
		{ node: React.ReactNode | ((ctx: NodeCtx<TElement>) => React.ReactNode) },
	]
>;

type RenderPropContext = Pick<FileItemContextType, "fileState"> & {
	fileExtension: string;
	fileType: string;
};

type RenderPreviewObject = {
	archive?: RenderPreviewDetails;
	audio?: RenderPreviewDetails;
	code?: RenderPreviewDetails;
	default?: RenderPreviewDetails;
	executable?: RenderPreviewDetails;
	image?: RenderPreviewDetails<"img">;
	text?: RenderPreviewDetails;
	video?: RenderPreviewDetails;
};
type RenderPreviewFn = (context: RenderPropContext) => RenderPreviewObject;

type RenderPreview = RenderPreviewFn | RenderPreviewObject;

type DropZoneFileItemPreviewProps = Omit<PartInputProps["fileItemPreview"], "children">
	& Partial<Pick<FileItemContextType, "fileState">> & {
		asChild?: boolean;
		children?:
			| React.ReactNode
			| ((context: RenderPropContext & { fallbackPreview: () => React.ReactNode }) => React.ReactNode);
		renderPreview?: boolean | RenderPreview;
	};

export function DropZoneFileItemPreview<TElement extends React.ElementType>(
	props: PolymorphicPropsStrict<TElement, DropZoneFileItemPreviewProps>
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

	const fileType = fileState.file.type ?? "";

	const fileExtension = fileState.file.name?.split(".").pop()?.toLowerCase() ?? "";

	const Component = asChild ? Slot.Root : Element;

	const fallbackPreview = () =>
		getFilePreviewOrIcon({ fileExtension, fileState, fileType, renderPreview });

	const resolvedChildren =
		isFunction(children) ? children({ fallbackPreview, fileExtension, fileState, fileType }) : children;

	return (
		<Component {...propGetters.getFileItemPreviewProps(restOfProps)}>
			{renderPreview && fallbackPreview()}
			{resolvedChildren}
		</Component>
	);
}

const resolvePreviewNode = <
	TPreviewDetail extends NonNullable<RenderPreviewObject[keyof RenderPreviewObject]>,
	TNodeFn extends Extract<TPreviewDetail["node"], AnyFunction>,
>(
	details: TPreviewDetail | undefined,
	getProps: Parameters<TNodeFn>[0]["getProps"] = ((props: unknown) => props) as never
) => {
	const resolvedNode =
		isFunction(details?.node) ? details.node({ getProps: getProps as never }) : details?.node;

	return resolvedNode;
};

const getFilePreviewOrIcon = (
	context: Pick<Required<DropZoneFileItemPreviewProps>, "renderPreview"> & Required<RenderPropContext>
): React.ReactNode => {
	const { fileExtension, fileState, fileType, renderPreview } = context;

	const renderPreviewValue = isBoolean(renderPreview) ? {} : renderPreview;

	const resolvedRenderPreviewObject =
		isFunction(renderPreviewValue) ?
			renderPreviewValue({ fileExtension, fileState, fileType })
		:	renderPreviewValue;

	switch (true) {
		case fileType.startsWith("image/"): {
			const resolvedNode = resolvePreviewNode(resolvedRenderPreviewObject.image, (innerProps) => ({
				...innerProps,
				alt: innerProps.alt ?? fileState.file.name ?? "",
				className: cnMerge("size-full object-cover", innerProps.className),
				src: innerProps.src ?? fileState.preview,
			}));

			return (
				resolvedNode ?? (
					<img
						{...resolvedRenderPreviewObject.image?.props}
						src={fileState.preview}
						alt={fileState.file.name ?? ""}
						className={cnMerge(
							"size-full object-cover",
							resolvedRenderPreviewObject.image?.props?.className
						)}
					/>
				)
			);
		}

		case fileType.startsWith("video/"): {
			const resolvedNode = resolvePreviewNode(resolvedRenderPreviewObject.video, (innerProps) => ({
				...innerProps,
				className: cnMerge("size-full object-cover", innerProps.className),
			}));

			return (
				resolvedNode ?? (
					<FileVideoIcon
						{...resolvedRenderPreviewObject.video?.props}
						className={cnMerge(
							"size-full object-cover",
							resolvedRenderPreviewObject.video?.props?.className
						)}
					/>
				)
			);
		}

		case fileType.startsWith("audio/"): {
			const resolvedNode = resolvePreviewNode(resolvedRenderPreviewObject.audio, (innerProps) => ({
				...innerProps,
				className: cnMerge("size-full object-cover", innerProps.className),
			}));

			return (
				resolvedNode ?? (
					<FileAudioIcon
						{...resolvedRenderPreviewObject.audio?.props}
						className={cnMerge(
							"size-full object-cover",
							resolvedRenderPreviewObject.audio?.props?.className
						)}
					/>
				)
			);
		}

		case fileType.startsWith("text/") || ["md", "pdf", "rtf", "txt"].includes(fileExtension): {
			const resolvedNode = resolvePreviewNode(resolvedRenderPreviewObject.text);

			return resolvedNode ?? <FileTextIcon {...resolvedRenderPreviewObject.text?.props} />;
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
		].includes(fileExtension): {
			const resolvedNode = resolvePreviewNode(resolvedRenderPreviewObject.code);

			return resolvedNode ?? <FileCodeIcon {...resolvedRenderPreviewObject.code?.props} />;
		}

		case ["7z", "bz2", "gz", "rar", "tar", "zip"].includes(fileExtension): {
			const resolvedNode = resolvePreviewNode(resolvedRenderPreviewObject.archive);

			return resolvedNode ?? <FileArchiveIcon {...resolvedRenderPreviewObject.archive?.props} />;
		}

		case ["apk", "app", "deb", "exe", "msi", "rpm"].includes(fileExtension): {
			const resolvedNode = resolvePreviewNode(resolvedRenderPreviewObject.executable);

			return resolvedNode ?? <FileCogIcon {...resolvedRenderPreviewObject.executable?.props} />;
		}

		default: {
			const resolvedNode = resolvePreviewNode(resolvedRenderPreviewObject.default);

			return resolvedNode ?? <FileIcon {...resolvedRenderPreviewObject.default?.props} />;
		}
	}
};

type DropZoneFileItemMetadataProps = Omit<PartInputProps["fileItemMetadata"], "children">
	& Partial<Pick<FileItemContextType, "fileState">> & {
		asChild?: boolean;
		children?: React.ReactNode | ((context: Pick<FileItemContextType, "fileState">) => React.ReactNode);
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
