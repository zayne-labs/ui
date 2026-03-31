"use client";

import { For } from "@zayne-labs/ui-react/common/for";
import { useState } from "react";

const initialUsers = [
	{ id: 1, name: "Alice Johnson", role: "Developer" },
	{ id: 2, name: "Bob Smith", role: "Designer" },
	{ id: 3, name: "Carol White", role: "Manager" },
];

function ForDemo() {
	const [users, setUsers] = useState(initialUsers);

	return (
		<div className="flex w-full max-w-md flex-col gap-4">
			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => setUsers(initialUsers)}
					className="rounded-md bg-fd-primary px-3 py-1.5 text-sm text-fd-primary-foreground
						transition-colors hover:bg-fd-primary/90"
				>
					Show Users
				</button>
				<button
					type="button"
					onClick={() => setUsers([])}
					className="rounded-md bg-fd-secondary px-3 py-1.5 text-sm text-fd-secondary-foreground
						transition-colors hover:bg-fd-secondary/80"
				>
					Clear Users
				</button>
			</div>

			<ul className="rounded-lg border border-fd-border bg-fd-card p-4 shadow-sm">
				<For
					each={users}
					fallback={<p className="text-center text-fd-muted-foreground">No users found</p>}
					renderItem={(user) => (
						<li
							key={user.id}
							className="flex items-center justify-between border-b border-fd-border py-3
								last:border-b-0"
						>
							<div>
								<p className="font-medium text-fd-foreground">{user.name}</p>
								<p className="text-sm text-fd-muted-foreground">{user.role}</p>
							</div>
							<button
								type="button"
								onClick={() => setUsers((prev) => prev.filter((u) => u.id !== user.id))}
								className="rounded-md bg-fd-destructive/10 px-2 py-1 text-xs text-fd-destructive
									transition-colors hover:bg-fd-destructive/20"
							>
								Remove
							</button>
						</li>
					)}
				/>
			</ul>
		</div>
	);
}

export default ForDemo;
