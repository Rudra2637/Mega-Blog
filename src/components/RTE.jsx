import { Editor } from "@tinymce/tinymce-react"
import { Controller } from "react-hook-form"
import conf from "../conf/conf"

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && <label className="inline-block mb-2 pl-1 font-medium text-gray-700">{label}</label>}

      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm w-full">
        <Controller
          name={name || "content"}
          control={control}
          render={({ field: { onChange } }) => (
            <Editor
              apiKey={conf.tinyMceApi}
              initialValue={defaultValue}
              init={{
                height: 500,
                width: "100%",
                menubar: true,
                plugins: [
                  "image",
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                  "anchor",
                ],
                toolbar:
                  "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:16px; padding: 10px; }",
                skin: "oxide",
                statusbar: false,
                resize: false,
                branding: false,
              }}
              onEditorChange={onChange}
            />
          )}
        />
      </div>
    </div>
  )
}
