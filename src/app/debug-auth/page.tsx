'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function CallbackDebug() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState('Processing authentication...')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const code = searchParams?.get('code')
        
        if (code) {
            setStatus(`Code received: ${code.substring(0, 10)}... Redirecting...`)
            // The server should handle the redirect, but if we're here,
            // it might mean the callback route isn't working properly
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        } else {
            setError('No authentication code found. This should have been handled by the callback route.')
        }
    }, [searchParams, router])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="text-center max-w-md">
                <h1 className="text-2xl font-bold mb-4">Authentication</h1>
                <p className="text-lg mb-8">{status}</p>
                {error && (
                    <div className="bg-red-900 bg-opacity-50 p-4 rounded mb-4">
                        <p className="text-red-200">{error}</p>
                    </div>
                )}
                <p className="text-sm text-gray-400">
                    If this page doesn't redirect automatically, make sure your Supabase redirect URLs are configured correctly in the Supabase dashboard.
                </p>
            </div>
        </div>
    )
}
