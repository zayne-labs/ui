import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { DropZone, DropZoneError } from "@zayne-labs/ui-react/ui/drop-zone";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { shadcnButtonVariants } from "./shadcn-button";

const zodSchema = z.object({
	files: z.file({ error: "Please upload a file" }).nullable(),
	notifications: z.array(z.coerce.string()),
	password: z.string().min(8, "Password must be at least 8 characters"),
	username: z.string().min(6, "Username must be at least 6 characters"),
});

function MainForm() {
	const methods = useForm({
		defaultValues: { notifications: [], password: "", username: "" },
		mode: "onChange",
		resolver: zodResolver(zodSchema),
	});

	const onSubmit = methods.handleSubmit((data) => console.info({ formData: data }));

	return (
		<Form.Root
			methods={methods}
			onSubmit={(event) => void onSubmit(event)}
			className="w-full max-w-md gap-8 rounded-xl bg-white p-8 shadow-lg"
		>
			<div className="text-center">
				<h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h2>
				<p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
			</div>

			<section className="flex flex-col gap-6">
				<Form.Field control={methods.control} name="username" className="gap-2">
					<Form.Label className="text-sm font-medium text-gray-900">Username</Form.Label>
					<Form.Input
						className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900
							placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
							focus:outline-none"
						placeholder="Enter your username"
					/>

					<Form.ErrorMessage />
				</Form.Field>

				<Form.Field control={methods.control} name="password" className="gap-2">
					<Form.Label className="text-sm font-medium text-gray-900">Password</Form.Label>
					<Form.Input
						type="password"
						classNames={{
							inputGroup: `w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900
							placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
							focus:outline-none`,
						}}
						placeholder="••••••••"
					/>

					<Form.ErrorMessage />
				</Form.Field>

				<Form.Field control={methods.control} name="files" className="gap-2">
					<Form.Label className="text-sm font-medium text-gray-900">Files</Form.Label>
					<Form.FieldController
						render={({ field }) => (
							<DropZone.Root
								// disabled={true}
								onUpload={async (ctx) => {
									const uploadPromises = ctx.fileStateArray.map(async (fileState) => {
										// Simulate file upload with progress
										const totalChunks = 10;
										let uploadedChunks = 0;

										// Simulate chunk upload with delays
										for (let count = 0; count < totalChunks; count++) {
											// Simulate network delay (100-300ms per chunk)
											// eslint-disable-next-line no-await-in-loop -- allow
											await new Promise((resolve) =>
												setTimeout(resolve, Math.random() * 200 + 100)
											);

											// Update progress for this specific file
											uploadedChunks++;

											const progress = (uploadedChunks / totalChunks) * 100;

											ctx.onProgress({ fileStateOrID: fileState, progress });
										}

										// ctx.onError({
										// 	error: new DropZoneError({
										// 		file: fileState.file,
										// 		message: `File: ${fileState.file.name} upload did not finish successfully`,
										// 	}),
										// 	fileStateOrID: fileState,
										// });

										// Simulate server processing delay
										await new Promise((resolve) => setTimeout(resolve, 500));
									});

									await Promise.all(uploadPromises);

									field.onChange(ctx.fileStateArray[0]?.file);
								}}
								onValidationError={(ctx) => console.error(ctx.message)}
								onValidationSuccess={(ctx) => console.info(ctx.message)}
								multiple={true}
								allowedFileTypes={["image/jpeg", "image/png", "image/jpg", "image/gif"]}
								maxFileSize={{ mb: 10 }}
								maxFileCount={3}
							>
								<DropZone.Area
									classNames={{
										container: `flex w-full flex-col items-center justify-center rounded-lg
										border-2 border-dashed border-gray-300 p-6 transition-colors
										hover:border-blue-500 hover:bg-blue-50 data-[drag-over]:border-pink-600
										data-[drag-over]:bg-pink-50`,
									}}
								>
									<svg
										className="mb-2 size-8 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
										/>
									</svg>
									<p className="text-sm font-medium text-gray-600">
										Drop files here or click to upload
									</p>
									<p className="mt-1 text-xs text-gray-500">Supported files: PDF, DOC, DOCX</p>
								</DropZone.Area>

								<DropZone.FileGroup>
									{(ctx) => {
										return ctx.fileStateArray.map((fileState) => (
											<DropZone.FileItem
												key={fileState.id}
												fileState={fileState}
												className="flex-col p-3"
											>
												<div className="flex w-full items-center gap-2">
													<DropZone.FileItemPreview className="size-10">
														<DropZone.FileItemProgress variant="fill" />
													</DropZone.FileItemPreview>

													<DropZone.FileItemMetadata />

													<DropZone.FileItemDelete
														className={shadcnButtonVariants({
															className: "size-7 shrink-0",
															size: "icon",
															variant: "ghost",
														})}
													>
														<Icon icon="lucide:trash-2" className="size-full" />
													</DropZone.FileItemDelete>
												</div>

												<DropZone.FileItemProgress variant="linear" />
											</DropZone.FileItem>
										));
									}}
								</DropZone.FileGroup>

								<DropZone.ErrorGroup>
									{(ctx) =>
										ctx.errors.map((error) => (
											<div
												key={error.file.name}
												className="flex items-center gap-1 text-xs text-red-600"
												role="alert"
											>
												<Icon icon="lucide:circle-alert" className="size-3 shrink-0" />
												<span>{error.message}</span>
											</div>
										))
									}
								</DropZone.ErrorGroup>
							</DropZone.Root>
						)}
					/>

					<Form.ErrorMessage />
				</Form.Field>

				<div className="space-y-4 rounded-lg border p-5">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg font-semibold">Notification Preferences</h3>
						<p className="text-sm">Choose how you want to receive updates</p>
					</div>

					<div className="space-y-4">
						<Form.Field
							control={methods.control}
							name="notifications.0"
							className="group flex-row items-start gap-4 rounded-md p-2"
						>
							<Form.Input
								type="checkbox"
								value="email"
								className="mt-1 size-4 rounded-sm border-2"
							/>
							<div className="flex flex-1 flex-col gap-1">
								<Form.Label className="text-sm font-medium">Email Notifications</Form.Label>
								<span className="text-xs">
									Get important updates and summaries delivered to your inbox
								</span>
								<Form.ErrorMessage />
							</div>
						</Form.Field>

						<Form.Field
							control={methods.control}
							name="notifications.1"
							className="group flex-row items-start gap-4 rounded-md p-2"
						>
							<Form.Input type="checkbox" value="sms" className="mt-1 size-4 rounded-sm border-2" />
							<div className="flex flex-1 flex-col gap-1">
								<Form.Label className="text-sm font-medium">SMS Updates</Form.Label>
								<span className="text-xs">
									Receive time-sensitive notifications via text message
								</span>
								<Form.ErrorMessage />
							</div>
						</Form.Field>

						<Form.Field
							control={methods.control}
							name="notifications.2"
							className="group flex flex-row items-start gap-4 rounded-md p-2"
						>
							<Form.Input
								type="checkbox"
								value="push"
								className="mt-1 size-4 rounded-sm border-2"
							/>
							<div className="flex flex-1 flex-col gap-1">
								<Form.Label className="text-sm font-medium">Push Notifications</Form.Label>
								<span className="text-xs">
									Get instant alerts directly on your device for real-time updates
								</span>
								<Form.ErrorMessage />
							</div>
						</Form.Field>
					</div>
				</div>

				<Form.SubscribeToFormState
					control={methods.control}
					render={({ isSubmitting }) => {
						return (
							<Form.Submit
								disabled={isSubmitting}
								className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white
									transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500
									focus:ring-offset-2 focus:outline-none disabled:opacity-50"
							>
								Sign in
							</Form.Submit>
						);
					}}
				/>
			</section>

			{/* Debug Section */}
			<div className="mt-8 space-y-4 rounded-lg bg-gray-50 p-4">
				<h3 className="text-sm font-medium text-gray-900">Debug Information</h3>

				<div className="space-y-2 text-sm text-gray-600">
					<Form.SubscribeToFieldValue
						control={methods.control}
						name={["password", "username"]}
						render={(field) => {
							return (
								<>
									<p>
										<span className="font-medium">Password:</span> {field.value[0]}
									</p>
									<p>
										<span className="font-medium">Username:</span> {field.value[1]}
									</p>
								</>
							);
						}}
					/>
				</div>
			</div>
		</Form.Root>
	);
}
export default MainForm;
