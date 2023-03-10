import { createHumanErrors } from '../src'

export const minimalErrors = {
	error1: {
		message: {
			template: 'Templated {{url}}',
			params: {
				url: 'https://url.com'
			}
		},
		status_code: 400
	},
	error2: {
		message: 'Error 2',
		status_code: 400
	}
}

/**
 * Example implementation of `human-errors`
 */
export const errors = {
	parameter_unknown: {
		doc_url: 'https://stripe.com/docs/error-codes/parameter-unknown',
		message: {
			template:
				"The provided key '{{apiKey}}' does not have access to account '{{accountId}}' (or that account does not exist). Application access may have been revoked.",
			params: {
				apiKey: 'sk_test_4e******************p7dc',
				accountId: 'acct_nonexistent'
			}
		},
		status_code: 400,
		type: 'invalid_request_error'
	},
	parameter_unknown_second: {
		doc_url: 'https://stripe.com/docs/error-codes/parameter-unknown',
		message: 'Received unknown parameter: hello',
		param: 'hello',
		request_log_url: 'https://dashboard.stripe.com/test/logs/req_A6feR4DAUn35LF?t=1678110765',
		status_code: 400,
		type: 'invalid_request_error'
	}
} as const
