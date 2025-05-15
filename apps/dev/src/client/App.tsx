import AppOne from "./AppOne";
import AppTwo from "./AppTwo";

function App() {
	const pathname = globalThis.location.pathname;

	switch (pathname) {
		case "/": {
			return <AppOne />;
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
