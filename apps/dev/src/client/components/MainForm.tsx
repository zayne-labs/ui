import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { DropZone } from "@zayne-labs/ui-react/ui/drop-zone";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

	const [max, setMax] = useState(3);

	console.info({ max });

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
							placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2
							focus:ring-blue-500/20"
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
							placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2
							focus:ring-blue-500/20`,
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
								onUpload={(ctx) => field.onChange(ctx.fileStateArray[0]?.file)}
								onUploadError={(ctx) => console.error(ctx.message)}
								onUploadSuccess={(ctx) => console.info(ctx.message)}
								multiple={true}
								allowedFileTypes={["image/jpeg", "image/png", "image/jpg", "image/gif"]}
								maxFileSize={{ mb: max }}
								maxFileCount={3}
							>
								<DropZone.Area
									classNames={{
										container: `data-drag-over:border-pink-600 data-drag-over:bg-pink-50 flex
										w-full flex-col items-center justify-center rounded-lg border-2 border-dashed
										border-gray-300 p-6 transition-colors hover:border-blue-500 hover:bg-blue-50`,
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
											<img
												key={fileState.id}
												className="mx-auto size-48 rounded-md object-cover shadow-md
													transition-transform hover:scale-105"
												src={fileState.preview}
												alt="File preview"
											/>
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

					<button
						type="button"
						onClick={() => setMax((prev) => prev + 1)}
						className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white"
					>
						Increase max size
					</button>
					<Form.ErrorMessage />
				</Form.Field>

				<div className="bg-card/50 space-y-4 rounded-lg border p-5">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg font-semibold">Notification Preferences</h3>
						<p className="text-muted-foreground text-sm">Choose how you want to receive updates</p>
					</div>

					<div className="space-y-4">
						<Form.Field
							control={methods.control}
							name="notifications.0"
							className="hover:bg-accent/50 group flex-row items-start gap-4 rounded-md p-2"
						>
							<Form.Input
								type="checkbox"
								value="email"
								className="group-hover:border-primary mt-1 size-4 rounded-sm border-2"
							/>
							<div className="flex flex-1 flex-col gap-1">
								<Form.Label className="text-sm font-medium">Email Notifications</Form.Label>
								<span className="text-muted-foreground text-xs">
									Get important updates and summaries delivered to your inbox
								</span>
								<Form.ErrorMessage />
							</div>
						</Form.Field>

						<Form.Field
							control={methods.control}
							name="notifications.1"
							className="hover:bg-accent/50 group flex-row items-start gap-4 rounded-md p-2"
						>
							<Form.Input
								type="checkbox"
								value="sms"
								className="group-hover:border-primary mt-1 size-4 rounded-sm border-2"
							/>
							<div className="flex flex-1 flex-col gap-1">
								<Form.Label className="text-sm font-medium">SMS Updates</Form.Label>
								<span className="text-muted-foreground text-xs">
									Receive time-sensitive notifications via text message
								</span>
								<Form.ErrorMessage />
							</div>
						</Form.Field>

						<Form.Field
							control={methods.control}
							name="notifications.2"
							className="hover:bg-accent/50 group flex flex-row items-start gap-4 rounded-md p-2"
						>
							<Form.Input
								type="checkbox"
								value="push"
								className="group-hover:border-primary mt-1 size-4 rounded-sm border-2"
							/>
							<div className="flex flex-1 flex-col gap-1">
								<Form.Label className="text-sm font-medium">Push Notifications</Form.Label>
								<span className="text-muted-foreground text-xs">
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
								className="mt-8 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold
									text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2
									focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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
