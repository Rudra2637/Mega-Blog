import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import { deletePosts } from "../store/postSlice";

export default function Post() {
    const [post, setPost] = useState(null);
    const [isImageOpen, setIsImageOpen] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = true;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                dispatch(deletePosts(post.$id));
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-10 px-4 bg-gradient-to-br from-[#f8f9fa] to-[#e8ecf1] min-h-screen font-serif relative animate-fadeIn">
            <Container>
                <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)]">
                    <div className="relative group cursor-zoom-in overflow-hidden" onClick={() => setIsImageOpen(true)}>
                        <img
                            src={appwriteService.getFileView(post.featuredImage) || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-[24rem] object-cover object-top transition-all duration-500 transform group-hover:scale-105 group-hover:brightness-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {isAuthor && (
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-green-600" className="hover:bg-green-700 shadow-md transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                                        ✏️ Edit
                                    </Button>
                                </Link>
                                <Button
                                    bgColor="bg-red-600"
                                    className="hover:bg-red-700 shadow-md transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents modal from triggering
                                        deletePost();
                                    }}
                                >
                                    🗑️ Delete
                                </Button>
                            </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                            <p className="text-white text-sm font-medium px-6 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                Click to view full image
                            </p>
                        </div>
                    </div>

                    <div className="px-10 py-8">
                        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6 animate-fadeInUp">
                            {post.title}
                        </h1>
                        <div className="text-sm text-gray-500 mb-6 flex items-center animate-fadeInUp animation-delay-100">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2 text-purple-600">
                                <span className="text-xs font-bold">A</span>
                            </div>
                            by <span className="font-medium ml-1">Author</span> • 
                            <span className="ml-1 text-purple-500">April 20, 2025</span>
                        </div>
                        <div className="prose prose-lg prose-slate max-w-none text-justify leading-relaxed animate-fadeInUp animation-delay-200">
                            {parse(post.content)}
                        </div>
                        
                        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center animate-fadeInUp animation-delay-300">
                            <div className="flex space-x-4">
                                <button className="flex items-center text-gray-500 hover:text-purple-600 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Like
                                </button>
                                <button className="flex items-center text-gray-500 hover:text-purple-600 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Comment
                                </button>
                            </div>
                            <button className="flex items-center text-gray-500 hover:text-purple-600 transition-colors duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Image Modal */}
            {isImageOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center cursor-zoom-out animate-fadeIn"
                    onClick={() => setIsImageOpen(false)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh] animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={appwriteService.getFileView(post.featuredImage) || "/placeholder.svg"}
                            alt="Full View"
                            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
                        />
                        <button 
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-all duration-200 backdrop-blur-sm"
                            onClick={() => setIsImageOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            
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
                
                @keyframes scaleIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out forwards;
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
            `}</style>
        </div>
    ) : null;
}
