import { LiteralToPrimitive } from 'type-fest'
import { z } from 'zod'
import { CreateErrorSchema, ErrorReturnSchema, TemplateSchema } from './schema'

export type DeepTransformToPrimitives<T> = T extends object
	? { [P in keyof T]: DeepTransformToPrimitives<T[P]> }
	: LiteralToPrimitive<T>

type InferReturnType<TErrors> = {
	[K in keyof TErrors]: TErrors[K] extends (error: any) => infer R ? R : never
}[keyof TErrors]

// type TransformerType<TErrors, TReturn> = TReturn extends (error: TErrors[keyof TErrors]) => infer R ? R : never;
export type TransformWithReturnType<T extends (...args: any) => unknown> = (
	error: ErrorReturnType
) => ReturnType<T>
export type TransformType = (error: ErrorReturnType) => unknown
export type PersistType = (error: ErrorReturnType) => Promise<ErrorReturnType>

export type CreateErrorHandlerOptions<
	TErrors extends Record<string, CreateErrorType>,
	TTransform extends TransformType
> = {
	/**
	 * Persist the error's to some medium (eg. log drain, database). The persist function
	 * runs before any transforms are made.
	 */
	persist?: PersistType
	// transformer?: TransformType;
	transformer?: TTransform
	// transformer?: TransformWithReturnType<TTransform>
}

export type CreateErrorOptions<
	TErrors extends Record<string, CreateErrorType>,
	TTransform extends TransformType
> = CreateErrorHandlerOptions<TErrors, TTransform> & {
	request_log_url?: string
	/**
	 * Associate the error to some user.
	 */
	user?: string
}

const codes = new Map([
	[100, 'Continue'],
	[101, 'Switching Protocols'],
	[102, 'Processing'],
	[200, 'OK'],
	[201, 'Created'],
	[202, 'Accepted'],
	[203, 'Non-Authoritative Information'],
	[204, 'No Content'],
	[205, 'Reset Content'],
	[206, 'Partial Content'],
	[207, 'Multi-Status'],
	[300, 'Multiple Choices'],
	[301, 'Moved Permanently'],
	[302, 'Moved Temporarily'],
	[303, 'See Other'],
	[304, 'Not Modified'],
	[305, 'Use Proxy'],
	[307, 'Temporary Redirect'],
	[400, 'Bad Request'],
	[401, 'Unauthorized'],
	[402, 'Payment Required'],
	[403, 'Forbidden'],
	[404, 'Not Found'],
	[405, 'Method Not Allowed'],
	[406, 'Not Acceptable'],
	[407, 'Proxy Authentication Required'],
	[408, 'Request Time-out'],
	[409, 'Conflict'],
	[410, 'Gone'],
	[411, 'Length Required'],
	[412, 'Precondition Failed'],
	[413, 'Request Entity Too Large'],
	[414, 'Request-URI Too Large'],
	[415, 'Unsupported Media Type'],
	[416, 'Requested Range Not Satisfiable'],
	[417, 'Expectation Failed'],
	[418, "I'm a teapot"],
	[422, 'Unprocessable Entity'],
	[423, 'Locked'],
	[424, 'Failed Dependency'],
	[425, 'Too Early'],
	[426, 'Upgrade Required'],
	[428, 'Precondition Required'],
	[429, 'Too Many Requests'],
	[431, 'Request Header Fields Too Large'],
	[451, 'Unavailable For Legal Reasons'],
	[500, 'Internal Server Error'],
	[501, 'Not Implemented'],
	[502, 'Bad Gateway'],
	[503, 'Service Unavailable'],
	[504, 'Gateway Time-out'],
	[505, 'HTTP Version Not Supported'],
	[506, 'Variant Also Negotiates'],
	[507, 'Insufficient Storage'],
	[509, 'Bandwidth Limit Exceeded'],
	[510, 'Not Extended'],
	[511, 'Network Authentication Required']
] as const)

type MapKeys<T> = T extends Map<infer K, any> ? K : never
type MapValues<T> = T extends Map<any, infer V> ? V : never

export type ErrorCodes = MapKeys<typeof codes>
export type ErrorValues = MapValues<typeof codes>

export type ErrorReturnType = z.output<typeof ErrorReturnSchema>
export type CreateErrorType = z.input<typeof CreateErrorSchema>
export type TemplateType = z.input<typeof TemplateSchema>
