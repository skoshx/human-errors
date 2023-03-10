import Image from 'next/image'

export function Hero() {
	return (
		<section className="space-y-6 py-36 flex flex-col items-center">
			<Image src="/human-errors-logo.svg" width={300} height={35} alt="human-errors logo" />
			<p className="text-lg max-w-lg mx-auto text-gray-600 text-center">
				A tiny error handling library to make your API's more human friendly. Inspired by Stripe's
				API.
			</p>
			<div className="space-x-2 flex items-cente justify-center">
				<button className="h-11 text-xs font-semibold px-12 text-white rounded-xl bg-gradient-to-b from-gray-900 to-gray-800 cursor-pointer flex items-center justify-center">
					Render a toast
				</button>
				<button className="h-11 text-xs font-semibold px-6 text-gray-800 rounded-xl bg-gradient-to-b from-gray-100 to-gray-300 cursor-pointer flex items-center justify-center border border-gray-200">
					GitHub
				</button>
			</div>
		</section>
	)
}
