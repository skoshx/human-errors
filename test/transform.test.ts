import { expect, it, suite, test } from 'vitest'
import { createHumanErrors } from '../src'
import { ErrorReturnType } from '../src/types'
import { errors, minimalErrors } from './setup'

suite.concurrent('transform', () => {
	it('default transform', async () => {
		const humanErrors = createHumanErrors(minimalErrors, { transformer: (e) => e })
		const y = await humanErrors.error('error1', { url: 'https://human.errors' })

		expect(y).toStrictEqual({
			code: 'error1',
			message: 'Templated https://human.errors',
			status_code: 400
		})
	})

	it('custom transform', async () => {
		function trpcTransformer(error: ErrorReturnType) {
			function statusCodeToTrpcCode(statusCode: number) {
				if (statusCode === 400) return 'BAD_REQUEST'
				if (statusCode === 409) return 'CONFLICT'
				if (statusCode === 500) return 'INTERNAL_SERVER_ERROR'
				if (statusCode === 401) return 'UNAUTHORIZED'
				if (statusCode === 403) return 'FORBIDDEN'
				if (statusCode === 404) return 'NOT_FOUND'
				if (statusCode === 404) return 'METHOD_NOT_SUPPORTED'
				if (statusCode === 408) return 'TIMEOUT'
				if (statusCode === 412) return 'PRECONDITION_FAILED'
				if (statusCode === 413) return 'PAYLOAD_TOO_LARGE'
				if (statusCode === 429) return 'TOO_MANY_REQUESTS'
				if (statusCode === 499) return 'CLIENT_CLOSED_REQUEST'
				return 'INTERNAL_SERVER_ERROR'
			}

			return { code: statusCodeToTrpcCode(error.status_code), message: error.message } as const
		}

		const humanErrors = createHumanErrors(errors, { transformer: trpcTransformer })
		const error = await humanErrors.error('parameter_unknown', {
			apiKey: 'apiKey',
			accountId: 'accountId'
		})

		expect(error).toStrictEqual({
			code: 'BAD_REQUEST',
			message: `The provided key 'apiKey' does not have access to account 'accountId' (or that account does not exist). Application access may have been revoked.`
		})
	})

	test.todo('transform can be used on a per-function basis')
})
