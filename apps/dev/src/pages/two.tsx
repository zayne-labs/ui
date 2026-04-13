import { css } from "@zayne-labs/toolkit-core";
import {
	composeEventHandlers,
	createSlotComponent,
	getMultipleSlots,
	getSlotMap,
	type GetSlotComponentProps,
} from "@zayne-labs/toolkit-react/utils";
import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { Switch } from "@zayne-labs/ui-react/common/switch";
import { useState } from "react";
import { cnJoin } from "../lib/utils/cn";

const composedAction = composeEventHandlers(
	() => console.info("Handshake Initiated"),
	() => console.info("Analytics Event Dispatched")
);

const scopedCss = css`
	@scope {
		.feature-card,
		.widget-card {
			display: flex;
			flex-direction: column;
			background: white;
			border: 1px solid #f1f5f9;
			border-radius: 4rem;
			padding: 3.5rem;
			box-shadow:
				0 10px 15px -3px rgb(0 0 0 / 0.01),
				0 4px 6px -4px rgb(0 0 0 / 0.01);
			transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
		}
		.feature-card:hover {
			transform: scale(1.02) translateY(-10px);
			border-color: #e2e8f0;
			box-shadow: 0 30px 70px -12px rgb(0 0 0 / 0.1);
		}
		.widget-card {
			background: radial-gradient(circle at top right, white, #fcfcfc);
		}
		.btn-primary {
			background: #4f46e5;
			color: white;
			padding: 1.25rem 2rem;
			border-radius: 1.5rem;
			font-size: 0.75rem;
			font-weight: 950;
			text-transform: uppercase;
			letter-spacing: 0.15em;
			transition: all 0.3s;
			box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.4);
		}
		.btn-primary:hover {
			background: #4338ca;
			transform: scale(1.05);
			box-shadow: 0 20px 40px -5px rgba(79, 70, 229, 0.5);
		}
	}
`;

function PageTwo() {
	return (
		<div className="flex flex-col gap-16 px-6 py-12 lg:px-20">
			<style>{scopedCss}</style>

			<header className="flex flex-col gap-5 border-b border-slate-100 pb-12">
				<h1 className="text-5xl font-black tracking-tighter text-slate-900">
					Pattern <span className="text-indigo-600">Showcase</span>
				</h1>

				<p className="max-w-2xl text-xl/relaxed font-medium text-slate-500 italic">
					Visualizing decoupled component architecture using named slot maps, sub-component
					extraction, and declarative state orchestration.
				</p>
			</header>

			<main className="grid grid-cols-1 gap-12 xl:grid-cols-2">
				<SlotMapDemo />
				<SubComponentDemo />
				<SwitchPatternDemo />
			</main>
		</div>
	);
}

export { PageTwo };

type SectionHeaderProps = {
	align?: "left" | "right";
	color: "indigo" | "rose" | "teal";
	number: string;
	title: string;
};

function SectionHeader({ align = "left", color, number, title }: SectionHeaderProps) {
	const colorClasses = {
		indigo: "bg-indigo-600 shadow-indigo-100",
		rose: "bg-rose-500 shadow-rose-100",
		teal: "bg-teal-500 shadow-teal-100",
	};

	return (
		<div className={cnJoin("flex items-center gap-4", align === "right" && "text-right xl:justify-end")}>
			{align === "right" && (
				<h2 className="text-3xl font-black tracking-tight text-slate-900">{title}</h2>
			)}
			<span
				className={cnJoin(
					`flex size-10 items-center justify-center rounded-2xl text-sm font-black text-white
					shadow-xl`,
					colorClasses[color]
				)}
			>
				{number}
			</span>
			{align === "left" && (
				<h2 className="text-3xl font-black tracking-tight text-slate-900">{title}</h2>
			)}
		</div>
	);
}

const STATUS_OPTIONS = ["success", "loading", "error"] as const;

type StatusToggleProps = {
	onStatusChange: (status: StatusToggleProps["status"]) => void;
	status: (typeof STATUS_OPTIONS)[number];
};

function StatusToggle({ onStatusChange, status }: StatusToggleProps) {
	return (
		<ForWithWrapper
			as="div"
			className="flex gap-2 rounded-2xl bg-slate-100 p-1.5 shadow-inner"
			each={STATUS_OPTIONS}
			renderItem={(item) => (
				<button
					type="button"
					key={item}
					className={cnJoin(
						"rounded-xl px-6 py-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all",
						status === item ?
							"bg-white text-indigo-600 shadow-xl ring-1 shadow-indigo-50 ring-slate-200"
						:	"text-slate-400 hover:text-slate-600"
					)}
					onClick={() => onStatusChange(item)}
				>
					{item}
				</button>
			)}
		/>
	);
}

