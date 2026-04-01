"use client";

import { For } from "@zayne-labs/ui-react/common/for";
import { Presence } from "@zayne-labs/ui-react/common/presence";
import { AlertCircle, CheckCircle, Info, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cnJoin } from "@/lib/utils/cn";

const NOTIFICATIONS = {
	alert: {
		className: "border-rose-500/20 bg-rose-500/10 dark:bg-rose-500/5",
		description: "Resource access denied. Please verify credentials.",
		icon: AlertCircle,
		iconBg: "bg-rose-500/20",
		iconText: "text-rose-500",
		label: "System Alert",
		statusColor: "bg-rose-500",
		tag: "Critical",
	},
	info: {
		className: "border-sky-500/20 bg-sky-500/10 dark:bg-sky-500/5",
		description: "A new firmware update is available for your device.",
		icon: Info,
		iconBg: "bg-sky-500/20",
		iconText: "text-sky-500",
		label: "Notice",
		statusColor: "bg-sky-500",
		tag: "Update",
	},
	success: {
		className: "border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-500/5",
		description: "Data synchronized across all nodes successfully.",
		icon: CheckCircle,
		iconBg: "bg-emerald-500/20",
		iconText: "text-emerald-500",
		label: "Operation Complete",
		statusColor: "bg-emerald-500",
		tag: "Success",
	},
} as const;

type NotificationType = keyof typeof NOTIFICATIONS;
type NotificationConfig = (typeof NOTIFICATIONS)[NotificationType];

function PresenceDemo() {
	const [activeType, setActiveType] = useState<NotificationType | null>("success");

	return (
		<section className="flex w-full max-w-md flex-col gap-8 py-4">
			<nav className="flex flex-wrap gap-2">
				<For
					each={["alert", "info", "success"] as const}
					renderItem={(type) => (
						<Button
							key={type}
							theme="outline"
							size="sm"
							onClick={() => setActiveType((prev) => (prev === type ? null : type))}
							className={cnJoin(
								"rounded-full px-4 font-bold capitalize transition-all",
								activeType === type && "bg-fd-foreground text-fd-background"
							)}
						>
							{type}
						</Button>
					)}
				/>
			</nav>

			<div className="relative min-h-40">
				<For
					each={["alert", "info", "success"] as const}
					renderItem={(type) => (
						<Presence key={type} present={activeType === type}>
							<NotificationCard config={{ ...NOTIFICATIONS[type], type }} onClose={() => setActiveType(null)} />
						</Presence>
					)}
				/>

				{!activeType && <EmptyState />}
			</div>
		</section>
	);
}

export default PresenceDemo;

type NotificationCardProps = {
	config: NotificationConfig & { type: NotificationType };
	onClose: () => void;
};

function NotificationCard(props: NotificationCardProps) {
	const { config, onClose } = props;
	const { className, description, icon: Icon, iconBg, iconText, label, statusColor, tag } = config;

	return (
		<article
			className={cnJoin(
				"absolute inset-x-0 top-0 flex grow flex-col gap-4 overflow-x-hidden rounded-3xl border p-6",
				"animate-in shadow-2xl backdrop-blur-xl duration-500 fade-in slide-in-from-top-4",
				"data-[animation-phase=exit]:animate-out data-[animation-phase=exit]:fade-out",
				"data-[animation-phase=exit]:slide-out-to-bottom-4",
				className
			)}
		>
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div
						className={cnJoin(
							"flex size-10 items-center justify-center rounded-2xl",
							iconBg,
							iconText
						)}
					>
						<Icon className="size-5" />
					</div>
					<div className="flex flex-col">
						<h3 className="text-sm font-black tracking-tight text-fd-foreground uppercase">
							{label}
						</h3>
						<p className="text-[10px] font-black tracking-widest text-fd-muted-foreground uppercase">
							{tag}
						</p>
					</div>
				</div>
				<Button
					theme="ghost"
					size="icon-xs"
					onClick={onClose}
					className="rounded-full text-fd-muted-foreground transition-colors hover:bg-fd-muted"
					aria-label="Close"
				>
					<X className="size-4" />
				</Button>
			</header>

			<p className="text-[14px] leading-relaxed font-bold text-fd-foreground/90">{description}</p>

			<footer className="mt-1 flex items-center gap-1.5">
				<div className={cnJoin("size-1.5 animate-pulse rounded-full", statusColor)} />
				<span className="text-[10px] font-black tracking-wider text-fd-muted-foreground uppercase opacity-60">
					Handled via Presence
				</span>
			</footer>

			<span
				className="absolute inset-0 -z-10 inline-block -translate-x-full animate-shimmer bg-linear-to-r
					from-transparent via-fd-foreground/5 to-transparent"
			/>
		</article>
	);
}

function EmptyState() {
	return (
		<div
			className="flex animate-in flex-col items-center justify-center gap-4 py-8 duration-500 zoom-in-95
				fade-in"
		>
			<div className="flex size-14 items-center justify-center rounded-3xl bg-fd-muted/30">
				<Sparkles className="size-6 text-fd-muted-foreground/30" />
			</div>
			<p className="text-xs font-bold tracking-wide text-fd-muted-foreground/50 uppercase">
				Select a notification type above
			</p>
		</div>
	);
}
