import prisma from "@/lib/prisma";
import Link from "next/link";
import BlogCard from "../components/BlogCard";



// Function to fetch data from the database
const fetchPosts = async () => {
  return await prisma.post.findMany();
};

export default async function Post() {
  const posts = await fetchPosts();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <>
            <BlogCard key={post.id} post={post} />
            {/* <Link href={`/new?id=${post.id}`} className="text-blue-500">
              Edit
            </Link> */}
          </>
        ))}
      </div>
    </div>
  );
}
