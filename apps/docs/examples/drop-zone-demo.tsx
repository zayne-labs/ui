"use client";

import { DropZone } from "@zayne-labs/ui-react/ui/drop-zone";
import { AlertCircle, CheckCircle2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function DropZoneDemo() {
	return (
		<DropZone.Root
			className="w-full max-w-lg rounded-4xl border border-fd-border bg-fd-card/40 p-8 shadow-2xl
				backdrop-blur-md"
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
					<div
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
					<Button theme="glow" size="sm" className="border-fd-border/60 font-bold tracking-tight">
						Select Files
					</Button>
				</DropZone.Trigger>
			</DropZone.Area>

			<DropZone.FileList className="mt-6 flex max-h-72 flex-col gap-4 overflow-y-auto pr-1 transition-all">
				{({ fileState }) => (
					<DropZone.FileItem
						key={fileState.id}
						fileState={fileState}
						className="group relative flex animate-in items-center gap-4 rounded-2xl border
							border-fd-border bg-fd-background/80 p-2.5 shadow-2xl transition-all duration-500
							fade-in slide-in-from-bottom-2 hover:-translate-y-0.5 hover:border-fd-primary/20
							hover:bg-fd-background"
					>
						<div className="relative shrink-0">
							<DropZone.FileItemPreview
								className="size-16 rounded-lg border border-fd-border/50 object-cover shadow-sm
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

						<div className="flex grow flex-col gap-2.5">
							<DropZone.FileItemMetadata
								className="truncate text-sm font-black tracking-tight text-fd-foreground"
							/>

							<div className="flex flex-col gap-2">
								<DropZone.FileItemProgress
									variant="linear"
									className="h-1.5 w-full overflow-hidden rounded-full bg-fd-muted/30"
									classNames={{
										track: "h-full bg-fd-primary transition-all duration-300 ease-out",
									}}
								/>

								<div
									className="flex items-center justify-between text-[10px] font-black
										tracking-widest text-fd-muted-foreground uppercase opacity-60"
								>
									<span className="flex items-center gap-1.5">
										<p>{Math.round(fileState.progress)}%</p>
										<span className="size-0.5 rounded-full bg-current opacity-30" />
										<p>{fileState.status === "uploading" ? "Uploading" : "Complete"}</p>
									</span>
								</div>
							</div>
						</div>

						<DropZone.FileItemDelete asChild={true}>
							<Button
								theme="ghost"
								size="icon"
								className="size-8 shrink-0 p-0 text-fd-muted-foreground transition-all duration-300
									hover:bg-rose-500/10 hover:text-rose-500"
								aria-label="Remove file"
							>
								<X className="size-4" />
							</Button>
						</DropZone.FileItemDelete>
					</DropZone.FileItem>
				)}
			</DropZone.FileList>

			<DropZone.FileClear asChild={true}>
				<Button theme="ghost" className="mt-4 gap-2 border-fd-border/60 font-black tracking-tight">
					<X className="size-4 opacity-60" />
					Clear all
				</Button>
			</DropZone.FileClear>
		</DropZone.Root>
	);
}

export default DropZoneDemo;
