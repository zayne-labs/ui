"use client";

import { DropZone } from "@zayne-labs/ui-react/ui/drop-zone";

function DropZoneDemo() {
	return (
		<div className="w-full max-w-[420px]">
			<DropZone.Root
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
					className="rounded-lg border-2 border-dashed border-fd-border bg-fd-muted/20 p-12
						text-center transition-colors data-drag-over:border-fd-primary
						data-drag-over:bg-fd-primary/5"
				>
					<div className="flex flex-col items-center gap-3">
						<div className="rounded-full bg-fd-primary/10 p-3">
							<svg
								className="size-8 text-fd-primary"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
						</div>

						<div>
							<p className="text-sm font-medium text-fd-foreground">
								Drop images here or click to browse
							</p>
							<p className="mt-1 text-xs text-fd-muted-foreground">
								PNG, JPG, GIF up to 5MB (max 5 files)
							</p>
						</div>

						<DropZone.Trigger
							className="mt-2 rounded-md bg-fd-primary px-4 py-2 text-sm font-medium
								text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
						>
							Select Files
						</DropZone.Trigger>
					</div>
				</DropZone.Area>

				<DropZone.FileList className="mt-6 gap-3">
					{({ fileState }) => (
						<DropZone.FileItem
							key={fileState.id}
							fileState={fileState}
							className="flex items-center gap-4 rounded-lg border border-fd-border bg-fd-card p-4
								shadow-sm"
						>
							<DropZone.FileItemPreview
								className="size-16 shrink-0 rounded-md border border-fd-border object-cover"
							/>
							<div className="min-w-0 grow">
								<DropZone.FileItemMetadata className="text-sm font-medium text-fd-foreground" />
								<DropZone.FileItemProgress
									variant="linear"
									className="mt-2 h-1.5 overflow-hidden rounded-full bg-fd-muted"
									classNames={{
										track: "h-full bg-fd-primary transition-all",
									}}
								/>
							</div>
							<DropZone.FileItemDelete
								className="shrink-0 rounded-md p-2 text-fd-muted-foreground transition-colors
									hover:bg-fd-destructive/10 hover:text-fd-destructive"
							>
								<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</DropZone.FileItemDelete>
						</DropZone.FileItem>
					)}
				</DropZone.FileList>

				<DropZone.FileClear
					className="mt-4 rounded-md border border-fd-border bg-fd-background px-4 py-2 text-sm
						font-medium text-fd-foreground transition-colors hover:bg-fd-muted
						data-[state=inactive]:hidden"
				>
					Clear All
				</DropZone.FileClear>
			</DropZone.Root>
		</div>
	);
}

export default DropZoneDemo;
