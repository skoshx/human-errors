<p align="center">
	<img src="docs/human-secrets-logo.png" />
</p>

> A tiny error handling library to make your API's more human friendly. Inspired by Stripe's API

[![license](https://img.shields.io/badge/license-MIT-%23000)](https://github.com/skoshx/human-secrets/blob/main/LICENSE.md)
[![CI](https://github.com/skoshx/human-secrets/actions/workflows/ci.yml/badge.svg)](https://github.com/skoshx/human-secrets/actions/workflows/ci.yml)
[![prettier](https://img.shields.io/badge/code%20style-prettier-%23000)](https://github.com/prettier/prettier)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-%23000)](https://github.com/skoshx/human-secrets/blob/main/README.md)

`human-errors` is a tiny error handling library with the purpose of building more human-friendly and helpful API errors and responses. Inspired greatly by the amazing API design of Stripe.

## Features

- Associate all logs with a user

## Usage

```typescript
import { createHumanErrors } from 'human-errors'

const errors = {
	// this is your api error code
	parameter_unknown: {
		doc_url: 'https://stripe.com/docs/error-codes/parameter-unknown',
		message: {
			template: 'Received unknown parameter: {{missingParameter}}',
			params: {
				unknownParam: 'hello'
			}
		},
		param: 'hello',
		status_code: 400,
		type: 'invalid_request_error'
	}
} as const

const humanError = createHumanError(errors)

console.log(humanError.error('parameter_unknown', { unknownParam: 'page_id' }))
//																								^ this is inferred automatically
```

## License

`human-errors` is released under the [MIT License](https://opensource.org/licenses/MIT).

## TODO

- Tests for types
