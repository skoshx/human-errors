'use client'

import { CodeBlock } from './CodeBlock'
import { Subtitle } from './Subtitle'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createHumanErrors, ErrorReturnType } from 'human-errors'
import { Button } from './Button'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import useMeasure from 'react-use-measure'

type LogStoreType = {
	logs: ErrorReturnType[]
	appendLog: (log: ErrorReturnType) => void
	removeLog: (logIndex: number) => void
	clearLogs: () => void
}

const useLogStore = create<LogStoreType>(
	// @ts-expect-error
	persist(
		(set, get) => ({
			logs: [],
			appendLog: (log: ErrorReturnType) =>
				set((state) => {
					return {
						logs: [...state.logs, log]
					}
				}),
			removeLog: (logIndex: number) =>
				set((state) => {
					console.log('old logs')
					console.log(state.logs)
					const logsCopy = [...state.logs]
					console.log('logs copy')
					console.log({
						logs: logsCopy.splice(logIndex)
					})

					//const newArray = [...originalArray.slice(0, indexToRemove), ...originalArray.slice(indexToRemove + 1)];

					console.log('new logs')
					console.log({
						logs: [...state.logs.slice(0, logIndex), ...state.logs.slice(logIndex + 1)]
					})
					return {
						// logs: state.logs.slice(logIndex, 1)
						logs: [...state.logs.slice(0, logIndex), ...state.logs.slice(logIndex + 1)]
					}
				}),
			clearLogs: () => set({ logs: [] })
		}),
		{ name: 'log-storage' }
	)
)

const variants = {
	initial: { opacity: 0, scale: 0.7 },
	visible: { opacity: 1, scale: 1 }
}

// Our errors
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

export const smoothSpring = {
	type: 'spring',
	stiffness: 700,
	damping: 60
}

function LogItem({ children, initialHeight = 0, removeLog }: any) {
	const [ref, bounds] = useMeasure()
	return (
		<motion.div
			variants={variants}
			ref={ref}
			transition={smoothSpring}
			initial="initial"
			animate="visible"
			exit="initial"
			className="rounded-xl relative flex p-2 items-center border border-gray-200 space-x-2"
			key={log.request_log_url ?? log.code}
		>
			<div className="w-8 h-8 min-w-[32px] rounded-full bg-green-400 bg-gradient-to-br from-red-300 to-red-400"></div>
			<div className="">
				<p className="font-semibold">{log.code}</p>
				<p className="text-xs text-gray-600">{log.message}</p>
			</div>
			<div
				className="rounded-full hover:bg-gray-100 transition-colors absolute cursor-pointer top-2 right-2"
				onClick={() => {
					// removeLog(logIndex)
				}}
			>
				X
			</div>
		</motion.div>
	)
}

export function Demo() {
	const logs = useLogStore((state) => state.logs)
	const appendLog = useLogStore((state) => state.appendLog)
	const removeLog = useLogStore((state) => state.removeLog)
	const clearLogs = useLogStore((state) => state.clearLogs)
	const [showLogs, setShowLogs] = useState(false)

	const humanErrors = createHumanErrors(errors, {
		transformer: (e) => e,
		persist: async (e) => {
			appendLog({
				...e,
				request_log_url: `https://human.errors/log/${crypto.randomUUID()}`
			})
			return e
		}
	})

	console.log('Logs')
	console.log(logs)

	useEffect(() => {
		setShowLogs(true) // Gotta love hydration errors
	}, [])

	return (
		<section className="space-y-4">
			<div className="space-y-1">
				<Subtitle>Logs</Subtitle>
				<p className="text-gray-500">
					Look at how amazing your API responses will be when using{' '}
					<code className="text-gray-800 text-sm p-[2px] bg-gradient-to-b from-gray-50 to-gray-100 bg-gray-100 border-gray-200 border rounded-lg">
						human-errors
					</code>
				</p>
			</div>
			<div className="flex space-x-2">
				<Button
					type="error"
					onClick={async () => {
						console.log(
							await humanErrors.error('account_invalid', {
								apiKey: 'sk_test_4e**********************d6bc',
								accountId: 'acct_srv8cmtg6'
							})
						)
					}}
				>
					Error
				</Button>
				<Button
					type="success"
					onClick={async () => {
						console.log(
							await humanErrors.error('account_invalid', {
								apiKey: 'sk_test_4e**********************d6bc',
								accountId: 'acct_srv8cmtg6'
							})
						)
					}}
				>
					Success
				</Button>
				<Button
					type="info"
					onClick={async () => {
						console.log(
							await humanErrors.error('account_invalid', {
								apiKey: 'sk_test_4e**********************d6bc',
								accountId: 'acct_srv8cmtg6'
							})
						)
					}}
				>
					Info
				</Button>
				{/* Buttons */}
			</div>
			<div className="space-y-4">
				<h1>TODO: Errors here…</h1>
				<AnimatePresence>
					{showLogs &&
						logs.map((log, logIndex) => {
							return (
								<motion.div
									variants={variants}
									transition={smoothSpring}
									initial="initial"
									animate="visible"
									exit="initial"
									className="rounded-xl relative flex p-2 items-center border border-gray-200 space-x-2"
									key={log.request_log_url ?? log.code}
								>
									<div className="w-8 h-8 min-w-[32px] rounded-full bg-green-400 bg-gradient-to-br from-red-300 to-red-400"></div>
									<div className="">
										<p className="font-semibold">{log.code}</p>
										<p className="text-xs text-gray-600">{log.message}</p>
									</div>
									<div
										className="rounded-full hover:bg-gray-100 transition-colors absolute cursor-pointer top-2 right-2"
										onClick={() => {
											removeLog(logIndex)
										}}
									>
										X
									</div>
								</motion.div>
							)
						})}
				</AnimatePresence>
			</div>
		</section>
	)
}
