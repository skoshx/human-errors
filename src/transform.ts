import { ErrorReturnType } from './types'

// Transforms from `ErrorType` to other types.
export let p = ''

export const defaultHumanTransformer = (error: any) => error as ErrorReturnType

// tRPC transformer…
export const toTrpcTransformer = <T>(error: T) => {
	return error
	// return new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
}

// Response transformer (SvelteKit, NextJS 15 etc…)
export const toResponseTransformer = <T>(error: T) => {
	return new Response(JSON.stringify(error))
}
