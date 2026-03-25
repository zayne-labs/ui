import { css } from "@zayne-labs/toolkit-core";
import {
	composeEventHandlers,
	createSlotComponent,
	getMultipleSlots,
	getSlotMap,
	type GetSlotComponentProps,
} from "@zayne-labs/toolkit-react/utils";
import { Show } from "@zayne-labs/ui-react/common/show";

const onClick = composeEventHandlers();

function PageTwo() {
	return (
		<div className="flex flex-col gap-12">
			<style>{scopedCss}</style>

			<header className="flex flex-col gap-4">
				<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Slots & Show Pattern</h1>
				<p className="text-slate-500">
					Testing complex component decomposition with slot-based architecture and conditional
					rendering.
				</p>
			</header>

			{/* eslint-disable-next-line tailwindcss-better/no-unknown-classes */}
			<section className="wrapper-section">
				<ParentOne>
					<ParentOne.Slot name="header">
						<div className="font-bold text-indigo-600">ParentOne Header</div>
					</ParentOne.Slot>

					<ParentOne.Slot name="content">
						Standard content using the <code>getSlotMap</code> utility.
					</ParentOne.Slot>

					<ParentOne.Slot name="footer">
						<span className="text-xs tracking-widest text-slate-400 uppercase">Section Footer</span>
					</ParentOne.Slot>

					<p className="text-sm text-slate-400 italic">Default Slot Content (Auto-filled)</p>
				</ParentOne>

				<ParentTwo>
					<ParentTwo.Header>
						<span className="font-black text-rose-500">Modern Header Slot</span>
					</ParentTwo.Header>

					<ParentTwo.Content>
						Multi-slot extraction via <code>getMultipleSlots</code>.
					</ParentTwo.Content>

					<ParentTwo.Footer>
						<div className="flex items-center gap-4">
							<div className="size-2 rounded-full bg-slate-200" />
							<div className="size-2 rounded-full bg-slate-200" />
						</div>
					</ParentTwo.Footer>

					<p className="text-sm text-slate-400 italic">Regular Children Rendering</p>
				</ParentTwo>
			</section>

			<Show.Root control="content">
				<Show.Content when={false}>
					<button type="button" onClick={onClick}>
						Hidden Action
					</button>
				</Show.Content>
			</Show.Root>
		</div>
	);
}

export { PageTwo };

type SlotComponentProps =
	| GetSlotComponentProps<"content">
	| GetSlotComponentProps<"footer">
	| GetSlotComponentProps<"header">;

function ParentOne(props: { children: React.ReactNode }) {
	const { children } = props;

	const slots = getSlotMap<SlotComponentProps>(children);

	return (
		// eslint-disable-next-line tailwindcss-better/no-unknown-classes
		<section className="slot-container">
			<h2>Parent One</h2>

			<header>{slots.header}</header>
			<p>{slots.content}</p>
			<footer>{slots.footer}</footer>

			<aside id="default-slots">{slots.default}</aside>
		</section>
	);
}

ParentOne.Slot = createSlotComponent<SlotComponentProps>();

function ParentTwo(props: { children: React.ReactNode }) {
	const { children } = props;

	const {
		regularChildren,
		slots: [headerSlot, contentSlot, footerSlot],
	} = getMultipleSlots(children, [ParentTwoHeader, ParentTwoContent, ParentTwoFooter]);

	return (
		// eslint-disable-next-line tailwindcss-better/no-unknown-classes
		<section className="slot-container">
			<h2>Parent Two</h2>

			<header>{headerSlot}</header>
			<p>{contentSlot}</p>
			<footer>{footerSlot}</footer>

			<aside id="default-slots">{regularChildren}</aside>
		</section>
	);
}

ParentTwo.Header = ParentTwoHeader;
ParentTwo.Content = ParentTwoContent;
ParentTwo.Footer = ParentTwoFooter;

function ParentTwoHeader(props: { children: React.ReactNode }) {
	const { children } = props;

	return <em>{children}</em>;
}
ParentTwoHeader.slotSymbol = Symbol("header");

function ParentTwoContent(props: { children: React.ReactNode }) {
	const { children } = props;

	return <em>{children}</em>;
}
ParentTwoContent.slotSymbol = Symbol("content");

function ParentTwoFooter(props: { children: React.ReactNode }) {
	const { children } = props;

	return <em>{children}</em>;
}
ParentTwoFooter.slotSymbol = Symbol("footer");

const scopedCss = css`
	@scope {
		:scope {
			max-width: 1200px;
		}

		.wrapper-section {
			display: flex;
			flex-direction: column;
			gap: 3rem;
		}

		.slot-container {
			border: 1px solid #e2e8f0;
			background: white;
			text-align: center;
			border-radius: 1rem;
			padding: 2rem;
			box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);

			h2 {
				font-size: 1.7rem;
				font-weight: 600;
			}

			header {
				color: #2d3748;
				margin-bottom: 1rem;
			}

			footer {
				color: #718096;
				margin-top: 1rem;
				padding-top: 1rem;
				border-top: 1px solid #e2e8f0;
			}

			p {
				color: #4a5568;
				line-height: 1.5;
				margin: 1rem 0;
			}
		}

		aside#default-slots {
			margin-top: 1.5rem;
			padding: 1rem;
			background-color: #f7fafc;
			border-radius: 0.375rem;
		}

		button {
			background-color: #4299e1;
			color: white;
			padding: 0.5rem 1rem;
			border-radius: 0.375rem;
			font-weight: 500;
			margin-top: 2rem;
			transition: background-color 0.2s;

			&:hover {
				background-color: #3182ce;
			}
		}
	}
`;
