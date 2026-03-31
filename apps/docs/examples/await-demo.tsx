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
						"rounded-md px-4 py-2 text-sm transition-colors",
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
						"rounded-md px-4 py-2 text-sm transition-colors",
						userId === 999 ?
							`bg-fd-destructive text-fd-destructive-foreground ring-2 ring-fd-destructive
								ring-offset-2`
						:	"border border-fd-border hover:bg-fd-muted"
					)}
					onClick={handleTriggerError}
					type="button"
				>
					Trigger Error
				</button>
			</div>

			<Await.Root promise={userPromise} onErrorReset={handleLoadRandomUser}>
				<Await.Pending>
					<div className="rounded-lg border border-fd-border p-4">
						<div className="h-6 w-32 animate-pulse rounded-sm bg-fd-muted" />
						<div className="mt-2 h-4 w-48 animate-pulse rounded-sm bg-fd-muted" />
					</div>
				</Await.Pending>

				<Await.Error>
					{({ error, resetErrorBoundary }) => (
						<div
							className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4
								dark:border-red-900 dark:bg-red-950"
						>
							<div className="flex items-center gap-2 text-red-900 dark:text-red-100">
								<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								<p className="font-semibold">Error</p>
							</div>

							<p className="text-sm text-red-800 dark:text-red-200">{error.message}</p>

							<button
								type="button"
								onClick={resetErrorBoundary}
								className="mt-1 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white
									transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
							>
								Try Again
							</button>
						</div>
					)}
				</Await.Error>

				<Await.Success<UserType>>
					{(user) => (
						<div className="rounded-lg border border-fd-border p-4">
							<h3 className="font-semibold">{user.name}</h3>
							<p className="text-sm text-fd-muted-foreground">{user.email}</p>
						</div>
					)}
				</Await.Success>
			</Await.Root>
		</section>
	);
}