type FeatureCardSlotProps = GetSlotComponentProps<"content" | "footer" | "header">;

function FeatureCard({ children }: { children: React.ReactNode }) {
	const slots = getSlotMap<FeatureCardSlotProps>(children);

	return (
		// eslint-disable-next-line tailwindcss-better/no-unknown-classes
		<article className="feature-card group h-full">
			<header className="mb-12">{slots.header}</header>

			<main className="grow">{slots.content}</main>

			<footer className="mt-12 flex flex-col gap-10">
				<div
					className="h-px w-full bg-slate-100 transition-colors duration-500
						group-hover:bg-indigo-100"
				/>
				{slots.footer}
				<aside className="transition-all duration-500 group-hover:translate-x-1">
					{slots.default}
				</aside>
			</footer>
		</article>
	);
}
FeatureCard.Slot = createSlotComponent<FeatureCardSlotProps>();

function DashboardWidget({ children }: { children: React.ReactNode }) {
	const {
		regularChildren,
		slots: [headerSlot, contentSlot, footerSlot],
	} = getMultipleSlots(children, [WidgetHeader, WidgetContent, WidgetFooter]);

	return (
		// eslint-disable-next-line tailwindcss-better/no-unknown-classes
		<article className="widget-card h-full">
			<header className="group mb-12 flex items-center justify-between">
				{headerSlot}
				<button
					type="button"
					aria-label="Widget options"
					className="flex size-12 cursor-pointer items-center justify-center rounded-2xl bg-white
						text-slate-300 shadow-sm ring-1 ring-slate-100 transition-all group-hover:bg-slate-900
						group-hover:text-white group-hover:ring-slate-900 hover:scale-110 active:scale-90"
				>
					<svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2.5"
						/>
					</svg>
				</button>
			</header>

			<main className="grow">{contentSlot}</main>

			<footer className="mt-12 flex flex-col gap-8">
				{footerSlot}
				<aside
					className="border-t border-slate-50 pt-8 opacity-30 transition-opacity duration-700
						group-hover:opacity-100"
				>
					{regularChildren}
				</aside>
			</footer>
		</article>
	);
}

function WidgetHeader({ children }: { children: React.ReactNode }) {
	return children;
}
WidgetHeader.slotSymbol = Symbol("header");

function WidgetContent({ children }: { children: React.ReactNode }) {
	return children;
}
WidgetContent.slotSymbol = Symbol("content");

function WidgetFooter({ children }: { children: React.ReactNode }) {
	return children;
}
WidgetFooter.slotSymbol = Symbol("footer");

DashboardWidget.Header = WidgetHeader;
DashboardWidget.Content = WidgetContent;
DashboardWidget.Footer = WidgetFooter;

function SlotMapDemo() {
	return (
		<section className="flex flex-col gap-8">
			<SectionHeader number="01" color="indigo" title="Named Slot Mapping" />

			<FeatureCard>
				<FeatureCard.Slot name="header">
					<figure
						className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50
							text-indigo-600 ring-1 ring-indigo-200"
					>
						<svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								d="M13 10V3L4 14h7v7l9-11h-7z"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
							/>
						</svg>
					</figure>
				</FeatureCard.Slot>

				<FeatureCard.Slot name="content">
					<hgroup className="flex flex-col gap-2">
						<h3 className="text-3xl font-black tracking-tighter text-slate-900">
							Hypergate Analysis
						</h3>
						<p className="text-lg/relaxed font-medium text-slate-500">
							Analyze and scale your cluster nodes with zero-latency automated pipelines.
						</p>
					</hgroup>
				</FeatureCard.Slot>

				<FeatureCard.Slot name="footer">
					<div className="flex items-center justify-between">
						{/* eslint-disable-next-line tailwindcss-better/no-unknown-classes */}
						<button className="btn-primary" type="button" onClick={composedAction}>
							Exploit Edge
						</button>
						<p className="flex items-center gap-2">
							<span className="size-2 animate-pulse rounded-full bg-teal-500" />
							<span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
								Live Nodes: 4.2k
							</span>
						</p>
					</div>
				</FeatureCard.Slot>

				<aside
					className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-6
						text-sm font-medium text-slate-400 italic"
				>
					<svg className="size-5 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
						<path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z" />
					</svg>
					Default slot content automatically injected into the card aside.
				</aside>
			</FeatureCard>
		</section>
	);
}

