"use client";

import { Await } from "@zayne-labs/ui-react/common/await";
import { useState } from "react";
import { cnJoin } from "@/lib/utils/cn";

const waitFor = (ms: number) => {
	const promise = new Promise((resolve) => setTimeout(resolve, ms));

	return promise;
};

type UserType = {
	email: string;
	id: number;
	name: string;
};

const fetchUser = async (id: number) => {
	const { promise, reject, resolve } = Promise.withResolvers<UserType>();

	await waitFor(1500);

	if (id === 999) {
		reject(new Error("User not found"));

		return promise;
	}

	resolve({
		email: `user${id}@example.com`,
		id,
		name: `User ${id}`,
	});

	return promise;
};

export default function AwaitDemo() {
	const [userId, setUserId] = useState(1);
	const [userPromise, setUserPromise] = useState(() => fetchUser(userId));

	const loadUser = (id: number) => {
		setUserId(id);
		setUserPromise(fetchUser(id));
	};

	const handleLoadRandomUser = () => {
		loadUser(Math.floor(Math.random() * 100));
	};

	const handleTriggerError = () => {
		loadUser(999);
	};

	return (
		<section className="flex w-full max-w-md flex-col gap-4">
			<div className="flex gap-2">
				<button
					className={cnJoin(
						"rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all active:scale-95",
						userId !== 999 ?
							"bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90"
						:	"bg-fd-primary/50 text-fd-primary-foreground/70"
					)}
					onClick={handleLoadRandomUser}
					type="button"
				>
					Load User
				</button>
				<button
					className={cnJoin(
						"rounded-lg px-4 py-2 text-sm font-medium transition-all active:scale-95",
						userId === 999 ?
							"bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600"
						:	"border border-fd-border bg-fd-card hover:bg-fd-muted"
					)}
					onClick={handleTriggerError}
					type="button"
				>
					Trigger Error
				</button>
			</div>

			<Await.Root promise={userPromise} onErrorReset={handleLoadRandomUser}>
				<Await.Pending>
					<div
						className="rounded-xl border border-fd-border bg-fd-card/40 p-6 shadow-sm
							backdrop-blur-sm"
					>
						<div className="mb-3 flex items-center gap-3">
							<div className="size-10 animate-pulse rounded-full bg-fd-muted" />
							<div className="flex-1 space-y-2">
								<div className="h-4 w-28 animate-pulse rounded-sm bg-fd-muted" />
								<div className="h-3 w-40 animate-pulse rounded-sm bg-fd-muted" />
							</div>
						</div>
						<div className="space-y-2">
							<div className="h-3 w-full animate-pulse rounded-sm bg-fd-muted" />
							<div className="h-3 w-3/4 animate-pulse rounded-sm bg-fd-muted" />
						</div>
					</div>
				</Await.Pending>

				<Await.Error>
					{({ error, resetErrorBoundary }) => (
						<div
							className="rounded-xl border border-red-200 bg-red-50/50 p-6 shadow-sm
								backdrop-blur-sm dark:border-red-900/50 dark:bg-red-950/50"
						>
							<div className="mb-3 flex items-center gap-2">
								<div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10">
									<svg
										className="size-4 text-red-600 dark:text-red-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										/>
									</svg>
								</div>
								<p className="font-semibold text-red-900 dark:text-red-100">Failed to Load</p>
							</div>

							<p className="mb-4 text-sm text-red-800 dark:text-red-200">{error.message}</p>

							<button
								type="button"
								onClick={resetErrorBoundary}
								className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm
									transition-all hover:bg-red-700 active:scale-95 dark:bg-red-700
									dark:hover:bg-red-600"
							>
								Try Again
							</button>
						</div>
					)}
				</Await.Error>

				<Await.Success<UserType>>
					{(user) => (
						<div
							className="rounded-xl border border-fd-border bg-fd-card/40 p-6 shadow-sm
								backdrop-blur-sm"
						>
							<div className="mb-3 flex items-center gap-3">
								<div
									className="flex size-10 items-center justify-center rounded-full
										bg-fd-primary/10"
								>
									<svg
										className="size-5 text-fd-primary"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
								<div>
									<h3 className="font-semibold text-fd-foreground">{user.name}</h3>
									<p className="text-sm text-fd-muted-foreground">{user.email}</p>
								</div>
							</div>
							<div className="flex items-center gap-2 rounded-lg bg-fd-muted/50 px-3 py-2">
								<span className="text-xs font-medium text-fd-muted-foreground">User ID:</span>
								<span className="text-xs font-bold text-fd-foreground">{user.id}</span>
							</div>
						</div>
					)}
				</Await.Success>
			</Await.Root>
		</section>
	);
}
