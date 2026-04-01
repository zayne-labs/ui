"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@zayne-labs/ui-react/common/switch";
import { DropZone } from "@zayne-labs/ui-react/ui/drop-zone";
import { Form } from "@zayne-labs/ui-react/ui/form";
import {
	Bell,
	CheckCircle2,
	FileText,
	Mail,
	MessageSquare,
	RefreshCw,
	Send,
	Upload,
	User,
	X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
	attachment: z.instanceof(File, { message: "Please upload a file" }).nullable(),
	email: z.email("Please enter a valid email"),
	message: z.string().min(10, "Message must be at least 10 characters"),
	name: z.string().min(1, "Name is required"),
	subscribe: z.boolean(),
});

const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

	const [isSuccess, setIsSuccess] = useState(false);

	const onSubmit = form.handleSubmit(async (data) => {
		console.info("Form submitted:", data);

		await waitFor(2000);

		setIsSuccess(true);
		setTimeout(() => setIsSuccess(false), 5000);
		form.reset();
	});

	return (
		<Form.Root
			form={form}
			onSubmit={(event) => void onSubmit(event)}
			className="w-full max-w-lg gap-6 rounded-3xl border border-fd-border bg-fd-card/40 p-8 shadow-2xl
				backdrop-blur-md"
		>
			<header className="flex flex-col gap-1">
				<div className="flex items-center gap-2">
					<span className="flex size-8 items-center justify-center rounded-lg bg-fd-primary/10">
						<Mail className="size-4 text-fd-primary" />
					</span>
					<h3 className="text-xl font-bold tracking-tight text-fd-foreground">Get in Touch</h3>
				</div>
				<p className="text-sm font-medium text-fd-muted-foreground/80">
					Have a project in mind? We'd love to hear from you.
				</p>
			</header>

			<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
				<Form.Field control={form.control} name="name">
					<Form.Label
						className="flex items-center gap-2 text-[13px] font-bold tracking-wider
							text-fd-foreground uppercase"
					>
						<User className="size-3.5 text-fd-muted-foreground" />
						Full Name
					</Form.Label>
					<Form.Input
						placeholder="Jane Cooper"
						className="rounded-xl border border-fd-border bg-fd-background/50 px-4 py-3 text-sm
							transition-all focus:border-fd-primary/50 focus:ring-4 focus:ring-fd-primary/10"
					/>
					<Form.ErrorMessage className="text-xs font-medium text-red-500" />
				</Form.Field>

				<Form.Field control={form.control} name="email">
					<Form.Label
						className="flex items-center gap-2 text-[13px] font-bold tracking-wider
							text-fd-foreground uppercase"
					>
						<Mail className="size-3.5 text-fd-muted-foreground" />
						Email Address
					</Form.Label>
					<Form.Input
						type="email"
						placeholder="jane@example.com"
						className="rounded-xl border border-fd-border bg-fd-background/50 px-4 py-3 text-sm
							transition-all focus:border-fd-primary/50 focus:ring-4 focus:ring-fd-primary/10"
					/>
					<Form.ErrorMessage className="text-xs font-medium text-red-500" />
				</Form.Field>
			</div>

			<Form.Field control={form.control} name="message">
				<Form.Label
					className="flex items-center gap-2 text-[13px] font-bold tracking-wider text-fd-foreground
						uppercase"
				>
					<MessageSquare className="size-3.5 text-fd-muted-foreground" />
					Your Message
				</Form.Label>
				<Form.TextArea
					placeholder="Tell us about your project or inquiry..."
					rows={4}
					className="rounded-xl border border-fd-border bg-fd-background/50 px-4 py-3 text-sm
						transition-all focus:border-fd-primary/50 focus:ring-4 focus:ring-fd-primary/10"
				/>
				<Form.ErrorMessage className="text-xs font-medium text-red-500" />
			</Form.Field>

			<Form.Field control={form.control} name="attachment">
				<Form.Label
					className="flex items-center gap-2 text-[13px] font-bold tracking-wider text-fd-foreground
						uppercase"
				>
					<Upload className="size-3.5 text-fd-muted-foreground" />
					Attachment
				</Form.Label>
				<Form.FieldBoundController
					render={({ field }) => (
						<DropZone.Root
							onUpload={async (ctx) => {
								await Promise.all(
									ctx.fileStateArray.map(async ({ id }) => {
										let progress = 0;
										await new Promise<void>((resolve) => {
											const interval = setInterval(() => {
												progress += 20;
												ctx.onProgress({ fileStateOrID: id, progress });
												if (progress >= 100) {
													clearInterval(interval);
													resolve();
												}
											}, 150);
										});
										ctx.onSuccess({ fileStateOrID: id });
									})
								);
							}}
							onFilesChange={(ctx) => {
								field.onChange(ctx.fileStateArray[0]?.file ?? null);
							}}
							multiple={false}
							maxFileSize={{ mb: 5 }}
						>
							<DropZone.Area
								className="group flex flex-col items-center justify-center gap-3 rounded-xl
									border-2 border-dashed border-fd-border bg-fd-muted/10 p-6 transition-all
									hover:border-fd-primary/50 hover:bg-fd-primary/5"
							>
								<span
									className="flex size-10 items-center justify-center rounded-full
										bg-fd-primary/10 transition-transform group-hover:scale-110"
								>
									<Upload className="size-5 text-fd-primary" />
								</span>
								<div className="text-center">
									<p className="text-sm font-bold text-fd-foreground">Click to upload files</p>
									<p
										className="text-[11px] font-medium tracking-tighter
											text-fd-muted-foreground/70 uppercase"
									>
										PDF or Images (Max 5MB)
									</p>
								</div>
							</DropZone.Area>

							<DropZone.FileList className="mt-3 flex flex-col gap-2">
								{({ fileState }) => (
									<DropZone.FileItem
										key={fileState.id}
										fileState={fileState}
										as="article"
										className="flex items-center gap-3 rounded-xl border border-fd-border
											bg-fd-card/50 p-3 shadow-sm"
									>
										<DropZone.FileItemPreview
											className="size-10 shrink-0 overflow-hidden rounded-lg"
										>
											<span
												className="flex size-full items-center justify-center bg-fd-muted/30"
											>
												<FileText
													className="size-5 text-fd-muted-foreground"
													aria-hidden="true"
												/>
											</span>
										</DropZone.FileItemPreview>

										<div className="min-w-0 grow">
											<DropZone.FileItemMetadata className="truncate text-[13px] font-bold" />
											<DropZone.FileItemProgress
												variant="linear"
												className="mt-1.5 h-1 w-full rounded-full bg-fd-muted"
												classNames={{ track: "h-full bg-fd-primary" }}
											/>
										</div>

										<DropZone.FileItemDelete asChild={true}>
											<button
												type="button"
												className="flex size-8 shrink-0 items-center justify-center rounded-lg
													text-fd-muted-foreground hover:bg-red-500/10 hover:text-red-500"
												aria-label="Remove"
											>
												<X className="size-4" />
											</button>
										</DropZone.FileItemDelete>
									</DropZone.FileItem>
								)}
							</DropZone.FileList>
						</DropZone.Root>
					)}
				/>
				<Form.ErrorMessage className="text-xs font-medium text-red-500" />
			</Form.Field>

			<Form.Field
				control={form.control}
				name="subscribe"
				className="flex-row items-center gap-3 rounded-xl bg-fd-muted/20 px-4 py-3"
			>
				<Form.Input
					type="checkbox"
					className="size-4.5 rounded-md border-fd-border text-fd-primary transition-all focus:ring-4
						focus:ring-fd-primary/10"
				/>
				<div className="flex flex-col gap-0.5">
					<Form.Label className="cursor-pointer text-sm font-bold text-fd-foreground">
						Subscribe to newsletter
					</Form.Label>
					<p className="text-[11px] font-medium text-fd-muted-foreground/70">
						Stay updated with our latest features and news.
					</p>
				</div>
			</Form.Field>

			<footer className="mt-2">
				<Form.StateSubscribe>
					{({ isSubmitting }) => (
						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-12 w-full rounded-xl font-bold tracking-tight shadow-lg
								shadow-fd-primary/20"
						>
							<Switch.Root>
								<Switch.Match when={isSubmitting}>
									<span className="flex items-center gap-2">
										<RefreshCw className="size-4 animate-spin" />
										Processing...
									</span>
								</Switch.Match>

								<Switch.Match when={isSuccess}>
									<span className="flex items-center gap-2">
										<CheckCircle2 className="size-4" />
										Message Sent!
									</span>
								</Switch.Match>

								<Switch.Default>
									<span className="flex items-center gap-2">
										<Send className="size-4 transition-transform group-hover:translate-x-1" />
										Send Message
									</span>
								</Switch.Default>
							</Switch.Root>
						</Button>
					)}
				</Form.StateSubscribe>

				{isSuccess && (
					<p
						className="mt-4 flex animate-in items-center justify-center gap-2 text-center text-xs
							font-bold text-emerald-500 fade-in slide-in-from-top-2"
					>
						<Bell className="size-3.5" />
						We've received your inquiry! Check your inbox soon.
					</p>
				)}
			</footer>
		</Form.Root>
	);
}

export default FormDemo;
