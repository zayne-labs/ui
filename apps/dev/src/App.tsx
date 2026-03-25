import { useLocationState } from "@zayne-labs/toolkit-react";
import { Switch } from "@zayne-labs/ui-react/common/switch";
import { BaseLayout } from "./components/BaseLayout";
import { PageFive } from "./pages/five";
import { PageFour } from "./pages/four";
import { PageOne } from "./pages/one";
import { PageSeven } from "./pages/seven";
import { PageSix } from "./pages/six";
import { PageThree } from "./pages/three";
import { PageTwo } from "./pages/two";

function App() {
	const [pathname] = useLocationState((state) => state.pathname);

	return (
		<BaseLayout>
			<Switch.Root value={pathname}>
				<Switch.Match when="/one">
					<PageOne />
				</Switch.Match>

				<Switch.Match when="/two">
					<PageTwo />
				</Switch.Match>

				<Switch.Match when="/three">
					<PageThree />
				</Switch.Match>

				<Switch.Match when="/four">
					<PageFour />
				</Switch.Match>

				<Switch.Match when="/five">
					<PageFive />
				</Switch.Match>

				<Switch.Match when="/six">
					<PageSix />
				</Switch.Match>

				<Switch.Match when="/seven">
					<PageSeven />
				</Switch.Match>

				<Switch.Default>
					<PageOne />
				</Switch.Default>
			</Switch.Root>
		</BaseLayout>
	);
}

export { App };
