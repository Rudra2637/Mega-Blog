import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config";
import { useSelector } from 'react-redux';
import { Container, PostCard } from '../components'

function Home() {
    const [posts, setPosts] = useState([])
    const selector = useSelector((state) => state.auth.status)
    const user = useSelector((state) => state.auth.userData)

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    // Not logged in
    if (selector === false) {
        return (
            <div className="w-full py-16 text-center bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
                <Container>
                    <h1 className="text-4xl font-bold text-gray-800">Login to read posts 📚</h1>
                    <p className="text-gray-500 mt-2">You must be logged in to access blog content.</p>
                </Container>
            </div>
        )
    }

    // Logged in but no posts yet
    if (posts.length === 0) {
        return (
            <div className="w-full py-16 text-center bg-gradient-to-br from-yellow-50 to-orange-100 min-h-screen">
                <Container>
                    <h1 className="text-4xl font-bold text-gray-800">Your Feed is Empty 💤</h1>
                    <p className="text-gray-600 mt-2">Looks like you haven’t posted anything yet.</p>
                    <p className="text-gray-500 mb-6">Let’s create something awesome!</p>

                    <div className="mb-10">
                        <a
                            href="/add-post"
                            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            ➕ Add Your First Post
                        </a>
                    </div>

                    {/* Fancy placeholder posts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition"
                            >
                                <div className="h-36 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        )
    }

    // Posts available
    return (
        <div className="w-full py-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <Container>
                {user && (
                    <h2 className="text-xl text-gray-700 mb-6 text-center">
                        Welcome back, <span className="font-semibold">{user.name}</span> 👋
                    </h2>
                )}
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Latest Posts 📰</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post.$id} {...post} />
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home
