"use client";

import { For } from "@zayne-labs/ui-react/common/for";
import { Card } from "@zayne-labs/ui-react/ui/card";
import { useState } from "react";
import { cnJoin } from "@/lib/utils/cn";

export default function CardDemo() {
	const [selectedCard, setSelectedCard] = useState<number>(0);

	return (
		<div className="flex w-full max-w-3xl flex-col gap-4 lg:flex-row">
			<Card.Root
				className="w-full rounded-2xl border border-fd-border bg-fd-card/40 p-6 shadow-xl
					backdrop-blur-xl lg:max-w-xs"
			>
				<Card.Header className="flex items-center gap-3">
					<img
						src="https://images.unsplash.com/photo-1517841905240-472988babdf9"
						alt="Sarah Anderson"
						className="size-12 rounded-xl object-cover shadow-sm ring-2 ring-fd-background"
					/>
					<div className="grow">
						<Card.Title className="text-base font-bold">Sarah Anderson</Card.Title>
						<Card.Description className="text-xs font-medium">Product Designer</Card.Description>
					</div>
					<Card.Action
						className="flex size-8 items-center justify-center rounded-lg bg-fd-primary
							text-fd-primary-foreground shadow-lg transition-all hover:bg-fd-primary/90
							active:scale-95"
					>
						<svg
							className="size-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2.5}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
					</Card.Action>
				</Card.Header>
				<Card.Content className="mt-4">
					<p className="text-sm text-fd-muted-foreground">
						Creating beautiful interfaces that bring joy to users and push creative boundaries.
					</p>
				</Card.Content>
				<Card.Footer className="mt-5 grid grid-cols-3 border-t border-fd-border pt-4 text-center">
					<div className="flex flex-col gap-0.5">
						<span className="text-base font-bold text-fd-foreground">1.2k</span>
						<span className="text-[9px] font-bold tracking-widest text-fd-muted-foreground uppercase">
							Followers
						</span>
					</div>
					<div className="flex flex-col gap-0.5">
						<span className="text-base font-bold text-fd-foreground">234</span>
						<span className="text-[9px] font-bold tracking-widest text-fd-muted-foreground uppercase">
							Following
						</span>
					</div>
					<div className="flex flex-col gap-0.5">
						<span className="text-base font-bold text-fd-foreground">42</span>
						<span className="text-[9px] font-bold tracking-widest text-fd-muted-foreground uppercase">
							Projects
						</span>
					</div>
				</Card.Footer>
			</Card.Root>

			<div className="flex grow flex-col justify-center gap-3">
				<For
					each={3}
					renderItem={(num) => (
						<Card.Root
							key={num}
							as="button"
							type="button"
							onClick={() => setSelectedCard(num)}
							className={cnJoin(
								"group w-full rounded-lg border p-3 text-left transition-all",
								selectedCard === num ?
									"border-fd-primary bg-fd-primary/10 shadow-sm backdrop-blur-sm"
								:	`border-fd-border bg-fd-card/30 backdrop-blur-sm hover:border-fd-primary/50
									hover:bg-fd-primary/5`
							)}
						>
							<Card.Title
								className={cnJoin(
									"text-sm font-semibold transition-colors",
									selectedCard === num ? "text-fd-primary" : (
										"text-fd-foreground group-hover:text-fd-primary"
									)
								)}
							>
								Feature {num + 1}
							</Card.Title>
							<Card.Description className="mt-0.5 text-xs">
								Click to select this option
							</Card.Description>
						</Card.Root>
					)}
				/>
			</div>
		</div>
	);
}
