import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.querySelector("#app") as HTMLElement).render(
	<StrictMode>
		<App />
	</StrictMode>
);