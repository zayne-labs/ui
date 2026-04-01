"use client";

import { Await } from "@zayne-labs/ui-react/common/await";
import { AlertCircle, Hash, Mail, RefreshCw, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type UserType = {
	email: string;
	id: number;
	name: string;
};

const fetchUser = async (id: number) => {
	const { promise, reject, resolve } = Promise.withResolvers<UserType>();
	await waitFor(1500);

	if (id === 666) {
		reject(new Error("Database connection timeout or user not found."));
		return promise;
	}

	resolve({
		email: `user${id}@zayne-labs.com`,
		id,
		name: `Premium User ${id}`,
	});

	return promise;
};

function AwaitDemo() {
	const [userId, setUserId] = useState(1);
	const [userPromise, setUserPromise] = useState(() => fetchUser(userId));
	const [resetKey, setResetKey] = useState(0);

	const loadUser = (id: number) => {
		setUserId(id);
		setUserPromise(fetchUser(id));
	};

	const handleLoadRandomUser = () => loadUser(Math.floor(Math.random() * 100));
	const handleTriggerError = () => loadUser(666);
	const handleReset = () => {
		setUserId(1);
		setUserPromise(fetchUser(1));
		setResetKey((prev) => prev + 1);
	};

	const hasError = userId === 666;

	return (
		<section className="flex w-full max-w-md flex-col gap-6 py-4">
			<nav className="flex flex-wrap gap-2" aria-label="Demo controls">
				<Button onClick={handleLoadRandomUser} disabled={hasError} className="min-w-32">
					<RefreshCw className="mr-2 size-4" aria-hidden="true" />
					Load User
				</Button>
				<Button theme={hasError ? "destructive" : "outline"} onClick={handleTriggerError}>
					<AlertCircle className="mr-2 size-4" aria-hidden="true" />
					Trigger Error
				</Button>

				{hasError && (
					<Button theme="ghost" onClick={handleReset}>
						Reset Demo
					</Button>
				)}
			</nav>

			<div className="relative min-h-[160px]">
				<Await.Root promise={userPromise} errorResetKeys={[resetKey]} onErrorReset={handleReset}>
					<Await.Pending>
						<UserSkeleton />
					</Await.Pending>

					<Await.Error>
						{({ error, resetErrorBoundary }) => (
							<ErrorCard error={error} onReset={resetErrorBoundary} />
						)}
					</Await.Error>

					<Await.Success<UserType>>{(user) => <UserCard user={user} />}</Await.Success>
				</Await.Root>
			</div>
		</section>
	);
}

export default AwaitDemo;

function UserSkeleton() {
	return (
		<article
			className="w-full animate-in rounded-2xl border border-fd-border bg-fd-card/50 p-6 shadow-sm
				backdrop-blur-sm zoom-in-95 fade-in"
		>
			<div className="flex items-center gap-4">
				<span className="size-12 animate-pulse rounded-full bg-fd-muted" />
				<div className="flex grow flex-col gap-2">
					<span className="block h-5 w-32 animate-pulse rounded-md bg-fd-muted" />
					<span className="block h-3 w-48 animate-pulse rounded-md bg-fd-muted" />
				</div>
			</div>
			<span className="mt-4 block h-10 w-full animate-pulse rounded-xl bg-fd-muted" />
		</article>
	);
}

function ErrorCard({ error, onReset }: { error: Error; onReset: () => void }) {
	return (
		<article
			className="w-full animate-in rounded-2xl border border-red-500/20 bg-red-500/5 p-6 shadow-xl
				shadow-red-500/5 backdrop-blur-sm fade-in slide-in-from-top-2"
		>
			<header className="flex items-start gap-3">
				<span className="rounded-full bg-red-500/10 p-2" aria-hidden="true">
					<AlertCircle className="size-5 text-red-600 dark:text-red-400" />
				</span>
				<div className="grow">
					<h4 className="font-bold text-red-900 dark:text-red-100">Something went wrong</h4>
					<p className="mt-1 text-sm text-red-800/80 dark:text-red-200/80">{error.message}</p>
				</div>
			</header>
			<Button
				theme="destructive"
				className="mt-4 w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
				onClick={onReset}
			>
				Try Again
			</Button>
		</article>
	);
}

function UserCard({ user }: { user: UserType }) {
	return (
		<article
			className="flex w-full animate-in flex-col gap-4 rounded-2xl border border-fd-border bg-fd-card/50
				p-6 shadow-xl backdrop-blur-sm fade-in slide-in-from-bottom-2"
		>
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<span
						className="flex size-12 items-center justify-center rounded-full bg-fd-primary/10 ring-4
							ring-fd-primary/5"
						aria-hidden="true"
					>
						<UserIcon className="size-6 text-fd-primary" />
					</span>
					<div>
						<h3 className="text-lg font-bold tracking-tight text-fd-foreground">{user.name}</h3>
						<address
							className="flex items-center gap-1.5 text-sm text-fd-muted-foreground not-italic"
						>
							<Mail className="size-3.5" aria-hidden="true" />
							<a href={`mailto:${user.email}`} className="hover:text-fd-primary">
								{user.email}
							</a>
						</address>
					</div>
				</div>
				<span
					className="hidden rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold
						tracking-wider text-emerald-500 uppercase sm:block"
				>
					Verified Profile
				</span>
			</header>

			<dl className="flex items-center gap-3 rounded-xl bg-fd-muted/30 p-3">
				<span className="rounded-lg bg-fd-background p-2" aria-hidden="true">
					<Hash className="size-4 text-fd-muted-foreground" />
				</span>
				<div className="flex flex-col">
					<dt className="text-[10px] font-bold tracking-widest text-fd-muted-foreground uppercase">
						User Identifier
					</dt>
					<dd className="font-mono text-sm font-medium text-fd-foreground">
						USR-{user.id.toString().padStart(4, "0")}
					</dd>
				</div>
			</dl>
		</article>
	);
}
