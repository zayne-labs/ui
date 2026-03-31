import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { DropZone } from "@zayne-labs/ui-react/ui/drop-zone";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { shadcnButtonVariants } from "./shadcn-button";

const MainFormSchema = z.object({
	files: z.file({ error: "Please upload a file" }).nullable(),
	notifications: z.array(z.coerce.string<string>()),
	password: z.string().min(8, "Password must be at least 8 characters"),
	username: z.string().min(6, "Username must be at least 6 characters"),
});

function MainForm() {
	const form = useForm({
		defaultValues: { notifications: [], password: "", username: "" },
		mode: "onChange",
		resolver: zodResolver(MainFormSchema),
	});

	const onSubmit = form.handleSubmit((data) => console.info({ formData: data }));

	return (
		<Form.Root
			form={form}
			onSubmit={(event) => void onSubmit(event)}
			className="w-full max-w-md gap-8 rounded-2xl border border-white/40 bg-white/70 p-8 shadow-2xl
				shadow-indigo-500/10 backdrop-blur-xl"
		>
			<div className="flex flex-col gap-1.5">
				<h2
					className="text-2xl font-bold tracking-tight text-slate-900 transition-colors
						group-hover:text-indigo-600"
				>
					Account Setup
				</h2>
				<p className="text-sm text-slate-500">Enter your details to configure your profile</p>
			</div>

			<section className="flex flex-col gap-6">
				<Form.Field control={form.control} name="username" className="gap-2">
					<Form.Label className="text-sm font-semibold text-slate-700">Username</Form.Label>
					<Form.Input
						className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900
							transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4
							focus:ring-indigo-500/10 focus:outline-none"
						placeholder="johndoe"
					/>
					<Form.ErrorMessage className="text-xs font-medium text-rose-500" />
				</Form.Field>

				<Form.Field control={form.control} name="password" className="gap-2">
					<Form.Label className="text-sm font-semibold text-slate-700">Password</Form.Label>
					<Form.Input
						type="password"
						classNames={{
							inputGroup: `w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5
							text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500
							focus:ring-4 focus:ring-indigo-500/10 focus:outline-none`,
						}}
						placeholder="••••••••"
					/>
					<Form.ErrorMessage className="text-xs font-medium text-rose-500" />
				</Form.Field>

				<Form.Field control={form.control} name="files" className="gap-2">
					<Form.Label className="text-sm font-semibold text-slate-700">Avatar Upload</Form.Label>
					<Form.FieldBoundController
						render={({ field }) => (
							<DropZone.Root
								onUpload={async (ctx) => {
									const uploadPromises = ctx.fileStateArray.map(async (fileState) => {
										const totalChunks = 10;
										let uploadedChunks = 0;
										for (let count = 0; count < totalChunks; count++) {
											// eslint-disable-next-line no-await-in-loop
											await new Promise((resolve) =>
												setTimeout(resolve, Math.random() * 150 + 50)
											);
											uploadedChunks++;
											const progress = (uploadedChunks / totalChunks) * 100;
											ctx.onProgress({ fileStateOrID: fileState, progress });
										}
										await new Promise((resolve) => setTimeout(resolve, 300));
									});

									await Promise.all(uploadPromises);
								}}
								onValidationError={(ctx) => {
									form.setError("files", { message: ctx.message });
								}}
								onFilesChange={(ctx) => {
									field.onChange(ctx.fileStateArray[0]?.file);
								}}
								multiple={false}
								allowedFileTypes={["image/jpeg", "image/png", "image/jpg"]}
								maxFileSize={{ mb: 2 }}
							>
								<DropZone.Area
									classNames={{
										container: `flex w-full flex-col items-center justify-center rounded-xl
										border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 transition-all
										hover:border-indigo-400 hover:bg-indigo-50/50
										data-drag-over:border-indigo-600 data-drag-over:bg-indigo-50`,
									}}
								>
									<span
										className="flex size-12 items-center justify-center rounded-full bg-white
											text-slate-400 shadow-sm ring-1 ring-slate-200"
									>
										<Icon icon="lucide:cloud-upload" className="size-6" />
									</span>
									<p className="mt-3 text-sm font-semibold text-slate-900">
										Click to upload avatar
									</p>
									<p className="mt-1 text-center text-xs text-slate-500">JPG, PNG up to 2MB</p>
								</DropZone.Area>

								<DropZone.FileList>
									{(ctx) => (
										<DropZone.FileItem
											key={ctx.fileState.id}
											fileState={ctx.fileState}
											className="mt-2 flex-row items-center gap-3 rounded-xl border
												border-slate-100 bg-white p-3 shadow-sm"
										>
											<DropZone.FileItemPreview
												className="size-10 shrink-0 overflow-hidden rounded-lg"
											>
												<DropZone.FileItemProgress
													variant="fill"
													classNames={{ track: "bg-indigo-600/30" }}
												/>
											</DropZone.FileItemPreview>

											<div className="flex min-w-0 grow flex-col gap-1.5">
												<DropZone.FileItemMetadata
													className="truncate font-medium text-slate-900"
												/>
												<DropZone.FileItemProgress
													variant="linear"
													classNames={{
														track: `h-1.5 w-full rounded-full bg-indigo-600 shadow-inner
														transition-all duration-300`,
													}}
												/>
											</div>

											<DropZone.FileItemDelete
												className={shadcnButtonVariants({
													className: "size-8 shrink-0",
													size: "icon",
													variant: "ghost",
												})}
											>
												<Icon icon="lucide:trash-2" className="size-4" />
											</DropZone.FileItemDelete>
										</DropZone.FileItem>
									)}
								</DropZone.FileList>
							</DropZone.Root>
						)}
					/>

					<Form.ErrorMessage className="text-xs font-medium text-rose-500" />
				</Form.Field>

				<div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
					<div className="flex flex-col gap-1">
						<h3 className="text-base font-bold text-slate-900">Notifications</h3>
						<p className="text-xs text-slate-500">Stay updated with your account activity</p>
					</div>

					<ForWithWrapper
						className="flex flex-col gap-3"
						each={[
							{
								desc: "Weekly summaries and activity",
								id: 0,
								label: "Email Notifications",
								value: "email",
							},
							{
								desc: "Instant alerts on your device",
								id: 1,
								label: "Push Updates",
								value: "push",
							},
						]}
						renderItem={(opt) => (
							<Form.Field
								key={opt.id}
								control={form.control}
								name={`notifications.${opt.id}`}
								className="group flex flex-row items-start gap-3 rounded-xl p-2 transition-colors
									hover:bg-white"
							>
								<Form.Input
									type="checkbox"
									value={opt.value}
									className="mt-1 size-4 rounded-sm border-slate-300 text-indigo-600
										focus:ring-indigo-500"
								/>
								<div className="pointer-events-none flex grow flex-col gap-0.5">
									<Form.Label
										className="text-sm/tight font-semibold tracking-tight text-slate-900"
									>
										{opt.label}
									</Form.Label>
									<span className="text-xs text-slate-500">{opt.desc}</span>
								</div>
							</Form.Field>
						)}
					/>
				</div>

				<Form.StateSubscribe
					control={form.control}
					render={(formState) => {
						return (
							<Form.Submit
								disabled={formState.isSubmitting}
								className="group relative w-full overflow-hidden rounded-xl bg-indigo-600 px-5
									py-3.5 text-sm font-bold text-white transition-all hover:bg-indigo-700
									hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]
									disabled:pointer-events-none disabled:opacity-50"
							>
								<span className="relative z-10">Create Account</span>
								<div
									/* eslint-disable tailwindcss-better/enforce-consistent-class-order,tailwindcss-better/no-unknown-classes */
									className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent
										via-white/10 to-transparent group-hover:animate-shine"
									/* eslint-enable tailwindcss-better/enforce-consistent-class-order,tailwindcss-better/no-unknown-classes */
								/>
							</Form.Submit>
						);
					}}
				/>
			</section>

			<section
				className="mt-2 flex flex-col gap-4 rounded-xl border border-indigo-50 bg-indigo-50/30 p-4"
			>
				<div className="flex items-center gap-2 text-indigo-900">
					<Icon icon="lucide:terminal" className="size-4" />
					<h3 className="text-xs font-bold tracking-wider uppercase">Debug State</h3>
				</div>

				<div
					className="flex flex-col gap-1.5 rounded-lg border border-indigo-100/50 bg-white/50 p-3
						font-mono text-[13px] text-indigo-700/80"
				>
					<Form.Watch
						control={form.control}
						name={["username"]}
						render={(value) => (
							<p className="flex justify-between">
								<span className="opacity-60">username:</span>
								<span className="font-semibold">{value[0] || '""'}</span>
							</p>
						)}
					/>
					<Form.Watch
						control={form.control}
						name={["notifications"]}
						render={(value) => (
							<p className="flex justify-between">
								<span className="opacity-60">notifications:</span>
								<span className="font-semibold">
									[{value[0].filter(Boolean).join(", ") || ""}]
								</span>
							</p>
						)}
					/>
				</div>
			</section>
		</Form.Root>
	);
}
export default MainForm;
