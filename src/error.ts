// Errors for HumanError

export class HumanError extends Error {
	name = 'HumanError'
	constructor(message: string, name: string, public data: Record<string, any> = {}) {
		super(message)
		this.name = name
	}
}

export class HumanDeveloperError extends HumanError {
	constructor(message: string, public data: Record<string, any> = {}) {
		super(message, 'HumanDeveloperError', data)
	}
}

export function errorToJson<T>(error: T) {
	if (error instanceof Error) {
		return {
			...(error.message && { message: error.message }),
			...(error.name && { name: error.name }),
			...(error.stack && { stack: error.stack })
		}
	} else {
		try {
			return JSON.parse(JSON.stringify(error))
		} catch (e) {
			return String(error)
		}
	}
}
