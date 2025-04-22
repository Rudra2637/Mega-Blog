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
        className="w-full max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-8 animate-fadeInUp"
      >
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700">
            {post ? "Update Post" : "Create New Post"}
          </h2>
          <span className="text-sm text-gray-500">
            {post ? "Editing existing post" : "Draft mode"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-6">
            <Input
              label="Title:"
              placeholder="Enter your post title"
              className="transition focus:shadow-lg"
              {...register("title", { required: true })}
            />
            <Input
              label="Slug:"
              placeholder="post-url-slug"
              className="transition focus:shadow-lg"
              {...register("slug", { required: true })}
              onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
              }}
            />
            <div>
              <RTE label="Content:" name="content" control={control} defaultValue={getValues("content")} />
            </div>
          </div>

          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-gray-50 p-5 rounded-xl shadow space-y-4">
              <Input
                label="Featured Image:"
                type="file"
                className="transition"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("image", { required: !post })}
              />
              {post && (
                <div className="overflow-hidden rounded-lg shadow hover:shadow-lg transition duration-300">
                  <img
                    src={appwriteService.getFileView(post.featuredImage) || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              <Select
                options={["active", "inactive"]}
                label="Status:"
                className="transition"
                {...register("status", { required: true })}
              />
            </div>
            <Button
              type="submit"
              bgColor={
                post
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                  : "bg-gradient-to-r from-purple-600 to-indigo-700"
              }
              className="w-full text-white font-semibold py-3 rounded-xl shadow-lg hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300"
            >
              {post ? "Update Post" : "Publish Post"}
            </Button>
          </div>
        </div>
      </form>

      {/* Animations */}
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
