import AppFour from "./AppFour";
import AppOne from "./AppOne";
import AppThree from "./AppThree";
import AppTwo from "./AppTwo";

function App() {
	const pathname = globalThis.location.pathname;

	switch (pathname) {
		case "/four": {
			return <AppFour />;
		}

		case "/three": {
			return <AppThree />;
		}

		case "/two": {
			return <AppTwo />;
		}

		default: {
			return <AppOne />;
		}
	}
}

export default App;