function SubComponentDemo() {
	return (
		<section className="flex flex-col gap-8">
			<SectionHeader number="02" color="rose" title="Sub-Component Identity" align="right" />

			<DashboardWidget>
				<DashboardWidget.Header>
					<span className="flex gap-2">
						<span className="size-3 rounded-full bg-slate-200" />
						<span className="size-3 rounded-full bg-slate-200" />
						<span className="size-3 rounded-full bg-slate-200" />
					</span>
				</DashboardWidget.Header>

				<DashboardWidget.Content>
					<dl className="flex flex-col gap-6">
						<div className="flex items-baseline justify-between">
							<dt className="text-sm font-black tracking-widest text-slate-400 uppercase">
								Core Integrity
							</dt>
							<dd className="text-4xl font-black text-indigo-600">94.8%</dd>
						</div>
						<div
							className="h-3 w-full rounded-full bg-slate-100 shadow-inner"
							role="progressbar"
							aria-valuenow={94.8}
							aria-valuemin={0}
							aria-valuemax={100}
						>
							<div
								className="h-full w-[94.8%] rounded-full bg-linear-to-r from-indigo-600
									to-indigo-400 shadow-lg shadow-indigo-100"
							/>
						</div>
					</dl>
				</DashboardWidget.Content>

				<DashboardWidget.Footer>
					<p
						className="flex items-center justify-between text-xs font-black tracking-[0.2em]
							text-slate-400 uppercase"
					>
						<span>Cluster: Alpha-7</span>
						<span className="text-indigo-600">Syncing...</span>
					</p>
				</DashboardWidget.Footer>

				<p className="text-center text-xs font-medium text-slate-400">
					Sub-components allow for strict property validation and distinct internal rendering logic
					within the same parent.
				</p>
			</DashboardWidget>
		</section>
	);
}

function SwitchPatternDemo() {
	const [status, setStatus] = useState<"error" | "loading" | "success">("success");

	return (
		<section className="flex flex-col gap-10 xl:col-span-2">
			<div className="flex items-center justify-between border-t border-slate-100 pt-16">
				<SectionHeader number="03" color="teal" title="Show Pattern States" />

				<StatusToggle status={status} onStatusChange={setStatus} />
			</div>

			<figure
				className="relative overflow-hidden rounded-[4rem] border-2 border-dashed border-slate-200
					bg-slate-50/50 p-12 shadow-2xl shadow-slate-200/50 lg:p-24"
			>
				<Switch.Root>
					<Switch.Match when={status === "success"}>
						<output
							className="flex animate-in flex-col items-center gap-8 text-center duration-700
								zoom-in-95 fade-in"
						>
							<span
								className="flex size-24 items-center justify-center rounded-full bg-teal-100
									text-teal-600 shadow-2xl shadow-teal-100"
							>
								<svg className="size-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.5"
									/>
								</svg>
							</span>

							<hgroup className="flex flex-col gap-3">
								<h3 className="text-4xl font-black tracking-tight text-slate-900">
									Consensus Reached
								</h3>
								<p className="max-w-md text-lg/relaxed font-medium text-slate-500">
									Secure tunnel created successfully. Your local node is now synchronized with the
									global hypergate.
								</p>
							</hgroup>
						</output>
					</Switch.Match>

					<Switch.Match when={status === "loading"}>
						<output
							className="flex animate-in flex-col items-center gap-10 py-10 duration-300 fade-in"
						>
							<div className="relative flex size-24">
								<span
									className="absolute inset-0 size-full animate-ping rounded-full
										bg-indigo-500/10"
								/>

								<span
									className="flex size-full items-center justify-center rounded-full bg-white
										shadow-2xl ring-8 ring-slate-50"
								>
									<span
										className="size-10 animate-spin rounded-full border-4 border-slate-100
											border-t-indigo-600"
									/>
								</span>
							</div>
							<p className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase">
								Calibrating Core Modules
							</p>
						</output>
					</Switch.Match>

					<Switch.Match when={status === "error"}>
						<output
							className="flex animate-in flex-col items-center gap-8 text-center duration-700
								fade-in slide-in-from-top-6"
						>
							<span
								className="flex size-24 items-center justify-center rounded-[2.5rem] bg-rose-50
									text-rose-500 shadow-2xl ring-2 shadow-rose-100 ring-rose-100"
							>
								<svg className="size-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.5"
									/>
								</svg>
							</span>
							<hgroup className="flex flex-col gap-2">
								<h3 className="text-2xl font-black text-slate-900">Uplink Terminated</h3>
								<p className="max-w-md text-lg/relaxed font-medium text-slate-500 opacity-80">
									Handshake timeout: The target security gateway rejected the incoming packet
									signature.
								</p>
							</hgroup>
						</output>
					</Switch.Match>
				</Switch.Root>
			</figure>
		</section>
	);
}
