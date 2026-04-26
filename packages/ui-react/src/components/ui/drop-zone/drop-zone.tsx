"use client";

import { dataAttr, formatBytes, omitKeys } from "@zayne-labs/toolkit-core";
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
	type UnionToIntersection,
	type UnionToTuple,
} from "@zayne-labs/toolkit-type-helpers";
import { useMemo } from "react";
import { For } from "@/components/common/for";
import { Presence } from "@/components/common/presence";
import { Slot } from "@/components/common/slot";
import { Switch } from "@/components/common/switch";
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

/* eslint-disable perfectionist/sort-intersection-types -- I need non-standard props to come first */

export type DropZoneRootProps = UseDropZoneProps & {
	asChild?: boolean;
} & PartInputProps["root"];

const dropzonePropKeys = [
	"allowedFileTypes",
	"disableFilePickerOpenOnAreaClick",
	"disableInternalStateSubscription",
	"disablePreviewGenForNonImageFiles",
	"disabled",
	"initialFiles",
	"maxFileCount",
	"maxFileSize",
	"multiple",
	"onFilesChange",
	"onUpload",
	"onValidationError",
	"onValidationSuccess",
	"rejectDuplicateFiles",
	"unstyled",
	"validator",
] satisfies UnionToTuple<keyof UseDropZoneProps>;

export function DropZoneRoot<TElement extends React.ElementType = "div">(
	props: PolymorphicPropsStrict<TElement, DropZoneRootProps>
) {
	const { as: Element = "div", asChild, children, ...restOfProps } = props;

	const rootProps = useMemo(() => omitKeys(restOfProps, dropzonePropKeys), [restOfProps]);

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

	const Component = asChild ? Slot.Root : Element;

	return (
		<DropZoneStoreContextProvider store={storeApi}>
			<DropZoneRootContextProvider value={rootContextValue}>
				<Component {...propGetters.getRootProps(rootProps)}>{children}</Component>
			</DropZoneRootContextProvider>
		</DropZoneStoreContextProvider>
	);
}

export type DropZoneContextProps<TSlice> = {
	children: React.ReactNode | ((context: TSlice) => React.ReactNode);
	selector?: SelectorFn<DropZoneStore, TSlice>;
};

export function DropZoneContext<TSlice = DropZoneStore>(props: DropZoneContextProps<TSlice>) {
	const { children, selector } = props;

	const dropZoneCtx = useDropZoneStoreContext(useCompareSelector(selector));

	const resolvedChildren = isFunction(children) ? children(dropZoneCtx) : children;

	return resolvedChildren;
}

export type DropZoneContainerProps = {
	asChild?: boolean;
} & PartInputProps["container"];

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

export type DropZoneInputProps = {
	asChild?: boolean;
} & PartInputProps["input"];

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

export type DropZoneAreaProps<TSlice = DropZoneStore> = DropZoneContextProps<TSlice> & {
	classNames?: Partial<Record<Extract<keyof PartInputProps, "container" | "input">, string>>;
	extraProps?: Partial<Pick<PartInputProps, "container" | "input">>;
} & PartInputProps["container"];

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

export type DropZoneTriggerProps = {
	asChild?: boolean;
} & PartInputProps["trigger"];

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

export type DropZoneFileListProps = {
	asChild?: boolean;
	forceMount?: boolean;
} & (FileListManualListVariant | FileListPerItemVariant)
	& Omit<PartInputProps["fileList"], "children">;

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

export type DropZoneFileItemProps = FileItemContextType & {
	asChild?: boolean;
} & PartInputProps["fileItem"];

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

export type DropZoneFileItemDeleteProps = {
	asChild?: boolean;
} & PartInputProps["fileItemDelete"];

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

type StrictExtract<TUnion, TPick extends TUnion> = Extract<TUnion, TPick>;

export type DropZoneFileItemProgressProps = {
	asChild?: boolean;
	forceMount?: boolean;
	size?: number;
} & PartInputProps["fileItemProgress"]
	& (
		| {
				classNames?: { svgCircleOne?: string; svgCircleTwo?: string; svgRoot?: string };
				variant: StrictExtract<PartInputProps["fileItemProgress"]["variant"], "circular">;
		  }
		| {
				classNames?: { track?: string };
				variant: StrictExtract<PartInputProps["fileItemProgress"]["variant"], "fill">;
		  }
		| {
				classNames?: { track?: string };
				variant?: StrictExtract<PartInputProps["fileItemProgress"]["variant"], "linear">;
		  }
	);

