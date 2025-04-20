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
    <div className="w-full px-4 py-8">
      <form onSubmit={handleSubmit(submit)} className="w-full bg-white rounded-xl shadow-xl p-6 mx-auto">
        <h2 className="w-full text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          {post ? "Update Post" : "Create New Post"}
        </h2>
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <div className="w-full lg:w-2/3">
            <Input
              label="Title:"
              placeholder="Enter your post title"
              className="mb-6"
              {...register("title", { required: true })}
            />
            <Input
              label="Slug:"
              placeholder="post-url-slug"
              className="mb-6"
              {...register("slug", { required: true })}
              onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
              }}
            />
            <div className="mb-6">
              <RTE label="Content:" name="content" control={control} defaultValue={getValues("content")} />
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <Input
                  label="Featured Image:"
                  type="file"
                  className="mb-4"
                  accept="image/png, image/jpg, image/jpeg, image/gif"
                  {...register("image", { required: !post })}
                />
                {post && (
                  <div className="w-full mb-4 overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <img
                      src={appwriteService.getFileView(post.featuredImage) || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
              <Select
                options={["active", "inactive"]}
                label="Status:"
                className="mb-6"
                {...register("status", { required: true })}
              />
              <Button
                type="submit"
                bgColor={
                  post
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                    : "bg-gradient-to-r from-purple-600 to-indigo-700"
                }
                className="w-full text-white font-medium py-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
              >
                {post ? "Update Post" : "Publish Post"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
