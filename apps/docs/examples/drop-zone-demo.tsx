"use client";

import { DropZone } from "@zayne-labs/ui-react/ui/drop-zone";
import { AlertCircle, CheckCircle2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function DropZoneDemo() {
	return (
		<DropZone.Root
			className="w-full max-w-lg"
			multiple={true}
			maxFileCount={5}
			maxFileSize={{ mb: 5 }}
			allowedFileTypes={["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]}
			disableFilePickerOpenOnAreaClick={true}
			onUpload={async (ctx) => {
				const simulateUpload = (id: string) => {
					const { promise, resolve } = Promise.withResolvers<string>();
					let progress = 0;

					const interval = setInterval(() => {
						progress += 10;
						ctx.onProgress({ fileStateOrID: id, progress });
						if (progress >= 100) {
							clearInterval(interval);
							resolve("Resolved");
						}
					}, 200);

					return promise;
				};

				await Promise.all(
					ctx.fileStateArray.map(async ({ id }) => {
						await simulateUpload(id)
							.then(() => ctx.onSuccess({ fileStateOrID: id }))
							.catch((error: unknown) => ctx.onError({ error, fileStateOrID: id }));
					})
				);
			}}
		>
			<DropZone.Area
				className="group flex flex-col items-center gap-6 rounded-3xl border-2 border-dashed
					border-fd-border/50 bg-fd-background/50 p-12 text-center transition-all duration-500
					hover:border-fd-primary/40 hover:bg-fd-primary/5 data-drag-over:border-fd-primary
					data-drag-over:bg-fd-primary/10"
			>
				<div className="relative">
					<span
						className="flex size-14 items-center justify-center rounded-2xl bg-fd-primary/10
							transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
						aria-hidden="true"
					>
						<Upload className="size-7 text-fd-primary" />
					</span>
					<span
						className="absolute -top-1 -right-1 size-3 animate-pulse rounded-full bg-fd-primary
							shadow-sm"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<p className="text-sm font-black tracking-tight text-fd-foreground">Drop images here</p>
					<p className="text-[11px] font-bold tracking-wider text-fd-muted-foreground/60 uppercase">
						PNG, JPG, WEBP • MAX 5MB
					</p>
				</div>

				<DropZone.Trigger asChild={true}>
					<Button theme="glow" className="border-fd-border/60 font-bold tracking-tight">
						Select Files
					</Button>
				</DropZone.Trigger>
			</DropZone.Area>

			<DropZone.FileList
				className="mt-6 flex max-h-72 flex-col gap-3 overflow-y-auto pr-1 transition-all"
			>
				{({ fileState }) => (
					<DropZone.FileItem
						key={fileState.id}
						fileState={fileState}
						className="group relative flex animate-in items-center gap-4 rounded-2xl border
							border-fd-border/40 bg-fd-background/40 p-3 shadow-sm backdrop-blur-md transition-all
							duration-400 fade-in slide-in-from-bottom-2 hover:-translate-y-0.5
							hover:border-fd-primary/30 hover:bg-fd-background/80 hover:shadow-md
							dark:bg-fd-background/20"
					>
						<div className="relative shrink-0">
							<DropZone.FileItemPreview
								className="size-14 rounded-xl border border-fd-border/50 shadow-sm
									transition-transform group-hover:scale-105"
							/>

							{fileState.status === "success" && (
								<span
									className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center
										rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-fd-background"
								>
									<CheckCircle2 className="size-3" />
								</span>
							)}
							{fileState.status === "error" && (
								<span
									className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center
										rounded-full bg-rose-500 text-white shadow-sm ring-2 ring-fd-background"
								>
									<AlertCircle className="size-3" />
								</span>
							)}
						</div>

						<div className="flex min-w-0 grow flex-col gap-1.5">
							<DropZone.FileItemMetadata
								className="truncate text-sm font-semibold tracking-tight text-fd-foreground"
							/>

							<div className="flex flex-col gap-1.5">
								<div
									className="flex items-center justify-between text-[10px] font-bold
										tracking-widest text-fd-muted-foreground uppercase opacity-80"
								>
									<span className="flex items-center gap-1.5">
										<p>{fileState.status === "uploading" ? "Uploading" : "Complete"}</p>
									</span>
									<p>{Math.round(fileState.progress)}%</p>
								</div>

								<DropZone.FileItemProgress
									variant="linear"
									className="h-1.5 w-full overflow-hidden rounded-full bg-fd-secondary"
									classNames={{
										track: "h-full bg-fd-primary transition-all duration-300 ease-out",
									}}
								/>
							</div>
						</div>

						<DropZone.FileItemDelete asChild={true}>
							<Button
								theme="ghost"
								size="icon"
								className="size-8 shrink-0 rounded-full p-0 text-fd-muted-foreground transition-all
									duration-300 hover:bg-rose-500/10 hover:text-rose-500"
								aria-label="Remove file"
							>
								<X className="size-4" />
							</Button>
						</DropZone.FileItemDelete>
					</DropZone.FileItem>
				)}
			</DropZone.FileList>

			<DropZone.FileClear asChild={true}>
				<Button
					theme="secondary"
					size="lg"
					className="mt-4 border-fd-border/50 font-bold tracking-tight"
				>
					Clear all
				</Button>
			</DropZone.FileClear>
		</DropZone.Root>
	);
}

export default DropZoneDemo;
