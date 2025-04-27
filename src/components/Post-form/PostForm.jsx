"use client"

import React, { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { Button, Input, RTE, Select } from ".."
import appwriteService from "../../appwrite/config"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function PostForm({ post }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  })

  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)

  const submit = async (data) => {
    setIsSubmitting(true)
    try {
      if (post) {
        const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null

        if (file) {
          appwriteService.deleteFile(post.featuredImage)
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined,
        })

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`)
        }
      } else {
        const file = await appwriteService.uploadFile(data.image[0])

        if (file) {
          const fileId = file.$id
          data.featuredImage = fileId
          const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id })

          if (dbPost) {
            navigate(`/post/${dbPost.$id}`)
          }
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-")

    return ""
  }, [])

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, slugTransform, setValue])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 animate-fadeInDown">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            {post ? "Edit Your Post" : "Create New Post"}
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            {post
              ? "Update your post with the latest information and images"
              : "Share your thoughts, ideas, and stories with the world"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="bg-white shadow-xl rounded-2xl overflow-hidden animate-fadeInUp"
        >
          <div className="p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row -mx-4">
              <div className="w-full lg:w-2/3 px-4 animate-fadeInLeft">
                <div className="mb-8 group">
                  <Input
                    label="Title :"
                    placeholder="Enter an engaging title for your post"
                    className="transition-all duration-300 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-lg"
                    {...register("title", { required: true })}
                  />
                  <div className="h-0.5 w-0 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 group-focus-within:w-full"></div>
                </div>

                <div className="mb-8 group">
                  <Input
                    label="Slug :"
                    placeholder="url-friendly-slug"
                    className="transition-all duration-300 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-lg"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                      setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
                    }}
                  />
                  <div className="h-0.5 w-0 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 group-focus-within:w-full"></div>
                </div>

                <div className="mb-8 transition-all duration-300 hover:shadow-md rounded-lg">
                  <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                </div>
              </div>

              <div className="w-full lg:w-1/3 px-4 animate-fadeInRight">
                <div className="sticky top-10 space-y-8">
                  <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      Post Settings
                    </h3>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image :</label>
                      <div className="relative group">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all duration-300 group-hover:border-purple-500">
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("image", { required: !post })}
                          />
                          <div className="text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400 group-hover:text-purple-500 transition-colors duration-300"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600 mt-2 justify-center">
                              <span className="relative rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                                {post ? "Change image" : "Upload an image"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG or GIF</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {post && post.featuredImage && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Image:</label>
                        <div className="relative group overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                          <img
                            src={appwriteService.getFileView(post.featuredImage) || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-auto rounded-lg transform transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <Select
                        options={["active", "inactive"]}
                        label="Status"
                        className="transition-all duration-300 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-lg"
                        {...register("status", { required: true })}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    bgColor={
                      post
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600"
                    }
                    className="w-full py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {post ? "Updating..." : "Publishing..."}
                        </>
                      ) : (
                        <>
                          {post ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              Update Post
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Publish Post
                            </>
                          )}
                        </>
                      )}
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0"></span>
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-300"
                    >
                      Cancel and go back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Add CSS animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeInDown {
            from { 
                opacity: 0;
                transform: translateY(-20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
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
        
        @keyframes fadeInLeft {
            from { 
                opacity: 0;
                transform: translateX(-20px);
            }
            to { 
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeInRight {
            from { 
                opacity: 0;
                transform: translateX(20px);
            }
            to { 
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-fadeInDown {
            animation: fadeInDown 0.8s ease-out forwards;
        }
        
        .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fadeInLeft {
            animation: fadeInLeft 0.8s ease-out forwards;
        }
        
        .animate-fadeInRight {
            animation: fadeInRight 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
