import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { DropZone } from "@zayne-labs/ui-react/drop-zone";
import { Form } from "@zayne-labs/ui-react/form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const zodSchema = z.object({
	files: z.instanceof(File),
	password: z.string().min(8, "Password must be at least 8 characters"),
	username: z.string().min(6, "Username must be at least 6 characters"),
});

function MainForm() {
	const methods = useForm({
		defaultValues: { password: "", username: "" },
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
							placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2
							focus:ring-blue-500/20"
						placeholder="Enter your username"
					/>
				</Form.Field>

				<Form.Field control={methods.control} name="password" className="gap-2">
					<Form.Label className="text-sm font-medium text-gray-900">Password</Form.Label>
					<Form.Input
						type="password"
						className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900
							placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2
							focus:ring-blue-500/20"
						placeholder="••••••••"
					/>
				</Form.Field>

				<Form.Field control={methods.control} name="files" className="gap-2">
					<Form.Label className="text-sm font-medium text-gray-900">Password</Form.Label>
					<Form.FieldController
						render={({ field }) => (
							<DropZone.Root
								classNames={{
									base: `data-dragging:border-pink-600 data-dragging:bg-pink-50 flex w-full
									flex-col items-center justify-center rounded-lg border-2 border-dashed
									border-gray-300 p-6 transition-colors hover:border-blue-500 hover:bg-blue-50`,
								}}
								onUpload={(ctx) => field.onChange(ctx.filesWithPreview[0]?.file)}
								// multiple={true}
								maxFileSize={4}
								maxFileCount={2}
							>
								{(ctx) => (
									<>
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

										<DropZone.ImagePreview>
											{ctx.dropZoneState.filesWithPreview.map((fileWithPreview) => (
												<img
													key={fileWithPreview.id}
													className="mx-auto size-48 rounded-lg object-cover shadow-md
														transition-transform hover:scale-105"
													src={fileWithPreview.preview}
													alt="File preview"
												/>
											))}

											{ctx.dropZoneState.errors.map((error) => (
												<div
													key={error.errorFile.name}
													className="flex items-center gap-1 text-xs text-red-600"
													role="alert"
												>
													<Icon icon="lucide:circle-alert" className="size-3 shrink-0" />
													<span>{error.message}</span>
												</div>
											))}
										</DropZone.ImagePreview>
									</>
								)}
							</DropZone.Root>
						)}
					/>
				</Form.Field>

				{/* Submit Button */}
				<Form.SubscribeToFormState
					control={methods.control}
					render={({ isValid }) => {
						return (
							<Form.Submit
								disabled={!isValid}
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
