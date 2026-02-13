'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const code = searchParams?.get('code')

        if (!code) {
            setError('No authentication code found')
            setLoading(false)
            return
        }

        const exchangeCode = async () => {
            try {
                const supabase = createClient()
                
                // Exchange code for session
                const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
                
                if (exchangeError) {
                    setError(`Authentication failed: ${exchangeError.message}`)
                    setLoading(false)
                    return
                }

                if (data?.session) {
                    // Session created successfully
                    router.push('/dashboard')
                } else {
                    setError('Session was not created')
                    setLoading(false)
                }
            } catch (err) {
                console.error('Exchange error:', err)
                setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
                setLoading(false)
            }
        }

        exchangeCode()
    }, [searchParams, router])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="text-center max-w-md">
                <h1 className="text-2xl font-bold mb-4">Processing Sign In</h1>
                
                {loading && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-lg">Authenticating your account...</p>
                    </>
                )}
                
                {error && (
                    <div className="bg-red-900 bg-opacity-50 p-4 rounded">
                        <p className="text-red-200 mb-4">{error}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                        >
                            Return to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
