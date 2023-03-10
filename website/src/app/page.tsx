import { Hero } from '@/components/Hero'
import { Installation } from '@/components/Installation'
import { Usage } from '@/components/Usage'
import { Footer } from '@/components/Footer'
import { createHumanErrors, ErrorReturnType } from 'human-errors'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type LogStoreType = {
	logs: ErrorReturnType[]
	appendLog: (log: ErrorReturnType) => void
	clearLogs: () => void
}

// @ts-ignore
const useLogStore = create<LogStoreType>(
	persist(
		(set, get) => ({
			logs: [],
			appendLog: (log: ErrorReturnType) =>
				set((state) => {
					return {
						logs: [...state.logs, log]
					}
				}),
			clearLogs: () => set({ logs: [] })
		}),
		{ name: 'log-storage' }
	)
)

export default function Home() {
	const appendLog = useLogStore((state) => state.appendLog)

	const errors = {
		parameter_unknown: {
			doc_url: 'https://human.errors/docs/error-codes/parameter-unknown',
			message: {
				template: 'Received unknown parameter: {{unknownParameter}}',
				params: {
					unknownParameter: 'unknown parameter'
				}
			},
			status_code: 400,
			type: 'invalid_request_error'
		},
		account_invalid: {
			doc_url: 'https://human.errors/docs/error-codes/account-invalid',
			message: {
				template:
					"The provided key '{{apiKey}}' does not have access to account '{{accountId}}' (or that account does not exist). Application acccess may have been revoked.",
				params: {
					apiKey: 'sk_test_4e**********************d6bc',
					accountId: 'acct_srv8cmtg6'
				}
			},
			status_code: 400,
			type: 'invalid_request_error'
		}
	}

	const humanErrors = createHumanErrors(errors, {
		transformer: (e) => e,
		persist: async (e) => {
			// Generate ID for log

			// appendLog()
			return e
		}
	})

	// TODO: Demo with logs
	return (
		<>
			<main className="w-[90%] max-w-2xl mx-auto">
				<Hero />
				<div className="space-y-16">
					<Installation />
					<Usage />
				</div>
			</main>
			<Footer />
		</>
	)
}
