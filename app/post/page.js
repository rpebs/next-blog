"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BlogCard from "../components/BlogCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

// Function to fetch data from the backend API
const fetchPosts = async (search = "", page = 1, pageSize = 8) => {
  const res = await fetch(`/api/posts?search=${search}&page=${page}&pageSize=${pageSize}`);
  const data = await res.json();
  return data;
};

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getPosts = async () => {
      const { posts, totalPages } = await fetchPosts(searchTerm, currentPage);
      setPosts(posts);
      setTotalPages(totalPages);
    };
    getPosts();
  }, [searchTerm, currentPage]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
