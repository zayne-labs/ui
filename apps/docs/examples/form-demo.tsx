"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	email: z.email("Please enter a valid email"),
	message: z.string().min(10, "Message must be at least 10 characters"),
	name: z.string().min(1, "Name is required"),
	subscribe: z.boolean().default(false),
});

export default function FormDemo() {
	const form = useForm({
		defaultValues: {
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
		<div className="w-full max-w-md">
			<Form.Root
				form={form}
				onSubmit={(event) => void onSubmit(event)}
				className="gap-5 rounded-2xl border border-fd-border bg-fd-card/40 p-6 shadow-sm
					backdrop-blur-sm"
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
						className="w-full rounded-lg border border-fd-border bg-fd-background px-3.5 py-2.5
							text-sm text-fd-foreground shadow-sm transition-all
							placeholder:text-fd-muted-foreground focus:border-fd-primary focus:ring-2
							focus:ring-fd-primary/20 focus:outline-none data-invalid:border-red-500
							data-invalid:focus:ring-red-500/20"
					/>
					<Form.ErrorMessage className="text-xs text-red-600 dark:text-red-400" />
				</Form.Field>

				<Form.Field control={form.control} name="email">
					<Form.Label className="text-sm font-medium text-fd-foreground">Email</Form.Label>
					<Form.Input
						type="email"
						placeholder="john@example.com"
						className="w-full rounded-lg border border-fd-border bg-fd-background px-3.5 py-2.5
							text-sm text-fd-foreground shadow-sm transition-all
							placeholder:text-fd-muted-foreground focus:border-fd-primary focus:ring-2
							focus:ring-fd-primary/20 focus:outline-none data-invalid:border-red-500
							data-invalid:focus:ring-red-500/20"
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
		</div>
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
