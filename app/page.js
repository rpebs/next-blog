import Link from "next/link";
import Navbar from "./components/Navbar";
import BlogCard from "./components/BlogCard";
import Carousel from "./components/Carousel";
import Footer from "./components/Footer";

const fetchPosts = async () => {
  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export default async function Home() {
  const posts = await fetchPosts();
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <Carousel posts={posts.slice(0, 3)} />
        <div className="p-10">
          <h1 className="text-2xl font-bold mb-4">Latest Posts</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {posts.slice(4).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
