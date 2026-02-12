
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
    const supabase = createClient()
    const router = useRouter()

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    return (
        <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-3 px-6 py-3 text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800 hover:shadow-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
        >
            <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
                className="w-6 h-6"
            />
            <span>Continue with Google</span>
        </button>
    )
}
