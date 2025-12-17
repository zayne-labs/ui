import { Teleport } from "@zayne-labs/ui-react/common/teleport";

function PageSix() {
	return (
		<>
			<Teleport to="#six" insertPosition="afterbegin">
				<p>I teleport to the top of the div</p>
			</Teleport>

			<div id="six">
				<h1>Hello there my friends</h1>
				<p>I am a friend of yours</p>
			</div>
		</>
	);
}

export { PageSix };
