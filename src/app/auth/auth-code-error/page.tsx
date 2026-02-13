import Link from 'next/link'

export default function AuthCodeError() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
                <p className="text-lg text-gray-300 mb-8">
                    There was a problem signing you in. Please try again.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    )
}
