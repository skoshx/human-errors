import { beforeEach, expect, it, suite, test, vi } from 'vitest'
import { createHumanErrors } from '../src'
import { ErrorReturnType } from '../src/types'
import { minimalErrors } from './setup'

suite.concurrent('basic', () => {
	it('templates errors correctly', async () => {
		const humanErrors = createHumanErrors(minimalErrors, {
			transformer: (e) => e
		})

		expect(await humanErrors.error('error1', { url: 'https://human.errors' })).toStrictEqual({
			code: 'error1',
			message: 'Templated https://human.errors',
			status_code: 400
		})
	})

	it('can associate user with error', async () => {
		const humanErrors = createHumanErrors(minimalErrors, {
			transformer: (e) => e
		})

		expect(
			await humanErrors.error(
				'error1',
				{ url: 'https://human.errors' },
				{ user: 'john.doe@proton.me' }
			)
		).toStrictEqual({
			code: 'error1',
			message: 'Templated https://human.errors',
			status_code: 400,
			user: 'john.doe@proton.me'
		})
	})
})
