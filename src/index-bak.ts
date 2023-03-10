import { HumanDeveloperError } from './error'
import { CreateErrorSchema } from './schema'
import { replaceTemplateString } from './template'
import { defaultHumanTransformer } from './transform'
import {
	CreateErrorHandlerOptions,
	CreateErrorOptions,
	CreateErrorType,
	DeepTransformToPrimitives,
	ErrorReturnType,
	TemplateType,
	TransformType
} from './types'

export function createHumanErrors<
	TErrors extends Record<string, CreateErrorType>,
	TTransform extends TransformType
>(errors: TErrors, opts: CreateErrorHandlerOptions<TErrors, TTransform> = {}) {
	for (const [key, value] of Object.entries(errors)) {
		// Validate schema
		const { success } = CreateErrorSchema.safeParse(value)
		if (!success) {
			throw new HumanDeveloperError(
				`Invalid schema for error with key: "${key}". Please refer to the documentation for the schema."`
			)
		}
	}

	type TParams<T> = T extends keyof TErrors ? TErrors[T]['message'] : never

	function createError<T extends keyof TErrors>(
		errorCode: T,
		// @ts-expect-error
		params: TParams<T> extends string ? undefined : DeepTransformToPrimitives<TParams<T>['params']>,
		options: CreateErrorOptions<TErrors, TTransform> = {}
	) {
		if (!errors[errorCode])
			throw new HumanDeveloperError(
				`Invalid error code "${String(errorCode)}" passed to Human Error function.`
			)

		const templateMessage: string | undefined = (errors[errorCode]?.message as TemplateType)
			.template
		const templateParams: Record<string, number | string> | undefined = params as Record<
			string,
			number | string
		>

		let errorMessage = ''
		if (typeof (errors[errorCode] as CreateErrorType).message === 'object') {
			// Use templating
			if (!templateMessage || !templateParams)
				throw new HumanDeveloperError(
					`Error with key "${String(
						errorCode
					)}" uses a templated error message, but not both template message and template params are provided. Type of received template message: "${typeof templateMessage}", type of received template params: "${typeof templateParams}"`
				)
			errorMessage = replaceTemplateString(templateMessage, templateParams)
		} else if (typeof (errors[errorCode] as CreateErrorType).message === 'string') {
			errorMessage = String((errors[errorCode] as CreateErrorType).message)
		} else {
			throw new HumanDeveloperError(
				`Invalid error.message property: "${String(
					errorCode
				)}.message" is neither of type object or string.`
			)
		}

		const error: ErrorReturnType = {
			code: String(errorCode),
			message: String(errorMessage),
			status_code: (errors[errorCode] as CreateErrorType).status_code,
			...((errors[errorCode] as CreateErrorType).doc_url && {
				doc_url: (errors[errorCode] as CreateErrorType).doc_url
			}),
			...((errors[errorCode] as CreateErrorType).type && {
				type: (errors[errorCode] as CreateErrorType).type
			}),
			...(options.request_log_url && { request_log_url: options.request_log_url })
		}
		// return { code: 'INTERNAL_SERVER_ERROR', message: 'Hello world' }
		return error
	}

	// type InferTransformerReturnValue<T> = T extends (error: any) => infer R ? R : never;

	function createErrorTest<T extends keyof TErrors>(
		errorCode: T,
		// @ts-expect-error
		params: TParams<T> extends string ? undefined : DeepTransformToPrimitives<TParams<T>['params']>,
		transform: TTransform
		// options: CreateErrorOptions = {}
	) {
		type InferTransformerReturnValue<T> = T extends (error: any) => infer R ? R : never

		const error = createError(errorCode, params)
		return error as ReturnType<TTransform>
		// return opts.transformer ? opts.transformer(error) as TTransform : error;
		// return error as ReturnType<TTransform>;
		// return error as ReturnType<typeof transform>
	}

	function createTransform<T>(error: ErrorReturnType) {
		return { code: 'HELLO_WORLD', message: 'xaxa' }
	}

	return {
		showError: createError,
		showErrorTest: createErrorTest
		// showErrorWithTransform: createErrorWithTransform
	}
}
