/* eslint-disable tailwindcss-better/no-unregistered-classes */
import { css } from "@zayne-labs/toolkit-core";
import {
	composeEventHandlers,
	createSlotComponent,
	type GetSlotComponentProps,
	getMultipleSlots,
	getSlotMap,
} from "@zayne-labs/toolkit-react/utils";
import { Show } from "@zayne-labs/ui-react/common/show";

const onClick = composeEventHandlers();

function AppTwo() {
	return (
		<main>
			<style>{scopedCss}</style>

			<section className="wrapper-section">
				<ParentOne>
					<ParentOne.Slot name="header">ParentOne Header</ParentOne.Slot>

					<ParentOne.Slot name="content">ParentOne Content</ParentOne.Slot>

					<ParentOne.Slot name="footer">ParentOne Footer</ParentOne.Slot>

					<p>This is a default Slot under Parent One</p>
				</ParentOne>

				<ParentTwo>
					<ParentTwo.Header>ParentTwo Header</ParentTwo.Header>

					<ParentTwo.Content>ParentTwo Content</ParentTwo.Content>

					<ParentTwo.Footer>ParentTwo Footer</ParentTwo.Footer>

					<p>This is a default Slot under Parent Two</p>
				</ParentTwo>
			</section>

			<Show.Root control="content">
				<Show.Content when={false}>
					<button type="button" onClick={onClick}>
						Click me
					</button>
				</Show.Content>

				{/* <Show.Fallback>
					<p>Default content</p>
				</Show.Fallback> */}
			</Show.Root>
		</main>
	);
}

export default AppTwo;

type SlotComponentProps =
	| GetSlotComponentProps<"content">
	| GetSlotComponentProps<"footer">
	| GetSlotComponentProps<"header">;

function ParentOne(props: { children: React.ReactNode }) {
	const { children } = props;

	const slots = getSlotMap<SlotComponentProps>(children);

	return (
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
			padding: 2rem;
			max-width: 1200px;
			margin: 0 auto;
		}

		.wrapper-section {
			display: flex;
			flex-direction: column;
			gap: 3rem;
		}

		.slot-container {
			border: 2px solid #e2e8f0;
			text-align: center;
			border-radius: 0.5rem;
			padding: 1.5rem;

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
