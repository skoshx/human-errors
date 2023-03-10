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
