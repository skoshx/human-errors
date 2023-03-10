// Simple templating
export function replaceTemplateString(
	template: string,
	values: Record<string, string | number>
): string {
	const regex = /{{(.*?)}}/g
	return template.replace(regex, (match, p1) => String(values[p1.trim()] ?? match))
}
