import type { Organization, WebSite, WithContext } from "schema-dts";
import { baseURL, defaultDescription, defaultSiteName } from "@/lib/metadata";

type StructuredDataProps = {
	description?: string;
	title?: string;
	url?: string;
	variant: "organization" | "website";
};

const getStructuredData = (options: StructuredDataProps): WithContext<Organization | WebSite> => {
	const { description, title, url, variant } = options;

	const baseData = {
		"@context": "https://schema.org",
	} as const;

	switch (variant) {
		case "organization": {
			return {
				...baseData,
				"@type": "Organization",
				description: defaultDescription,
				logo: new URL("/logo.png", baseURL).href,
				name: defaultSiteName,
				sameAs: [
					"https://github.com/zayne-labs/ui",
					"https://www.npmjs.com/package/@zayne-labs/ui-react",
				],
				url: baseURL,
			};
		}

		case "website": {
			return {
				...baseData,
				"@type": "WebSite",
				author: {
					"@type": "Organization",
					name: "Zayne Labs",
					url: "https://github.com/zayne-labs",
				},
				description: description ?? `Documentation for ${defaultSiteName} - ${defaultDescription}`,
				headline: title ?? `${defaultSiteName} Documentation`,
				mainEntityOfPage: {
					"@id": url ?? baseURL,
					"@type": "WebPage",
				},
				publisher: {
					"@type": "Organization",
					name: "Zayne Labs",
					url: "https://github.com/zayne-labs",
				},
				url: url ?? baseURL,
			};
		}

		default: {
			variant satisfies never;
			throw new Error(`Invalid variant: ${variant}`);
		}
	}
};

export function StructuredData(props: StructuredDataProps) {
	return (
		<script
			type="application/ld+json"
			// eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(getStructuredData(props)),
			}}
		/>
	);
}
