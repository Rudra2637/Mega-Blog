import appwriteService from "../appwrite/config"
import { Link } from "react-router-dom"

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`} className="block w-full h-full group">
      <div className="h-full w-full bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
        
        {/* Image */}
        <div className="w-full h-48 overflow-hidden">
          <img
            src={appwriteService.getFileView(featuredImage) || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover object-top transform transition-transform duration-500 group-hover:scale-105"

          />
        </div>

        {/* Text Content */}
        <div className="p-5">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 line-clamp-2">
            {title}
          </h2>

          <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
              Blog Post
            </span>
            <span className="text-xs group-hover:text-indigo-600 transition">Read More →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
