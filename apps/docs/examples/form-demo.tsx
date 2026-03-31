"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DropZone } from "@zayne-labs/ui-react/ui/drop-zone";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	attachment: z.instanceof(File, { message: "Please upload a file" }).nullable(),
	email: z.email("Please enter a valid email"),
	message: z.string().min(10, "Message must be at least 10 characters"),
	name: z.string().min(1, "Name is required"),
	subscribe: z.boolean().default(false),
});

function FormDemo() {
	const form = useForm({
		defaultValues: {
			attachment: null,
			email: "",
			message: "",
			name: "",
			subscribe: false,
		},
		resolver: zodResolver(formSchema),
	});

	const onSubmit = form.handleSubmit((data) => {
		console.info("Form submitted:", data);
		form.reset();
	});

	return (
		<Form.Root
			form={form}
			onSubmit={(event) => void onSubmit(event)}
			className="gap-5 rounded-2xl border border-fd-border bg-fd-card/40 p-6 shadow-sm backdrop-blur-sm"
		>
			<header>
				<h3 className="text-lg font-semibold text-fd-foreground">Contact Us</h3>
				<p className="text-sm text-fd-muted-foreground">
					Send us a message and we'll get back to you.
				</p>
			</header>

			<Form.Field control={form.control} name="name" className="mt-4">
				<Form.Label className="text-sm font-medium text-fd-foreground">Name</Form.Label>
				<Form.Input
					placeholder="John Doe"
					className="w-full rounded-lg border border-fd-border bg-fd-background px-3.5 py-2.5 text-sm
						text-fd-foreground shadow-sm transition-all placeholder:text-fd-muted-foreground
						focus:border-fd-primary focus:ring-2 focus:ring-fd-primary/20 focus:outline-none
						data-invalid:border-red-500 data-invalid:focus:ring-red-500/20"
				/>
				<Form.ErrorMessage className="text-xs text-red-600 dark:text-red-400" />
			</Form.Field>

			<Form.Field control={form.control} name="email">
				<Form.Label className="text-sm font-medium text-fd-foreground">Email</Form.Label>
				<Form.Input
					type="email"
					placeholder="john@example.com"
					className="w-full rounded-lg border border-fd-border bg-fd-background px-3.5 py-2.5 text-sm
						text-fd-foreground shadow-sm transition-all placeholder:text-fd-muted-foreground
						focus:border-fd-primary focus:ring-2 focus:ring-fd-primary/20 focus:outline-none
						data-invalid:border-red-500 data-invalid:focus:ring-red-500/20"
				/>
				<Form.ErrorMessage className="text-xs text-red-600 dark:text-red-400" />
			</Form.Field>

			<Form.Field control={form.control} name="message">
				<Form.Label className="text-sm font-medium text-fd-foreground">Message</Form.Label>
				<Form.TextArea
					placeholder="Tell us what you think..."
					rows={4}
					className="w-full resize-none rounded-lg border border-fd-border bg-fd-background px-3.5
						py-2.5 text-sm text-fd-foreground shadow-sm transition-all
						placeholder:text-fd-muted-foreground focus:border-fd-primary focus:ring-2
						focus:ring-fd-primary/20 focus:outline-none data-invalid:border-red-500
						data-invalid:focus:ring-red-500/20"
				/>
				<Form.ErrorMessage className="text-xs text-red-600 dark:text-red-400" />
			</Form.Field>

			<Form.Field control={form.control} name="attachment">
				<Form.Label className="text-sm font-medium text-fd-foreground">Attachment</Form.Label>
				<Form.FieldBoundController
					render={({ field }) => (
						<DropZone.Root
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
							onValidationError={(ctx) => {
								form.setError("attachment", { message: ctx.message });
							}}
							onFilesChange={(ctx) => {
								field.onChange(ctx.fileStateArray[0]?.file ?? null);
							}}
							multiple={false}
							allowedFileTypes={["image/jpeg", "image/png", "image/jpg", "application/pdf"]}
							maxFileSize={{ mb: 5 }}
						>
							<DropZone.Area
								className="flex w-full flex-col items-center justify-center rounded-lg border-2
									border-dashed border-fd-border bg-fd-muted/30 p-6 transition-all
									hover:border-fd-primary hover:bg-fd-primary/5 data-drag-over:border-fd-primary
									data-drag-over:bg-fd-primary/10"
							>
								<div
									className="flex size-10 items-center justify-center rounded-full
										bg-fd-primary/10"
								>
									<svg
										className="size-5 text-fd-primary"
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
								<p className="mt-2 text-sm font-medium text-fd-foreground">Click to upload</p>
								<p className="mt-1 text-xs text-fd-muted-foreground">PNG, JPG, PDF up to 5MB</p>
							</DropZone.Area>

							<DropZone.FileList>
								{(ctx) => (
									<DropZone.FileItem
										key={ctx.fileState.id}
										fileState={ctx.fileState}
										className="mt-2 flex-row items-center gap-3 rounded-lg border
											border-fd-border bg-fd-card p-3"
									>
										<DropZone.FileItemPreview
											className="size-10 shrink-0 overflow-hidden rounded-lg"
										>
											<DropZone.FileItemProgress variant="fill" />
										</DropZone.FileItemPreview>

										<div className="flex min-w-0 grow flex-col gap-1">
											<DropZone.FileItemMetadata
												className="truncate text-sm font-medium text-fd-foreground"
											/>
											<DropZone.FileItemProgress
												variant="linear"
												className="h-1.5 w-full rounded-full"
											/>
										</div>

										<DropZone.FileItemDelete
											className="flex size-8 shrink-0 items-center justify-center rounded-lg
												transition-colors hover:bg-fd-muted"
										>
											<svg
												className="size-4 text-fd-muted-foreground"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</DropZone.FileItemDelete>
									</DropZone.FileItem>
								)}
							</DropZone.FileList>
						</DropZone.Root>
					)}
				/>
				<Form.ErrorMessage className="text-xs text-red-600 dark:text-red-400" />
			</Form.Field>

			<Form.Field
				control={form.control}
				name="subscribe"
				className="flex-row items-center gap-2.5 rounded-lg bg-fd-muted/30 px-3 py-2.5"
			>
				<Form.Input
					type="checkbox"
					className="size-4 rounded-sm border-fd-border text-fd-primary transition-all focus:ring-2
						focus:ring-fd-primary/20 focus:ring-offset-0"
				/>
				<Form.Label className="text-sm font-medium text-fd-foreground">
					Subscribe to newsletter
				</Form.Label>
			</Form.Field>

			<Form.StateSubscribe>
				{({ isSubmitting, isValid }) => (
					<Form.Submit
						disabled={isSubmitting || !isValid}
						className="w-full rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium
							text-fd-primary-foreground shadow-sm transition-all hover:bg-fd-primary/90
							active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isSubmitting ?
							<LoadingSpinner />
						:	"Send Message"}
					</Form.Submit>
				)}
			</Form.StateSubscribe>
		</Form.Root>
	);
}

function LoadingSpinner() {
	return (
		<span className="flex items-center justify-center gap-2">
			<svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
				<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
				<path
					className="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			Sending...
		</span>
	);
}

export default FormDemo;
