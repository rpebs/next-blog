"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ModalConfirm from "../../components/ModalConfirm"; // Import modal component

const fetchPosts = async () => {
  const response = await fetch('/api/posts');
  const data = await response.json();
  return data;
};

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };

    getPosts();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${selectedPostId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter(post => post.id !== selectedPostId));
        setIsModalOpen(false);
      } else {
        console.error('Failed to delete the post');
      }
    } catch (error) {
      console.error('Error deleting the post:', error);
    }
  };

  return (
    <div>
      <Link href="/admin/posts/new" className="btn btn-primary">Create New Post</Link>
      <h1 className="text-2xl font-bold mb-4 mt-3">All Posts</h1>
      
      <table className="table min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b" width={200}>Image</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Content</th>
            <th className="py-2 px-4 border-b" width={200}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="py-2 px-4 border-b">{post.id}</td>
              <td className="py-2 px-4 border-b"><Image src={post.image} alt={post.title} width={200} height={200} className="w-full h-44 object-cover rounded-lg" /></td>
              <td className="py-2 px-4 border-b">{post.title}</td>
              <td className="py-2 px-4 border-b">{post.content}</td>
              <td className="py-2 px-4 border-b">
                <Link href={`/admin/posts/new?id=${post.id}`} className="btn btn-primary btn-sm mx-2">Edit</Link>
                <button
                  onClick={() => {
                    setSelectedPostId(post.id);
                    setIsModalOpen(true);
                  }}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalConfirm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this post?"
      />
    </div>
  );
}
