import { Icon } from "@iconify/react";
import { useToggle } from "@zayne-labs/toolkit-react";
import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { Presence } from "@zayne-labs/ui-react/common/presence";
import { cnMerge } from "../lib/utils/cn";
import { dashboardLinkItems } from "./constants";

export function NavBar() {
	const [isNavShow, toggleNavShow] = useToggle(false);

	return (
		<header
			className={cnMerge(
				`flex h-17.5 flex-col bg-indigo-600 px-6 max-md:sticky max-md:top-0 max-md:z-50
				max-md:justify-center md:h-30 md:border-b md:border-slate-100 md:bg-white md:px-10
				md:shadow-xs`
			)}
		>
			<DesktopNavContent className="max-md:hidden" />

			<MobileNavigation className="md:hidden" isNavShow={isNavShow} toggleNavShow={toggleNavShow} />

			<button
				type="button"
				className="z-50 flex w-fit items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 text-xs
					font-black tracking-widest text-white uppercase transition-all active:scale-95 md:hidden"
				onClick={toggleNavShow}
			>
				<Icon icon={isNavShow ? "lucide:x" : "lucide:menu"} className="size-4" />
				{isNavShow ? "Close" : "Menu"}
			</button>
		</header>
	);
}

type MobileNavProps = {
	className?: string;
	isNavShow: boolean;
	toggleNavShow: () => void;
};

function DesktopNavContent(props: { className?: string }) {
	const { className } = props;

	return (
		<section className={cnMerge("flex h-full items-end justify-between pb-8", className)}>
			<header className="flex flex-col gap-1">
				<h1 className="text-[32px] leading-none font-black tracking-tight text-slate-900">
					Hi, Admin!
				</h1>
				<p className="text-xl font-medium text-slate-500 italic">Welcome back to the dashboard.</p>
			</header>

			<div className="flex items-center gap-6">
				<div className="flex flex-col items-end">
					<span className="text-sm/tight font-bold text-slate-900">Dev Account</span>
					<span className="text-[10px] font-black tracking-widest text-indigo-500 uppercase">
						Administrator
					</span>
				</div>
				<span
					className="block size-15 shrink-0 rounded-2xl bg-indigo-600 shadow-xl ring-4
						shadow-indigo-100 ring-white"
				/>
			</div>
		</section>
	);
}

function MobileNavigation(props: MobileNavProps) {
	const { className, isNavShow, toggleNavShow } = props;
	const currentPath = globalThis.location.pathname;

	return (
		<Presence
			present={isNavShow}
			variant="transition"
			className={cnMerge(
				`z-40 transition-[width] duration-500 ease-in-out data-[transition-phase=enter]:w-(--nav-width)
				data-[transition-phase=exit]:w-0 data-[transition-phase=exit]:duration-350`
			)}
		>
			<section
				className={cnMerge(
					`fixed inset-y-0 left-0 mt-17.5 scrollbar-hidden overflow-x-auto border-r border-white/5
					bg-slate-900/95 pt-8 text-white shadow-2xl backdrop-blur-xl`,
					className
				)}
				onClick={(event) => {
					const element = event.target as HTMLElement;
					element.closest("a") && toggleNavShow();
				}}
			>
				<header className="px-8">
					<div className="flex h-px w-8 bg-indigo-500" />
					<p className="mt-6 text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">
						Workspace
					</p>
				</header>

				<ForWithWrapper
					as="nav"
					className="mt-8 flex flex-col gap-1.5 px-4 text-nowrap"
					each={dashboardLinkItems}
					renderItem={(item) => {
						const isActive = currentPath === item.link;
						return (
							<a
								key={item.label}
								href={item.link ?? "#"}
								className={cnMerge(
									`group flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold
									transition-all duration-300`,
									isActive ?
										"bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/20 active:scale-95"
									:	"text-white/50 hover:bg-white/5 hover:text-white"
								)}
							>
								<Icon
									icon={item.icon}
									className={cnMerge(
										"size-5.5 transition-transform duration-300 group-hover:scale-110",
										isActive ? "text-white" : "text-white/20"
									)}
								/>
								<span className="relative">
									{item.label}
									{isActive && (
										<span
											className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full
												bg-white/30"
										/>
									)}
								</span>
							</a>
						);
					}}
				/>

				<hr className="mt-12 border-t border-white/5" />

				<footer className="flex items-center gap-3 p-8 opacity-40">
					<span className="size-2 animate-pulse rounded-full bg-emerald-500" />
					<p className="text-[10px] font-bold tracking-widest uppercase">Live System</p>
				</footer>
			</section>
		</Presence>
	);
}
