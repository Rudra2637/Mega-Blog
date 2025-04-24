"use client"

import { useEffect, useState } from "react"
import appwriteService from "../appwrite/config"
import { useSelector } from "react-redux"
import { Container, PostCard } from "../components"
import {Link} from 'react-router-dom'

function Home() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const selector = useSelector((state) => state.auth.status)
  const user = useSelector((state) => state.auth.userData)

  useEffect(() => {
    setIsLoading(true)
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents)
      }
      setIsLoading(false)
    })
  }, [])

  // Not logged in
  if (selector === false) {
    return (
      <div className="w-full py-16 text-center bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen animate-fadeIn">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="relative mb-8 inline-block">
              <h1 className="text-5xl font-bold text-gray-800 animate-fadeInUp">Login to read posts 📚</h1>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 animate-scaleIn animation-delay-500"></div>
            </div>
            <p className="text-gray-500 mt-2 text-xl animate-fadeInUp animation-delay-200">
              You must be logged in to access blog content.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-300">
              <Link
                to="/login"
                className="px-8 py-3 bg-purple-600 text-white rounded-full font-medium shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-8 py-3 bg-white text-purple-600 border border-purple-200 rounded-full font-medium shadow-md hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Sign Up
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fadeInUp animation-delay-400">
              <FeatureCard
                icon="📝"
                title="Write Stories"
                description="Create beautiful blog posts with a rich text editor"
              />
              <FeatureCard icon="🌐" title="Share Globally" description="Reach readers from around the world" />
              <FeatureCard icon="💬" title="Engage Community" description="Build a community around your content" />
            </div>
          </div>
        </Container>
      </div>
    )
  }

  // Logged in but no posts yet
  if (posts.length === 0 && !isLoading) {
    return (
      <div className="w-full py-16 text-center bg-gradient-to-br from-yellow-50 to-orange-100 min-h-screen animate-fadeIn">
        <Container>
          <h1 className="text-4xl font-bold text-gray-800 animate-fadeInUp">Your Feed is Empty 💤</h1>
          <p className="text-gray-600 mt-2 animate-fadeInUp animation-delay-100">
            Looks like you haven't posted anything yet.
          </p>
          <p className="text-gray-500 mb-6 animate-fadeInUp animation-delay-200">Let's create something awesome!</p>

          <div className="mb-10 animate-fadeInUp animation-delay-300">
            <Link
              to="/add-post"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            >
              ➕ Add Your First Post
            </Link>
          </div>

          {/* Fancy placeholder posts with staggered animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp`}
                style={{ animationDelay: `${i * 0.1}s` }}
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
    <div className="w-full py-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen animate-fadeIn">
      <Container>
        {user && (
          <h2 className="text-xl text-gray-700 mb-6 text-center animate-fadeInUp">
            Welcome back, <span className="font-semibold text-purple-600">{user.name}</span>
            <span className="inline-block animate-wave ml-1">👋</span>
          </h2>
        )}
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 animate-fadeInUp animation-delay-100">
          Latest Posts 📰
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post, index) => (
              <div key={post.$id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center animate-fadeInUp animation-delay-300">
          <button className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
            Load More Posts
          </button>
        </div>
      </Container>

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
                
                @keyframes scaleIn {
                    from { 
                        transform: scaleX(0);
                    }
                    to { 
                        transform: scaleX(1);
                    }
                }
                
                @keyframes wave {
                    0% { transform: rotate(0deg); }
                    10% { transform: rotate(14deg); }
                    20% { transform: rotate(-8deg); }
                    30% { transform: rotate(14deg); }
                    40% { transform: rotate(-4deg); }
                    50% { transform: rotate(10deg); }
                    60% { transform: rotate(0deg); }
                    100% { transform: rotate(0deg); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.8s ease-out forwards;
                }
                
                .animate-wave {
                    animation: wave 2.5s infinite;
                }
                
                .animation-delay-100 {
                    animation-delay: 0.1s;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animation-delay-300 {
                    animation-delay: 0.3s;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
                
                .animation-delay-500 {
                    animation-delay: 0.5s;
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

// Feature card component for the login page
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

export default Home
