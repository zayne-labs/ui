export type FromCamelToKebabCase<TString extends string> =
	TString extends `${infer First}${infer Rest}` ?
		First extends Uppercase<First> ?
			`-${Lowercase<First>}${FromCamelToKebabCase<Rest>}`
		:	`${First}${FromCamelToKebabCase<Rest>}`
	:	"";
