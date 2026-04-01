"use client";

import { Show } from "@zayne-labs/ui-react/common/show";
import { LogIn, LogOut, Mail, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function ShowDemo() {
	const [user, setUser] = useState<{ email: string; name: string } | null>(null);

	const handleLogin = () => setUser({ email: "premium.user@zayne-labs.com", name: "Alexander Zayne" });
	const handleLogout = () => setUser(null);

	return (
		<section className="flex w-full max-w-md flex-col gap-6 py-4">
			<nav className="flex flex-wrap gap-2" aria-label="Authentification controls">
				<Button
					onClick={handleLogin}
					disabled={Boolean(user)}
					className="min-w-32 font-bold transition-all active:scale-95"
				>
					<LogIn className="mr-2 size-4" />
					Log In
				</Button>
				<Button
					theme="outline"
					onClick={handleLogout}
					disabled={!user}
					className="font-bold text-red-500 hover:bg-red-500/5 hover:text-red-600 active:scale-95"
				>
					<LogOut className="mr-2 size-4" />
					Log Out
				</Button>
			</nav>

			<div className="relative min-h-30">
				<Show.Root
					when={user}
					fallback={
						<article
							className="flex w-full animate-in flex-col items-center justify-center gap-3
								rounded-2xl border border-fd-border bg-fd-card/30 p-8 shadow-sm backdrop-blur-sm
								zoom-in-95 fade-in"
						>
							<span className="flex size-12 items-center justify-center rounded-full bg-fd-muted/50">
								<User className="size-6 text-fd-muted-foreground/50" />
							</span>
							<div className="text-center">
								<p className="text-sm font-bold text-fd-foreground">Session Inactive</p>
								<p
									className="mt-1 text-[11px] font-medium tracking-widest
										text-fd-muted-foreground/70 uppercase"
								>
									Please authenticate to access profile
								</p>
							</div>
						</article>
					}
				>
					{(userData) => (
						<article
							className="flex w-full animate-in flex-col gap-5 rounded-2xl border border-fd-border
								bg-fd-card p-6 shadow-xl backdrop-blur-md transition-all fade-in
								slide-in-from-bottom-3 hover:border-fd-primary/30"
						>
							<header className="flex items-center gap-4">
								<span
									className="flex size-14 items-center justify-center rounded-full
										bg-fd-primary/10 ring-4 ring-fd-primary/5"
								>
									<User className="size-7 text-fd-primary" />
								</span>
								<div className="flex flex-col gap-0.5">
									<h3 className="text-lg font-bold tracking-tight text-fd-foreground">
										{userData.name}
									</h3>
									<span
										className="inline-flex w-fit items-center rounded-full bg-emerald-500/10 px-2
											py-0.5 text-[10px] font-bold tracking-tighter text-emerald-600 uppercase"
									>
										Active Session
									</span>
								</div>
							</header>

							<aside className="flex items-center gap-3 rounded-xl bg-fd-muted/30 p-3">
								<span
									className="flex size-8 items-center justify-center rounded-lg bg-fd-background
										p-2 shadow-sm"
								>
									<Mail className="size-4 text-fd-muted-foreground" />
								</span>
								<div className="flex flex-col">
									<span
										className="text-[10px] font-bold tracking-widest text-fd-muted-foreground
											uppercase"
									>
										Primary Email
									</span>
									<a
										href={`mailto:${userData.email}`}
										className="text-sm font-medium text-fd-foreground transition-colors
											hover:text-fd-primary"
									>
										{userData.email}
									</a>
								</div>
							</aside>
						</article>
					)}
				</Show.Root>
			</div>
		</section>
	);
}

export default ShowDemo;
