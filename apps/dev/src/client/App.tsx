import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@zayne-labs/ui-react/form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const zodSchema = z.object({
	password: z.string().min(8, "Password must be at least 8 characters"),
	username: z.string().min(6, "Username must be at least 6 characters"),
});

function AnotherApp() {
	const methods = useForm({
		defaultValues: { password: "", username: "" },
		resolver: zodResolver(zodSchema),
	});

	const onSubmit = methods.handleSubmit(() => console.info("submit"));

	console.info("rerender");

	return (
		<Form.Root
			methods={methods}
			onSubmit={(event) => void onSubmit(event)}
			className="mx-auto mt-8 w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md"
		>
			<Form.Item control={methods.control} name="username" className="space-y-2">
				<Form.Label className="text-sm font-medium text-gray-700">Username</Form.Label>
				<Form.Input
					className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent
						focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</Form.Item>

			<Form.Item control={methods.control} name="password" className="space-y-2">
				<Form.Label className="text-sm font-medium text-gray-700">Password</Form.Label>
				<Form.Input
					type="password"
					className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent
						focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</Form.Item>

			<Form.FieldSubscribe
				control={methods.control}
				name={["password", "username"]}
				render={(field) => {
					return (
						<>
							<p>password: {field.value[0]}</p>
							<p>username: {field.value[1]}</p>
						</>
					);
				}}
			/>

			<Form.StateSubscribe
				control={methods.control}
				name={["password"]}
				render={(state) => {
					console.info("state-isDirty", state.isDirty);
					return (
						<button
							disabled={!state.isValid}
							type="submit"
							className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
								hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
								focus:outline-none disabled:opacity-50"
						>
							Submit
						</button>
					);
				}}
			/>
		</Form.Root>
	);
}
export default AnotherApp;
