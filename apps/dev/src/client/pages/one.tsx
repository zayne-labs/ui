import MainForm from "../components/MainForm";

function PageOne() {
	return (
		<main
			className="flex min-h-svh flex-col items-center bg-linear-to-br from-gray-100 to-gray-200 py-12"
		>
			<MainForm />
		</main>
	);
}

export { PageOne };
