import Image from "next/image";
import { cnMerge } from "@/lib/utils/cn";

export function ZayneLogo(props: { className?: string }) {
	const { className } = props;

	return (
		<Image
			src="/logo.png"
			alt="Zayne UI Logo"
			width={20}
			height={20}
			className={cnMerge("size-5", className)}
		/>
	);
}

export function ZayneLogoFull(props: { className?: string }) {
	const { className } = props;

	return (
		<div className={cnMerge("flex items-center gap-3", className)}>
			<ZayneLogo className="size-5" />

			<p className="text-xl font-bold tracking-tight text-fd-foreground">
				Zayne <span className="text-fd-primary">UI</span>
			</p>
		</div>
	);
}
