import { callApi } from "@zayne-labs/callapi";
import { useConstant } from "@zayne-labs/toolkit-react";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { Await } from "@zayne-labs/ui-react/common/await";
import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { Card } from "@zayne-labs/ui-react/ui/card";
import { cache } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cnMerge } from "../../lib/utils/cn";

type GitHubRepoDetails = {
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
	return callApi("https://api.github.com/orgs/zayne-labs/repos", {
		query: { per_page: 12, sort: "updated" },
		resultMode: "onlyData",
		schema: { data: (data) => data as GitHubRepoDetails[] },
		throwOnError: true,
	});
});

function PageThree() {
	const promise = useConstant(() => fetchRepos());

	return (
		<main
			className="flex min-h-screen justify-center bg-slate-50/50
				bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-100/40
				via-white to-purple-100/40 selection:bg-indigo-100 selection:text-indigo-900"
		>
			<div className="container px-4 py-12 sm:px-6 lg:px-8">
				<header className="text-center">
					<span
						className="mb-3 inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold
							text-indigo-600 shadow-sm ring-1 ring-indigo-500/10"
					>
						Portfolio
					</span>
					<h1
						className="mb-4 bg-linear-to-r from-gray-900 via-indigo-800 to-gray-900 bg-clip-text
							text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl"
					>
						Open Source Projects
					</h1>
					<p className="mx-auto max-w-2xl text-lg text-gray-600">
						Explore our collection of open source libraries, internal tools, and community
						contributions.
					</p>
				</header>

				<section className="mt-16">
					<Await.Root promise={promise}>
						<Await.Pending>
							<LoadingSpinner />
						</Await.Pending>

						<Await.Success<typeof promise>>
							{(repos) => (
								<ForWithWrapper
									className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:gap-8"
									each={repos}
								>
									{(repo) => <RepoCard key={repo.id} repo={repo} />}
								</ForWithWrapper>
							)}
						</Await.Success>

						<Await.Error>
							{({ error, resetErrorBoundary }) => (
								<div
									className="mx-auto max-w-md rounded-2xl border border-red-100 bg-white p-8
										text-center shadow-lg ring-1 ring-black/5"
								>
									<div
										className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full
											bg-red-50 text-red-500 ring-4 ring-red-50"
									>
										<svg
											className="size-6"
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
									<h3 className="mb-2 text-lg font-semibold text-gray-900">
										Unable to load projects
									</h3>
									<p className="mb-6 text-sm text-gray-500">
										{(error as Error | null)?.message ?? "An unknown error occurred"}
									</p>
									<Button
										variant="outline"
										className="w-full justify-center border-red-200 text-red-700
											hover:border-red-300 hover:bg-red-50/50"
										onClick={resetErrorBoundary}
									>
										Try again
									</Button>
								</div>
							)}
						</Await.Error>
					</Await.Root>
				</section>
			</div>
		</main>
	);
}

export { PageThree };

type RepoCardProps = {
	repo: GitHubRepoDetails;
};

