
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

type Bookmark = {
    id: string
    title: string
    url: string
    created_at: string
}

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = createClient()

    useEffect(() => {
        // Sync initial state if prop changes (optional but good for hydration)
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    useEffect(() => {
        let channel: any;

        const setupSubscription = async () => {
            // Wait for the session to be available so we subscribe AS the user
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                console.log('No session found, skipping subscription')
                return
            }

            console.log('Setting up realtime subscription for user:', session.user.id)

            channel = supabase
                .channel('realtime bookmarks')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'bookmarks',
                        filter: `user_id=eq.${session.user.id}`, // Client-side filter as optimization, but RLS is the real gate
                    },
                    (payload) => {
                        console.log('Realtime update received:', payload)
                        if (payload.eventType === 'INSERT') {
                            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                        } else if (payload.eventType === 'DELETE') {
                            setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== payload.old.id))
                        }
                    }
                )
                .subscribe((status, err) => {
                    console.log('Subscription status:', status)
                    if (err) {
                        console.error('Subscription error:', err)
                    }
                })
        }

        setupSubscription()

        return () => {
            if (channel) {
                console.log('Cleaning up subscription...')
                supabase.removeChannel(channel)
            }
        }
    }, [supabase])



    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) {
            console.error('Error deleting bookmark:', error)
            alert('Failed to delete bookmark')
        }
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No bookmarks yet. Add one above!</p>
            </div>
        )
    }

    return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <li
                    key={bookmark.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow group relative"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-800 truncate pr-8" title={bookmark.title}>
                            {bookmark.title}
                        </h3>
                        <button
                            onClick={() => handleDelete(bookmark.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors absolute top-4 right-4 focus:outline-none"
                            aria-label="Delete bookmark"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm truncate block hover:underline"
                    >
                        {bookmark.url}
                    </a>
                </li>
            ))}
        </ul>
    )
}
