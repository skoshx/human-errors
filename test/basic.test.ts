import { beforeEach, expect, it, suite, test, vi } from 'vitest'
import { createHumanErrors } from '../src'
import { HumanDeveloperError } from '../src/error'
import { ErrorReturnType } from '../src/types'
import { minimalErrors } from './setup'

const storage: ErrorReturnType[] = []

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

	it('can add an error object to the error', async () => {
		const mockedFn = vi.fn((e) => e)
		const humanErrors = createHumanErrors(minimalErrors, {
			transformer: (e) => e,
			persist: mockedFn
		})

		const error = new HumanDeveloperError('Oops! Something went wrong.')

		expect(await humanErrors.error('error2', undefined, { error })).toStrictEqual({
			code: 'error2',
			message: 'Error 2',
			status_code: 400
		})

		expect(mockedFn).toHaveBeenCalledOnce()
	})
})
