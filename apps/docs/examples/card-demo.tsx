"use client";

import { For } from "@zayne-labs/ui-react/common/for";
import { Card } from "@zayne-labs/ui-react/ui/card";
import { Briefcase, Globe, Plus, Settings, Shield, Users, Zap, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cnJoin } from "@/lib/utils/cn";

const FEATURES = [
	{
		description: "Configure system-wide settings and preferences.",
		icon: Settings,
		title: "Account Settings",
	},
	{
		description: "Manage your team members and their roles.",
		icon: Users,
		title: "Team Overview",
	},
	{
		description: "View and manage all active projects and tasks.",
		icon: Briefcase,
		title: "Project Board",
	},
] as const;

function CardDemo() {
	const [selectedFeature, setSelectedFeature] = useState(0);

	return (
		<section className="flex w-full max-w-4xl flex-col gap-6 lg:flex-row lg:items-start">
			<ProfileCard />

			<div className="flex flex-1 flex-col gap-4">
				<header className="flex items-center justify-between px-2">
					<h4
						className="text-[11px] font-black tracking-[0.2em] text-fd-muted-foreground uppercase
							opacity-60"
					>
						Management Console
					</h4>
					<Globe className="size-4 text-fd-muted-foreground/30" />
				</header>

				<nav className="flex flex-col gap-3">
					<For
						each={FEATURES}
						renderItem={(feature, index) => (
							<FeatureItem
								key={index}
								{...feature}
								isActive={selectedFeature === index}
								onClick={() => setSelectedFeature(index)}
							/>
						)}
					/>
				</nav>
			</div>
		</section>
	);
}

export default CardDemo;

function ProfileCard() {
	return (
		<Card.Root
			className="w-full flex-1 rounded-[2.5rem] border border-fd-border bg-fd-card/40 p-8 shadow-2xl
				backdrop-blur-xl transition-all duration-500 hover:shadow-fd-primary/5 lg:max-w-md"
		>
			<Card.Header className="flex items-start justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="relative shrink-0">
						<img
							src="https://images.unsplash.com/photo-1517841905240-472988babdf9"
							alt="Sarah Anderson"
							className="size-16 rounded-[1.25rem] object-cover shadow-2xl ring-4
								ring-fd-background"
						/>
						<span
							className="absolute -right-1 -bottom-1 size-4 rounded-full border-2
								border-fd-background bg-emerald-500"
						/>
					</div>

					<div className="flex flex-col">
						<Card.Title className="text-xl font-black tracking-tight text-fd-foreground">
							Sarah Anderson
						</Card.Title>
						<Card.Description className="text-xs font-bold tracking-widest text-fd-primary uppercase">
							Tech Lead • Design Ops
						</Card.Description>
					</div>
				</div>

				<Button
					theme="glow"
					size="icon"
					className="rounded-2xl shadow-lg transition-transform hover:scale-110 active:scale-95"
					aria-label="Add to team"
				>
					<Plus className="size-5" />
				</Button>
			</Card.Header>

			<Card.Content className="mt-8 flex flex-col gap-6">
				<p className="text-[15px] leading-relaxed font-medium text-fd-muted-foreground italic">
					"Creating digital experiences that bridge the gap between human emotion and technical
					precision."
				</p>

				<div className="grid grid-cols-2 gap-3">
					<StatBlock color="primary" icon={Zap} label="Velocity" value="94%" />
					<StatBlock color="emerald" icon={Shield} label="Stability" value="99.9%" />
				</div>
			</Card.Content>

			<Card.Footer className="mt-8 grid grid-cols-3 border-t border-fd-border/40 pt-6">
				<FooterStat label="Endorsements" value="1.8k" />
				<FooterStat className="border-x border-fd-border/40" label="Deployments" value="42" />
				<FooterStat label="Patents" value="12" />
			</Card.Footer>
		</Card.Root>
	);
}

function StatBlock(props: {
	color: "emerald" | "primary";
	icon: LucideIcon;
	label: string;
	value: string;
}) {
	const { color, icon: Icon, label, value } = props;

	const colorClasses = {
		emerald: "bg-emerald-500/5 ring-emerald-500/10 text-emerald-500",
		primary: "bg-fd-primary/5 ring-fd-primary/10 text-fd-primary",
	};

	return (
		<div className={cnJoin("flex items-center gap-3 rounded-2xl p-3 ring-1", colorClasses[color])}>
			<div className={cnJoin("flex size-8 items-center justify-center rounded-xl bg-current/10")}>
				<Icon className="size-4" />
			</div>
			<div className="flex flex-col">
				<span
					className="text-[10px] font-black tracking-wider text-fd-muted-foreground uppercase
						opacity-60"
				>
					{label}
				</span>
				<span className="text-sm font-bold text-fd-foreground">{value}</span>
			</div>
		</div>
	);
}

function FooterStat({ className, label, value }: { className?: string; label: string; value: string }) {
	return (
		<div className={cnJoin("flex flex-col items-center gap-1", className)}>
			<span className="text-lg font-black text-fd-foreground">{value}</span>
			<span
				className="text-[9px] font-black tracking-widest text-fd-muted-foreground uppercase opacity-60"
			>
				{label}
			</span>
		</div>
	);
}

function FeatureItem({
	description,
	icon: Icon,
	isActive,
	onClick,
	title,
}: {
	description: string;
	icon: LucideIcon;
	isActive: boolean;
	onClick: () => void;
	title: string;
}) {
	return (
		<Card.Root
			as="button"
			type="button"
			onClick={onClick}
			className={cnJoin(
				`group relative w-full overflow-hidden rounded-[24px] border p-4 text-left transition-all
				duration-300`,
				isActive ?
					"border-fd-primary/50 bg-fd-primary/5 shadow-lg shadow-fd-primary/5 lg:scale-[1.02]"
				:	"border-fd-border bg-fd-card/20 hover:border-fd-primary/30 hover:bg-fd-primary/5"
			)}
		>
			<div className="flex items-center gap-4">
				<div
					className={cnJoin(
						`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors
						duration-300`,
						isActive ?
							"bg-fd-primary text-fd-primary-foreground"
						:	`bg-fd-muted/30 text-fd-muted-foreground group-hover:bg-fd-primary/20
							group-hover:text-fd-primary`
					)}
				>
					<Icon className="size-5" />
				</div>
				<div className="flex flex-col">
					<Card.Title
						className={cnJoin(
							"text-sm font-black tracking-tight transition-colors",
							isActive ? "text-fd-foreground" : "text-fd-foreground/70"
						)}
					>
						{title}
					</Card.Title>
					<Card.Description className="mt-0.5 line-clamp-1 text-[11px] font-medium opacity-60">
						{description}
					</Card.Description>
				</div>
			</div>
			{isActive && (
				<div className="absolute inset-y-0 right-0 w-1 animate-in bg-fd-primary slide-in-from-right" />
			)}
		</Card.Root>
	);
}