function RepoCard(props: RepoCardProps) {
	const { repo } = props;

	return (
		<Card.Root
			as="li"
			className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100
				bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100
				hover:shadow-xl hover:shadow-indigo-500/10"
		>
			<Card.Header className="mb-4 flex items-start justify-between">
				<div className="grow pr-4">
					<Card.Title className="text-lg font-bold tracking-tight text-gray-900">
						<a
							href={repo.html_url}
							target="_blank"
							rel="noopener noreferrer"
							className="decoration-indigo-500/30 decoration-2 transition-colors
								hover:text-indigo-600 hover:underline"
						>
							{repo.name.replaceAll("-", " ").replaceAll(/\b\w/g, (l) => l.toUpperCase())}
						</a>
					</Card.Title>

					{repo.homepage && (
						<a
							href={repo.homepage.startsWith("http") ? repo.homepage : `https://${repo.homepage}`}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-1 flex items-center text-xs font-medium text-gray-500 transition-colors
								hover:text-indigo-600"
						>
							<svg className="mr-1.5 size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
								/>
							</svg>
							{
								new URL(
									repo.homepage.startsWith("http") ? repo.homepage : `https://${repo.homepage}`
								).hostname
							}
						</a>
					)}
				</div>

				<div className="shrink-0">
					{repo.language && (
						<span
							className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs
								font-semibold text-indigo-700 ring-1 ring-indigo-700/10 ring-inset"
						>
							{repo.language}
						</span>
					)}
				</div>
			</Card.Header>

			<Card.Content className="flex-1 pt-0 pb-6">
				<p className="line-clamp-3 text-sm/relaxed text-gray-600">
					{repo.description ?? "No description provided for this repository."}
				</p>

				{repo.topics.length > 0 && (
					<div className="mt-4 flex flex-wrap gap-2">
						{repo.topics.slice(0, 3).map((topic) => (
							<span
								key={topic}
								className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs
									font-medium text-gray-600 ring-1 ring-gray-500/10 transition-colors
									group-hover:bg-indigo-50 group-hover:text-indigo-700
									group-hover:ring-indigo-500/10"
							>
								{topic}
							</span>
						))}
						{repo.topics.length > 3 && (
							<span className="inline-flex items-center px-1 text-xs font-medium text-gray-400">
								+{repo.topics.length - 3}
							</span>
						)}
					</div>
				)}
			</Card.Content>

			<Card.Footer
				className="mt-auto border-t border-gray-100 bg-gray-50/50 px-6 py-3 transition-colors
					group-hover:bg-indigo-50/30"
			>
				<div className="flex w-full items-center justify-between text-xs font-medium text-gray-500">
					<div className="flex items-center space-x-4">
						<span className="flex items-center transition-colors group-hover:text-indigo-600">
							<svg className="mr-1.5 size-4" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
							</svg>
							{repo.stargazers_count}
						</span>
						<span className="flex items-center transition-colors group-hover:text-indigo-600">
							<svg className="mr-1.5 size-4" fill="currentColor" viewBox="0 0 24 24">
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
						title={`Updated on ${new Date(repo.updated_at).toLocaleDateString()}`}
						className="transition-colors group-hover:text-gray-700"
					>
						Updated {formatDate(repo.updated_at)}
					</span>
				</div>
			</Card.Footer>
		</Card.Root>
	);
}

type ButtonProps = InferProps<"button"> & VariantProps<typeof buttonVariants>;

const buttonVariants = tv({
	base: `inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200
	focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]
	disabled:pointer-events-none disabled:opacity-50`,
	variants: {
		size: {
			lg: "h-11 px-8",
			md: "h-10 px-4 py-2",
			sm: "h-9 px-3 text-sm",
		},
		variant: {
			default: "bg-zu-primary text-white hover:bg-zu-primary/80",
			ghost: "hover:bg-zu-accent hover:text-zu-accent-foreground",
			link: "text-zu-primary underline-offset-4 hover:underline",
			outline:
				"border border-gray-300 bg-transparent hover:bg-zu-accent hover:text-zu-accent-foreground",
		},
	},
});

function Button(props: ButtonProps) {
	const {
		children,
		className = "",
		size = "md",
		type = "button",
		variant = "default",
		...restOfProps
	} = props;

	return (
		<button type={type} className={buttonVariants({ className, size, variant })} {...restOfProps}>
			{children}
		</button>
	);
}

function Skeleton(props: InferProps<"div">) {
	const { className, ...restOfProps } = props;

	return (
		<div className={cnMerge("animate-pulse rounded-lg bg-gray-200/70", className)} {...restOfProps} />
	);
}

function LoadingSpinner() {
	return (
		<ForWithWrapper
			className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:gap-8"
			each={6}
			renderItem={(index) => (
				<Card.Root
					as="li"
					key={index}
					className="h-70 gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6
						shadow-sm"
				>
					<div className="flex items-center justify-between">
						<Skeleton className="h-6 w-3/4" />
						<Skeleton className="size-8 rounded-full" />
					</div>
					<Skeleton className="h-4 w-1/4" />
					<div className="space-y-2 py-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-4/6" />
					</div>
					<div className="flex gap-2 pt-2">
						<Skeleton className="h-6 w-16 rounded-full" />
						<Skeleton className="h-6 w-20 rounded-full" />
					</div>
				</Card.Root>
			)}
		/>
	);
}

function formatDate(dateString: string) {
	const date = new Date(dateString);

	const formattedDate = new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);

	return formattedDate;
}
