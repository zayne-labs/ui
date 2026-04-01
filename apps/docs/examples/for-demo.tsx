"use client";

import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { RefreshCw, Trash2, UserPlus, Users2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cnJoin } from "@/lib/utils/cn";

const initialUsers = [
	{ id: 1, name: "Alice Johnson", role: "Frontend Lead", status: "online" },
	{ id: 2, name: "Bob Smith", role: "Product Designer", status: "offline" },
	{ id: 3, name: "Carol White", role: "DevOps Engineer", status: "online" },
];

function ForDemo() {
	const [users, setUsers] = useState(initialUsers);

	const handleReset = () => setUsers(initialUsers);
	const handleClear = () => setUsers([]);
	const handleRemove = (id: number) => setUsers((prev) => prev.filter((u) => u.id !== id));

	return (
		<section className="flex w-full max-w-md flex-col gap-6 py-4">
			<nav className="flex flex-wrap gap-2" aria-label="Directory controls">
				<Button theme="outline" onClick={handleReset} className="font-bold">
					<RefreshCw className="mr-2 size-4" />
					Sync Team
				</Button>
				<Button
					theme="ghost"
					onClick={handleClear}
					className="font-bold text-red-500 hover:text-red-600"
				>
					<Trash2 className="mr-2 size-4" />
					Clear Directory
				</Button>
			</nav>

			<div className="relative min-h-40">
				<ForWithWrapper
					className="flex flex-col gap-3"
					each={users}
					fallback={
						<li
							className="group flex h-40 w-full animate-in flex-col items-center justify-center
								gap-3 rounded-2xl border-2 border-dashed border-fd-border bg-fd-muted/10 p-6
								shadow-sm transition-all fade-in hover:bg-fd-accent/5"
						>
							<span
								className="flex size-12 items-center justify-center rounded-full bg-fd-muted
									transition-transform group-hover:scale-110"
							>
								<Users2 className="size-6 text-fd-muted-foreground" />
							</span>
							<div className="text-center">
								<p className="text-sm font-bold text-fd-foreground">No team members</p>
								<p
									className="mt-1 text-[11px] font-medium tracking-widest
										text-fd-muted-foreground/70 uppercase"
								>
									Try syncing the team directory
								</p>
							</div>
						</li>
					}
					renderItem={(user, index) => (
						<li
							key={user.id}
							className="group flex animate-in items-center gap-4 rounded-xl border border-fd-border
								bg-fd-card/50 p-4 shadow-sm backdrop-blur-sm transition-all fade-in
								slide-in-from-bottom-2 hover:border-fd-primary/30"
							style={{ animationDelay: `${index * 50}ms` }}
						>
							<div className="relative">
								<span
									className="flex size-12 items-center justify-center rounded-full
										bg-fd-primary/10 ring-4 ring-fd-primary/5"
									aria-hidden="true"
								>
									<UserPlus className="size-6 text-fd-primary" />
								</span>
								<span
									className={cnJoin(
										"absolute -right-0.5 bottom-0 size-3 rounded-full border-2 border-fd-card",
										user.status === "online" ? "bg-emerald-500" : "bg-fd-muted-foreground"
									)}
									aria-hidden="true"
								/>
							</div>

							<div className="flex grow flex-col gap-0.5">
								<h4 className="text-sm font-bold tracking-tight text-fd-foreground">
									{user.name}
								</h4>
								<p className="text-xs font-medium text-fd-muted-foreground/80">{user.role}</p>
							</div>

							<Button
								theme="ghost"
								size="icon-xs"
								className="text-fd-muted-foreground opacity-0 transition-opacity
									group-hover:opacity-100 hover:text-red-500"
								onClick={() => handleRemove(user.id)}
								aria-label={`Remove ${user.name}`}
							>
								<X className="size-4" />
							</Button>
						</li>
					)}
				/>
			</div>

			<footer
				className="mt-2 text-center text-[11px] font-bold tracking-widest text-fd-muted-foreground
					uppercase"
			>
				Showing {users.length} Active Records
			</footer>
		</section>
	);
}

export default ForDemo;
