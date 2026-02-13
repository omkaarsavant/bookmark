import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const { code } = await request.json()

        if (!code) {
            return NextResponse.json(
                { error: 'No code provided' },
                { status: 400 }
            )
        }

        const supabase = await createClient()
        
        // Exchange code for session using server client with proper cookie handling
        const { error, data } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Code exchange error:', error)
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        if (data?.session) {
            // Session cookie is automatically set by supabase.auth.exchangeCodeForSession
            return NextResponse.json({ success: true })
        }

        return NextResponse.json(
            { error: 'No session created' },
            { status: 400 }
        )
    } catch (err) {
        console.error('Exchange code error:', err)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
