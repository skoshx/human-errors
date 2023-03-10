import { CodeBlock } from './CodeBlock'
import { Subtitle } from './Subtitle'

export function Usage() {
	return (
		<section className="space-y-4">
			<div className="space-y-1">
				<Subtitle>Usage</Subtitle>
				<p>
					Create your errors object once, and use everywhere. One place for all your errors.
					TypeScript types inferred like magic.
				</p>
			</div>
			<CodeBlock>
				{`import { createHumanErrors } from 'human-errors'

				// Define your errors object
				const errors = { ... }

				const humanErrors = createHumanErrors(errors)

				// In your API endpoint
				return humanErrors.error('invalid_parameters', { missingParameter: 'per_page' })`}
			</CodeBlock>
		</section>
	)
}
