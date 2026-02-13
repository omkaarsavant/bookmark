
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'


export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    if (code) {
        try {
            const supabase = await createClient()
            
            // Exchange code for session
            const { error, data } = await supabase.auth.exchangeCodeForSession(code)
            
            if (error) {
                console.error('Code exchange error:', error)
                return NextResponse.redirect(
                    `${requestUrl.origin}/auth/auth-code-error`,
                    { status: 302 }
                )
            }

            if (data?.session) {
                // Session was successfully set, redirect to dashboard
                return NextResponse.redirect(
                    new URL(next, requestUrl.origin),
                    { status: 302 }
                )
            }
        } catch (err) {
            console.error('Auth callback error:', err)
            return NextResponse.redirect(
                `${requestUrl.origin}/auth/auth-code-error`,
                { status: 302 }
            )
        }
    }

    // No code found, redirect to error page
    return NextResponse.redirect(
        `${requestUrl.origin}/auth/auth-code-error`,
        { status: 302 }
    )
}

