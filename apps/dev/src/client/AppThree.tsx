import { callApi } from "@zayne-labs/callapi";
import { useConstant } from "@zayne-labs/toolkit-react";
import { Await } from "@zayne-labs/ui-react/common/await";
import { For } from "@zayne-labs/ui-react/common/for";
import { Card } from "@zayne-labs/ui-react/ui/card";
import { cache } from "react";

type GitHubRepo = {
	description: string | null;
	forks_count: number;
	homepage: string | null;
	html_url: string;
	id: number;
	language: string | null;
	name: string;
	stargazers_count: number;
	topics: string[];
	updated_at: string;
};

const fetchRepos = cache(() => {
	return callApi<GitHubRepo[], false>("https://api.github.com/orgs/zayne-labs/repos", {
		query: { per_page: 12, sort: "updated" },
		resultMode: "onlyData",
		throwOnError: true,
	});
});

function AppThree() {
	const promise = useConstant(fetchRepos);

	return (
		<main className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Open Source Projects
					</h1>
					<p className="mx-auto mt-3 max-w-2xl text-gray-500 sm:mt-4">
						Explore our collection of open source projects and contributions
					</p>
				</div>

				<Await.Root promise={promise}>
					<Await.Pending>
						<LoadingSpinner />
					</Await.Pending>

					<Await.Success<typeof promise>>
						{(repos) => (
							<ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
								<For each={repos}>{(repo) => <RepoCard key={repo.id} repo={repo} />}</For>
							</ul>
						)}
					</Await.Success>

					<Await.Error>{(errorProps) => <ErrorFallback {...errorProps} />}</Await.Error>
				</Await.Root>
			</div>
		</main>
	);
}

export default AppThree;

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
	children: React.ReactNode;
	className?: string;
	size?: "lg" | "md" | "sm";
	type?: "button" | "reset" | "submit";
	variant?: "default" | "ghost" | "link" | "outline";
};

function Button(props: ButtonProps) {
	const {
		children,
		className = "",
		size = "md",
		type = "button",
		variant = "default",
		...restOfProps
	} = props;

	const baseStyles = [
		"inline-flex items-center justify-center",
		"rounded-md font-medium transition-colors",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
		"disabled:opacity-50 disabled:pointer-events-none",
	];

	const variants = {
		default: "bg-blue-600 text-white hover:bg-blue-700",
		ghost: "hover:bg-accent hover:text-accent-foreground",
		link: "underline-offset-4 hover:underline text-primary",
		outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
	};

	const sizes = {
		lg: "h-11 px-8",
		md: "h-10 py-2 px-4",
		sm: "h-9 px-3 text-sm",
	};

	return (
		<button
			type={type}
			className={[...baseStyles, variants[variant], sizes[size], className].filter(Boolean).join(" ")}
			{...restOfProps}
		>
			{children}
		</button>
	);
}

// Simple Skeleton component
function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} {...props} />;
}

function LoadingSpinner() {
	return (
		<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			<For
				each={6}
				renderItem={(index) => (
					<Card.Root key={`skeleton-${index}`} className="overflow-hidden">
						<Card.Header className="space-y-4 p-6 pb-4">
							<div className="flex items-center space-x-3">
								<Skeleton className="size-10 rounded-full" />
								<Skeleton className="h-4 w-24" />
							</div>
							<Skeleton className="h-6 w-3/4" />
						</Card.Header>

						<Card.Content className="space-y-3 px-6 pb-6">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-5/6" />
							<Skeleton className="h-4 w-4/6" />
						</Card.Content>

						<Card.Footer className="border-t border-gray-100 bg-gray-50 px-6 py-4">
							<div className="flex w-full items-center justify-between">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-8 w-20 rounded-md" />
							</div>
						</Card.Footer>
					</Card.Root>
				)}
			/>
		</div>
	);
}

function ErrorFallback({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
	const errorMessage = (error as Error | null)?.message ?? "An unknown error occurred";

	return (
		<div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
			<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
				<svg className="size-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<h3 className="mt-3 text-lg font-medium text-red-800">Failed to load posts</h3>
			<p className="mt-2 text-sm text-red-700">{errorMessage}</p>
			<Button
				variant="outline"
				className="mt-4 border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
				onClick={resetErrorBoundary}
			>
				Try again
			</Button>
		</div>
	);
}

function formatDate(dateString: string) {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);
}

function RepoCard({ repo }: { repo: GitHubRepo }) {
	return (
		<Card.Root
			className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white
				transition-all hover:border-blue-200 hover:shadow-md"
		>
			<Card.Header className="p-6 pb-4">
				<div className="flex items-start justify-between">
					<div>
						<Card.Title className="text-xl font-semibold text-gray-900">
							<a
								href={repo.html_url}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-blue-600 hover:underline"
							>
								{repo.name.replaceAll("-", " ").replaceAll(/\b\w/g, (l) => l.toUpperCase())}
							</a>
						</Card.Title>
						{repo.homepage && (
							<a
								href={
									repo.homepage.startsWith("http") ? repo.homepage : `https://${repo.homepage}`
								}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-1 block text-sm text-blue-600 hover:underline"
							>
								{
									new URL(
										repo.homepage.startsWith("http") ? repo.homepage : `https://${repo.homepage}`
									).hostname
								}
							</a>
						)}
					</div>
					{repo.language && (
						<span
							className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs
								font-medium text-blue-800"
						>
							{repo.language}
						</span>
					)}
				</div>
			</Card.Header>

			<Card.Content className="flex-1 px-6 pt-0 pb-6">
				<p className="line-clamp-3 text-gray-600">{repo.description ?? "No description provided."}</p>

				{repo.topics.length > 0 && (
					<div className="mt-3 flex flex-wrap gap-2">
						{repo.topics.slice(0, 3).map((topic) => (
							<span
								key={topic}
								className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs
									font-medium text-gray-800"
							>
								{topic}
							</span>
						))}
						{repo.topics.length > 3 && (
							<span className="text-xs text-gray-500">+{repo.topics.length - 3} more</span>
						)}
					</div>
				)}
			</Card.Content>

			<Card.Footer className="border-t border-gray-100 bg-gray-50 px-6 py-4">
				<div className="flex items-center justify-between text-sm text-gray-500">
					<div className="flex items-center space-x-4">
						<span className="flex items-center">
							<svg className="mr-1 size-4" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
							</svg>
							{repo.stargazers_count}
						</span>
						<span className="flex items-center">
							<svg className="mr-1 size-4" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
								<path
									d="M12 0c-6.627 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"
									transform="translate(0 1)"
								/>
							</svg>
							{repo.forks_count}
						</span>
					</div>
					<span
						className="text-xs"
						title={`Updated on ${new Date(repo.updated_at).toLocaleDateString()}`}
					>
						Updated {formatDate(repo.updated_at)}
					</span>
				</div>
			</Card.Footer>
		</Card.Root>
	);
}
