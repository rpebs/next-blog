"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalConfirm from "../../components/ModalConfirm"; // Sesuaikan path jika berbeda

const fetchPosts = async (search, page, pageSize) => {
  const response = await fetch(
    `/api/posts?search=${search}&page=${page}&pageSize=${pageSize}`
  );
  const data = await response.json();
  return data;
};

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts(search, page, 10); // Set pageSize to 10
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotalData(data.totalData);
      } catch (error) {
        toast.error("Failed to fetch posts!");
        console.error("Error fetching posts:", error);
      }
    };

    getPosts();
  }, [search, page]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${selectedPostId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== selectedPostId)
        );
        setIsModalOpen(false);
        toast.success("Data Successfully Deleted!");
      } else {
        toast.error("Failed to delete the post!");
        console.error("Failed to delete the post");
      }
    } catch (error) {
      toast.error("Error deleting the post!");
      console.error("Error deleting the post:", error);
    }
  };

  return (
    <div>
      <Link href="/admin/posts/new" className="btn btn-primary mb-4">
        Create New Post
      </Link>
      <h1 className="text-2xl font-bold mb-4 mt-3">All Posts</h1>

      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="input input-bordered w-64"
        />
      </form>

      <table className="table min-w-full bg-base-100 border border-gray-200 rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b" width={200}>
              Image
            </th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Content</th>
            <th className="py-2 px-4 border-b" width={200}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="py-2 px-4 border-b">{post.id}</td>
              <td className="py-2 px-4 border-b">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={100}
                  height={100}
                  priority
                  className="w-full h-44 object-cover rounded-lg"
                />
              </td>
              <td className="py-2 px-4 border-b">{post.title}</td>
              <td className="py-2 px-4 border-b">{post.content}</td>
              <td className="py-2 px-4 border-b">
                <Link
                  href={`/admin/posts/new?id=${post.id}`}
                  className="btn btn-primary btn-sm mx-2"
                >
                  Edit
                </Link>
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

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="btn btn-secondary"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages} 
          &nbsp; Total Data { totalData }
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="btn btn-secondary"
        >
          Next
        </button>
      </div>

      <ModalConfirm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this post?"
      />
    </div>
  );
}
