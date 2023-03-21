import { z } from 'zod'

export const ErrorReturnSchema = z.object({
	code: z.string(),
	doc_url: z.string().optional(),
	message: z.string(),
	param: z.string().optional(),
	status_code: z.number(),
	type: z.string().optional(),
	request_log_url: z.string().optional(),
	user: z.string().optional(),
	error: z.any().optional()
})

export const TemplateSchema = z.object({
	template: z.string(),
	params: z.record(z.union([z.string(), z.number()]))
})

export const MessageSchema = z.union([TemplateSchema, z.string()])

export const CreateErrorSchema = z.object({
	doc_url: z.string().optional(),
	message: MessageSchema,
	param: z.string().optional(),
	request_log_url: z.string().optional(),
	status_code: z.number(),
	type: z.string().optional()
})
