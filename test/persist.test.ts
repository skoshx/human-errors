import { beforeEach, expect, it, suite, test, vi } from 'vitest'
import { createHumanErrors } from '../src'
import { ErrorReturnType } from '../src/types'
import { minimalErrors } from './setup'

const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

let storage: ErrorReturnType[] = []

async function mockPersistanceFunction(error: ErrorReturnType) {
	await wait(500)
	const persistedError = { ...error, request_log_url: 'req_a1b2c3d' }
	storage.push(persistedError)
	return persistedError
}

suite('persistance', () => {
	beforeEach(() => {
		storage = []
	})

	it('persists with async', async () => {
		const humanErrors = createHumanErrors(minimalErrors, {
			transformer: (e) => e,
			persist: mockPersistanceFunction
		})
		const error = await humanErrors.error('error1', { url: 'https://human.errors' })

		expect(error).toStrictEqual({
			code: 'error1',
			message: 'Templated https://human.errors',
			status_code: 400,
			request_log_url: 'req_a1b2c3d'
		})

		expect(storage).toStrictEqual([
			{
				code: 'error1',
				message: 'Templated https://human.errors',
				status_code: 400,
				request_log_url: 'req_a1b2c3d'
			}
		])
	})

	it('persists without async', async () => {
		const humanErrors = createHumanErrors(minimalErrors, {
			transformer: (e) => e,
			persist: mockPersistanceFunction
		})
		const error = humanErrors.errorSync('error1', { url: 'https://human.errors' })

		expect(error).toStrictEqual({
			code: 'error1',
			message: 'Templated https://human.errors',
			status_code: 400
		})

		expect(storage).toStrictEqual([])
		await wait(500)

		// Assert that error has been persisted
		expect(storage).toStrictEqual([
			{
				code: 'error1',
				message: 'Templated https://human.errors',
				status_code: 400,
				request_log_url: 'req_a1b2c3d'
			}
		])
	})

	it('persist can modify errors', async () => {
		const humanErrors = createHumanErrors(minimalErrors, {
			transformer: (e) => e,
			persist: mockPersistanceFunction
		})
		const error = await humanErrors.error('error1', { url: 'https://human.errors' })
		expect(error).toStrictEqual({
			code: 'error1',
			message: 'Templated https://human.errors',
			status_code: 400,
			request_log_url: 'req_a1b2c3d'
		})

		expect(storage).toStrictEqual([
			{
				code: 'error1',
				message: 'Templated https://human.errors',
				status_code: 400,
				request_log_url: 'req_a1b2c3d'
			}
		])
	})

	test.todo('transform can be used on a per-function basis')
})
