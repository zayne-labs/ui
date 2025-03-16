import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "../../tailwind.css";

createRoot(document.querySelector("#app") as HTMLElement).render(
	<StrictMode>
		<App />
	</StrictMode>
);
