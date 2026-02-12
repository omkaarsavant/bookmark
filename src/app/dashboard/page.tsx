
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkList from '@/components/BookmarkList'
import AddBookmarkForm from '@/components/AddBookmarkForm'

export default async function Dashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/')
    }

    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <nav className="bg-white shadow sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-black">
                                Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">{user.email}</span>
                            <form action="/auth/signout" method="post">
                                <button
                                    className="text-sm font-medium text-red-600 hover:text-red-500"
                                    type="submit"
                                >
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Add New Bookmark</h2>
                        <AddBookmarkForm userId={user.id} />
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Your Bookmarks</h2>
                        {/* Pass initial bookmarks to the client component for hydration */}
                        <BookmarkList initialBookmarks={bookmarks || []} />
                    </section>
                </div>
            </main>
        </div>
    )
}
