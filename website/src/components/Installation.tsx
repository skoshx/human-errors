import { CodeBlock } from './CodeBlock'
import { Subtitle } from './Subtitle'

export function Installation() {
	return (
		<section className="space-y-4">
			<Subtitle>Installation</Subtitle>
			<CodeBlock>$ npm install human-errors</CodeBlock>
		</section>
	)
}
