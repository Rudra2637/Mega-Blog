"use client"

import React, { useCallback } from "react"
import { useForm } from "react-hook-form"
import { Button, Input, RTE, Select } from ".."
import appwriteService from "../../appwrite/config"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { addPost } from "../../store/postSlice"
import { useDispatch } from "react-redux"

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)

  const submit = async (data) => {
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
        dispatch(addPost(dbPost))
        navigate(`/post/${dbPost.$id}`)
      }
    } else {
      const file = await appwriteService.uploadFile(data.image[0])

      if (file) {
        const fileId = file.$id
        data.featuredImage = fileId

        const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id })

        if (dbPost) {
          dispatch(addPost(dbPost))
          navigate(`/post/${dbPost.$id}`)
        }
      }
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
    <div className="w-full px-4 py-10 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-fadeIn">
      <form
        onSubmit={handleSubmit(submit)}
        className="w-full max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl animate-fadeInUp"
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700 animate-pulse-subtle">
            {post ? "Update Post" : "Create New Post"}
          </h2>
          <div className="flex items-center text-sm text-gray-500 animate-fadeInRight">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            {post ? "Editing existing post" : "Draft mode"}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-6 animate-fadeInUp animation-delay-100">
            <div className="group relative">
              <Input
                label="Title:"
                placeholder="Enter your post title"
                className="transition-all duration-300 focus:shadow-lg border-gray-300 focus:border-purple-500"
                {...register("title", { required: true })}
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-focus-within:w-full"></div>
            </div>

            <div className="group relative">
              <Input
                label="Slug:"
                placeholder="post-url-slug"
                className="transition-all duration-300 focus:shadow-lg border-gray-300 focus:border-purple-500"
                {...register("slug", { required: true })}
                onInput={(e) => {
                  setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
                }}
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-focus-within:w-full"></div>
            </div>

            <div className="transition-all duration-300 hover:shadow-md rounded-lg animate-fadeInUp animation-delay-200">
              <RTE label="Content:" name="content" control={control} defaultValue={getValues("content")} />
            </div>
          </div>

          <div className="w-full lg:w-1/3 animate-fadeInUp animation-delay-300">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gray-50 p-5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Post Settings
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image:</label>
                  <div className="relative group overflow-hidden rounded-lg h-[100px]">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20"
                      accept="image/png, image/jpg, image/jpeg, image/gif"
                      {...register("image", { required: !post })}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg transition-all duration-300 group-hover:border-purple-500 z-10">
                      <div className="flex flex-col items-center text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-8 text-gray-400 group-hover:text-purple-500 transition-colors duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-purple-500 transition-colors duration-300">
                          {post ? "Change image" : "Upload image"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {post && post.featuredImage && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                      <img
                        src={appwriteService.getFileView(post.featuredImage) || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-auto max-h-[200px] object-contain bg-gray-100"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <Select
                    options={["active", "inactive"]}
                    label="Status:"
                    className="transition-all duration-300 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                    {...register("status", { required: true })}
                  />
                </div>
              </div>

              <Button
                type="submit"
                bgColor={
                  post
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                    : "bg-gradient-to-r from-purple-600 to-indigo-700"
                }
                className="w-full text-white font-semibold py-3 rounded-xl shadow-lg hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center">
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
                </span>
                <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0"></span>
              </Button>

              <div className="mt-6 text-center">
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
      </form>

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
        
        @keyframes fadeInRight {
            from { 
                opacity: 0;
                transform: translateX(-20px);
            }
            to { 
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
        
        @keyframes pulseSubtle {
            0% { opacity: 0.9; }
            50% { opacity: 1; }
            100% { opacity: 0.9; }
        }
        
        .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fadeInRight {
            animation: fadeInRight 0.8s ease-out forwards;
        }
        
        .animate-pulse {
            animation: pulse 2s infinite;
        }
        
        .animate-pulse-subtle {
            animation: pulseSubtle 3s infinite;
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
        
        /* ✅ Modern forced-colors support */
        @media (forced-colors: active) {
          body {
            forced-color-adjust: none;
            background: Window;
            color: WindowText;
          }

          input, select, button {
            forced-color-adjust: none;
            background-color: ButtonFace;
            color: ButtonText;
            border-color: GrayText;
          }

          img {
            forced-color-adjust: none;
          }
        }
      `}</style>
    </div>
  )
}
