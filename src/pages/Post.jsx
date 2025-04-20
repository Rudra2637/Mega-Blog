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
        <div className="py-10 px-4 bg-gradient-to-br from-[#f8f9fa] to-[#e8ecf1] min-h-screen font-serif relative">
            <Container>
                <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl">
                    <div className="relative group cursor-zoom-in" onClick={() => setIsImageOpen(true)}>
                        <img
                            src={appwriteService.getFileView(post.featuredImage)}
                            alt={post.title}
                            className="w-full h-[24rem] object-cover object-top brightness-95 group-hover:brightness-100 transition duration-300"
                        />
                        {isAuthor && (
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-green-600" className="hover:bg-green-700 shadow-md">
                                        ✏️ Edit
                                    </Button>
                                </Link>
                                <Button
                                    bgColor="bg-red-600"
                                    className="hover:bg-red-700 shadow-md"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents modal from triggering
                                        deletePost();
                                    }}
                                >
                                    🗑️ Delete
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="px-10 py-8">
                        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                            {post.title}
                        </h1>
                        <div className="text-sm text-gray-500 mb-6">
                            by <span className="font-medium">Author</span> • April 20, 2025
                        </div>
                        <div className="prose prose-lg prose-slate max-w-none text-justify leading-relaxed">
                            {parse(post.content)}
                        </div>
                    </div>
                </div>
            </Container>

            {/* Image Modal */}
            {isImageOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center cursor-zoom-out"
                    onClick={() => setIsImageOpen(false)}
                >
                    <img
                        src={appwriteService.getFileView(post.featuredImage)}
                        alt="Full View"
                        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg transition-transform duration-300"
                    />
                </div>
            )}
        </div>
    ) : null;
}
