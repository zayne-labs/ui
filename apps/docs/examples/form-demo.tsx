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
			<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="gap-6">
				<Form.Field name="name">
					<Form.Label className="text-sm font-medium text-fd-foreground">Name</Form.Label>
					<Form.Input
						placeholder="John Doe"
						className="mt-1.5 w-full rounded-md border border-fd-border bg-fd-background px-3 py-2
							text-sm text-fd-foreground placeholder:text-fd-muted-foreground
							focus:border-fd-primary focus:ring-1 focus:ring-fd-primary focus:outline-none
							data-invalid:border-fd-destructive data-invalid:focus:ring-fd-destructive"
					/>
					<Form.ErrorMessage className="mt-1.5 text-xs text-fd-destructive" />
				</Form.Field>

				<Form.Field name="email">
					<Form.Label className="text-sm font-medium text-fd-foreground">Email</Form.Label>
					<Form.Input
						type="email"
						placeholder="john@example.com"
						className="mt-1.5 w-full rounded-md border border-fd-border bg-fd-background px-3 py-2
							text-sm text-fd-foreground placeholder:text-fd-muted-foreground
							focus:border-fd-primary focus:ring-1 focus:ring-fd-primary focus:outline-none
							data-invalid:border-fd-destructive data-invalid:focus:ring-fd-destructive"
					/>
					<Form.ErrorMessage className="mt-1.5 text-xs text-fd-destructive" />
				</Form.Field>

				<Form.Field name="message">
					<Form.Label className="text-sm font-medium text-fd-foreground">Message</Form.Label>
					<Form.TextArea
						placeholder="Tell us what you think..."
						rows={4}
						className="mt-1.5 w-full resize-none rounded-md border border-fd-border bg-fd-background
							px-3 py-2 text-sm text-fd-foreground placeholder:text-fd-muted-foreground
							focus:border-fd-primary focus:ring-1 focus:ring-fd-primary focus:outline-none
							data-invalid:border-fd-destructive data-invalid:focus:ring-fd-destructive"
					/>
					<Form.ErrorMessage className="mt-1.5 text-xs text-fd-destructive" />
				</Form.Field>

				<Form.Field name="subscribe">
					<div className="flex items-center gap-2">
						<Form.Input
							type="checkbox"
							className="size-4 rounded-sm border-fd-border text-fd-primary focus:ring-2
								focus:ring-fd-primary focus:ring-offset-2"
						/>
						<Form.Label className="text-sm text-fd-foreground">Subscribe to newsletter</Form.Label>
					</div>
				</Form.Field>

				<Form.StateSubscribe>
					{({ isSubmitting, isValid }) => (
						<Form.Submit
							disabled={isSubmitting || !isValid}
							className="w-full rounded-md bg-fd-primary px-4 py-2.5 text-sm font-medium
								text-fd-primary-foreground transition-colors hover:bg-fd-primary/90
								disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSubmitting ? "Sending..." : "Send Message"}
						</Form.Submit>
					)}
				</Form.StateSubscribe>
			</Form.Root>
		</div>
	);
}
