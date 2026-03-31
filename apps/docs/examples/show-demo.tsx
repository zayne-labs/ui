"use client";

import { Show } from "@zayne-labs/ui-react/common/show";
import { useState } from "react";

function ShowDemo() {
	const [user, setUser] = useState<{ email: string; name: string } | null>(null);

	return (
		<div className="flex w-full max-w-md flex-col gap-4">
			<div className="flex gap-2">
				<button
					className="rounded-md bg-fd-primary px-4 py-2 text-sm text-fd-primary-foreground
						hover:bg-fd-primary/90"
					onClick={() => setUser({ email: "john@example.com", name: "John Doe" })}
					type="button"
				>
					Load User
				</button>
				<button
					className="rounded-md border border-fd-border px-4 py-2 text-sm hover:bg-fd-muted"
					onClick={() => setUser(null)}
					type="button"
				>
					Clear
				</button>
			</div>

			<Show.Root
				fallback={<p className="text-fd-muted-foreground">Please log in to continue.</p>}
				when={user}
			>
				{(userData) => (
					<div className="rounded-lg border border-fd-border p-4">
						<h3 className="font-semibold">{userData.name}</h3>
						<p className="text-sm text-fd-muted-foreground">{userData.email}</p>
					</div>
				)}
			</Show.Root>
		</div>
	);
}

export default ShowDemo;
