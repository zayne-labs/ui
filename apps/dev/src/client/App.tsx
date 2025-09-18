import { Switch } from "@zayne-labs/ui-react/common/switch";
import AppFour from "./AppFour";
import AppOne from "./AppOne";
import AppThree from "./AppThree";
import AppTwo from "./AppTwo";

function App() {
	const pathname = globalThis.location.pathname;

	return (
		<Switch.Root value={pathname}>
			<Switch.Match when="/four">
				<AppFour />
			</Switch.Match>

			<Switch.Match when="/three">
				<AppThree />
			</Switch.Match>

			<Switch.Match when="/two">
				<AppTwo />
			</Switch.Match>

			<Switch.Default>
				<AppOne />
			</Switch.Default>
		</Switch.Root>
	);
}

export default App;
