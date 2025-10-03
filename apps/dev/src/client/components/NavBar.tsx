import { lockScroll } from "@zayne-labs/toolkit-core";
import { useToggle } from "@zayne-labs/toolkit-react";
import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { Presence } from "@zayne-labs/ui-react/common/presence";
import { twJoin, twMerge } from "tailwind-merge";
import { dashboardLinkItems } from "./constants";

export function NavBar() {
	const [isNavShow, toggleNavShow] = useToggle(false);

	const handleToggleNavShow = () => {
		const newIsNavShow = !isNavShow;

		lockScroll({ lock: newIsNavShow });

		toggleNavShow(newIsNavShow);
	};

	return (
		<header
			className={twJoin(
				`flex h-[70px] flex-col bg-blue-600 px-(--padding-value) [--padding-value:--spacing(5)]
				max-md:sticky max-md:inset-[0_0_auto_0] max-md:z-100 max-md:justify-center md:h-[140px]
				md:bg-white md:px-9`,
				isNavShow && "w-svw pr-[calc(var(--padding-value)+var(--scrollbar-padding))]"
			)}
		>
			<DesktopNavContent className="max-md:hidden" />

			<MobileNavigation
				className="md:hidden"
				isNavShow={isNavShow}
				toggleNavShow={handleToggleNavShow}
			/>

			<button type="button" className="z-10 w-fit text-white md:hidden" onClick={handleToggleNavShow}>
				{isNavShow ? "close" : "open"}
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
		<section className={twMerge("flex h-full items-end justify-between pb-6", className)}>
			<header>
				<h1 className="text-[32px] font-semibold">Hi, Admin!</h1>

				<p className="text-[20px] font-medium">Welcome back, Ma'am</p>
			</header>

			<div className="flex items-center gap-6">
				<span className="block size-[70px] shrink-0 rounded-full bg-[hsl(0,0%,85%)]" />
			</div>
		</section>
	);
}

function MobileNavigation(props: MobileNavProps) {
	const { className, isNavShow, toggleNavShow } = props;

	return (
		<Presence present={isNavShow} variant="transition">
			{(ctx) => (
				<section
					className={twMerge(
						`fixed inset-[0_auto_0_0] mt-[70px] scrollbar-hidden overflow-x-hidden bg-blue-900 pt-1
						text-white transition-[width] ease-in-out`,
						ctx.shouldStartTransition ? "w-(--nav-width) duration-500" : "w-0 duration-350",
						// isNavShow ? "w-(--nav-width) animate-nav-show" : "w-0 animate-nav-close",
						className
					)}
					onClick={(event) => {
						const element = event.target as HTMLElement;

						element.tagName === "A" && toggleNavShow();
					}}
				>
					<ForWithWrapper
						as="nav"
						className="flex flex-col gap-9 px-5 text-nowrap"
						each={dashboardLinkItems}
						renderItem={(item) => (
							<a
								key={item.label}
								className="flex items-center gap-3 rounded-r-[8px] pl-4.5
									data-[active=true]:h-[43px] data-[active=true]:bg-blue-500"
							>
								{item.label}
							</a>
						)}
					/>
				</section>
			)}
		</Presence>
	);
}