export function DropZoneFileItemProgress<TElement extends React.ElementType = "span">(
	props: PolymorphicPropsStrict<TElement, DropZoneFileItemProgressProps>
) {
	const {
		as: Element = "span",
		asChild,
		className,
		classNames: classNamesProp,
		forceMount = false,
		size = 40,
		variant = "linear",
		...restOfProps
	} = props;

	const classNames: UnionToIntersection<NonNullable<typeof classNamesProp>> | undefined = classNamesProp;

	const fileItemContextValue = useFileItemContext();

	const fileState = fileItemContextValue?.fileState;

	const { propGetters } = useDropZoneRootContext();

	if (!fileState) {
		return null;
	}

	const Component = asChild ? Slot.Root : Element;

	const componentProps = propGetters.getFileItemProgressProps({ variant, ...restOfProps });

	return (
		<Presence
			present={fileState.progress !== 100}
			forceMount={forceMount}
			className="data-[animation-phase=exit]:animate-progress-out"
		>
			<Component className={cnMerge("inline-block", className)} {...componentProps}>
				<Switch.Root>
					<Switch.Match when={variant === "circular"}>
						{() => {
							const circumference = 2 * Math.PI * ((size - 4) / 2);
							const strokeDashoffset = circumference - (fileState.progress / 100) * circumference;

							return (
								<svg
									className={cnMerge("-rotate-90", classNames?.svgRoot)}
									width={size}
									height={size}
									viewBox={`0 0 ${size} ${size}`}
									fill="none"
									stroke="currentColor"
								>
									<circle
										className={cnMerge("text-zu-primary/20", classNames?.svgCircleOne)}
										strokeWidth="2"
										cx={size / 2}
										cy={size / 2}
										r={(size - 4) / 2}
									/>
									<circle
										className={cnMerge(
											"text-zu-primary transition-[stroke-dashoffset] duration-300 ease-linear",
											classNames?.svgCircleTwo
										)}
										strokeWidth="2"
										strokeLinecap="round"
										strokeDasharray={2 * Math.PI * ((size - 4) / 2)}
										strokeDashoffset={strokeDashoffset}
										cx={size / 2}
										cy={size / 2}
										r={(size - 4) / 2}
									/>
								</svg>
							);
						}}
					</Switch.Match>
					<Switch.Match when={variant === "fill"}>
						<span
							className={cnMerge(
								`size-full bg-zu-primary/50 transition-[clip-path] duration-300 ease-linear
								[clip-path:var(--clip-path)]`,
								classNames?.track
							)}
							style={
								{
									"--clip-path": `inset(${100 - fileState.progress}% 0% 0% 0%)`,
								} satisfies CssWithCustomProperties as CssWithCustomProperties
							}
						/>
					</Switch.Match>
					<Switch.Match when={variant === "linear"}>
						<span
							className={cnMerge(
								`inline-block size-full grow translate-x-(--translate-distance) bg-zu-primary
								transition-transform duration-300 ease-linear`,
								classNames?.track
							)}
							style={
								{
									"--translate-distance": `-${100 - fileState.progress}%`,
								} satisfies CssWithCustomProperties as CssWithCustomProperties
							}
						/>
					</Switch.Match>
				</Switch.Root>
			</Component>
		</Presence>
	);
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

export type DropZoneFileItemPreviewProps = Partial<Pick<FileItemContextType, "fileState">> & {
	asChild?: boolean;
	children?:
		| React.ReactNode
		| ((context: RenderPropContext & { fallbackPreview: () => React.ReactNode }) => React.ReactNode);
	renderPreview?: boolean | RenderPreview;
} & Omit<PartInputProps["fileItemPreview"], "children">;

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

export type DropZoneFileItemMetadataProps = Partial<Pick<FileItemContextType, "fileState">> & {
	asChild?: boolean;
	children?: React.ReactNode | ((context: Pick<FileItemContextType, "fileState">) => React.ReactNode);
	classNames?: {
		name?: string;
		size?: string;
	};
	size?: "default" | "sm";
} & Omit<PartInputProps["fileItemMetadata"], "children">;

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

export type DropZoneFileClearProps = {
	asChild?: boolean;
	forceMount?: boolean;
} & PartInputProps["fileItemClear"];

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

/* eslint-enable perfectionist/sort-intersection-types -- I need non-standard props to come first */
