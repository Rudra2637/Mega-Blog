"use client"

import { useEffect, useState } from "react"
import { Container, PostCard } from "../components/index"
import appwriteService from "../appwrite/config"
import { selectPosts, setPosts } from "../store/postSlice"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"

function AllPosts() {
  const dispatch = useDispatch()
  const posts = useSelector(selectPosts)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    if (posts.length === 0) {
      appwriteService
        .getPosts()
        .then((res) => {
          if (res) {
            dispatch(setPosts(res.documents))
          }
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching posts:", error)
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [dispatch, posts.length])

  return (
    <div className="w-full min-h-screen py-10 bg-gradient-to-br from-gray-50 to-gray-100 animate-fadeIn">
      <Container>
        <div className="mb-8 text-center animate-fadeInUp">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700 mb-2">
            All Posts
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore all the articles and stories shared by our community
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 animate-fadeIn">
            <div className="loader"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post, index) => (
              <div key={post.$id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                <PostCard {...post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md animate-fadeInUp">
            <div className="mb-6 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Posts Found</h2>
            <p className="text-gray-600 mb-6">
              Looks like there aren't any posts yet. Be the first to share your thoughts!
            </p>
            <Link
              to="/add-post"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Post
            </Link>
          </div>
        )}
      </Container>

      {/* Add CSS animations */}
      <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeInUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                
                .loader {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-left-color: #9333ea;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
    </div>
  )
}

export default AllPosts
