"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [postId, setPostId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get postId from query parameters
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setPostId(id);
      setIsEditing(true);
      fetchPostData(id);
    }
  }, [searchParams]);

  const fetchPostData = async (id) => {
    try {
      const response = await fetch(`/api/posts/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post data");
      }
      const data = await response.json();
      setTitle(data.title);
      setContent(data.content);
      setImage(data.image);
      // No need to set file, as files should not be fetched and set here
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!title.trim()) {
      errors.title = "Title is required.";
      isValid = false;
    }

    if (!content.trim()) {
      errors.content = "Content is required.";
      isValid = false;
    }
    
    if (!isEditing && !file) {
      errors.file = "Image is required when uploading a new image.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) {
      formData.append("file", file);
    }

    try {
      const url = isEditing ? `/api/posts/${postId}` : "/api/posts";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const message = isEditing ? "Post updated successfully" : "Post created successfully";
      setSuccessMessage(message); // Set success message state
      toast.success(message); // Show toast notification
      
      router.push("/admin/posts");
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {isEditing ? "Edit Post" : "New Post"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full px-3 py-2 border rounded ${
              errors.content ? "border-red-500" : ""
            }`}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content}</p>
          )}
        </div>
        {isEditing && (
          <div className="mb-4">
            <label className="block mb-1" htmlFor="file">
              Current Image
            </label>
            <Image
              src={image}
              alt="Preview"
              width={200}
              height={100}
              className="border border-base-300 rounded"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1" htmlFor="file">
            Image{" "}
            {isEditing && <span className="text-gray-500">(optional)</span>}
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
            className={`file-input w-full ${
              errors.file ? "border-red-500" : ""
            }`}
          />
          {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isEditing ? "Update Post" : "Submit"}
        </button>
      </form>
    </div>
  );
} 
