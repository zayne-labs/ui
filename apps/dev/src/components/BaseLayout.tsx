import { Icon } from "@iconify/react";
import { useLocationState } from "@zayne-labs/toolkit-react";
import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { cnJoin } from "../lib/utils/cn";

type DevLayoutProps = {
	children: React.ReactNode;
};

const navItems = [
	{ icon: "lucide:home", label: "Overview", path: "/one" },
	{ icon: "lucide:layers", label: "Slots & Show", path: "/two" },
	{ icon: "lucide:github", label: "GitHub Repos", path: "/three" },
	{ icon: "lucide:id-card", label: "Profile Card", path: "/four" },
	{ icon: "lucide:navigation", label: "Navigation Bar", path: "/five" },
	{ icon: "lucide:send", label: "Teleportation", path: "/six" },
	{ icon: "lucide:mouse-pointer-2", label: "Drag Scroll", path: "/seven" },
] as const;

export function BaseLayout({ children }: DevLayoutProps) {
	return (
		<div className="flex min-h-svh bg-slate-50 font-sans text-slate-900">
			<Sidebar />

			<main className="relative ml-64 min-h-svh grow overflow-hidden">
				<div
					className="absolute top-[-10%] right-[-10%] size-[500px] rounded-full bg-indigo-100/30
						blur-[120px]"
				/>
				<div
					className="absolute bottom-[-10%] left-[-10%] size-[500px] rounded-full bg-violet-100/30
						blur-[120px]"
				/>

				<div className="relative isolate z-10 flex justify-center p-8">
					<div className="max-w-6xl grow">{children}</div>
				</div>
			</main>
		</div>
	);
}

function Sidebar() {
	const [pathname, actions] = useLocationState((state) => state.pathname);

	return (
		<aside
			className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-slate-200 bg-white/80
				backdrop-blur-md"
		>
			<div className="flex flex-col gap-8 py-8">
				<div className="flex items-center gap-3 px-7">
					<img
						src="https://raw.githubusercontent.com/zayne-labs/ui/refs/heads/main/apps/docs/public/logo.png"
						alt="Zayne UI logo"
						className="size-5 rounded-sm shadow-lg shadow-indigo-100"
					/>
					<p className="text-xl font-black tracking-tight text-slate-900">Zayne UI Dev</p>
				</div>

				<ForWithWrapper
					as="nav"
					className="flex flex-col gap-1 px-4"
					each={navItems}
					renderItem={(item) => {
						const isActive = pathname === item.path || (item.path === "/one" && pathname === "/");

						return (
							<button
								key={item.path}
								type="button"
								onClick={() => {
									actions.push(item.path);
								}}
								className={cnJoin(
									`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm
									font-semibold transition-all duration-200`,
									isActive ?
										"bg-indigo-600 text-white shadow-lg shadow-indigo-100"
									:	"text-slate-500 hover:bg-slate-100 hover:text-slate-900"
								)}
							>
								<span className="inline-block size-4.5">
									<Icon
										icon={item.icon}
										className={cnJoin(
											"size-full transition-transform group-hover:scale-110",
											isActive ? "text-white" : "text-slate-400"
										)}
									/>
								</span>
								{item.label}
								{isActive && (
									<div className="absolute -left-1 h-5 w-1 rounded-full bg-indigo-600" />
								)}
							</button>
						);
					}}
				/>
			</div>

			<div className="mt-auto border-t border-slate-100 p-4">
				<div
					className="flex items-center gap-3 px-3 py-2 text-xs font-semibold tracking-wider
						text-slate-400 uppercase"
				>
					Environment
				</div>
				<div className="flex items-center gap-2 px-3 py-2">
					<div className="size-2 animate-pulse rounded-full bg-emerald-500" />
					<span className="text-xs font-medium text-slate-500 italic">Development Mode</span>
				</div>
			</div>
		</aside>
	);
}
