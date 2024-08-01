import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

const fetchPosts = async () => {
  return await prisma.post.count();
};

export default async function Admin() {
  const posts = await fetchPosts();
  return (
    <div>
      <div class="p-4 rounded-lg">
        <div class="mb-4 rounded">
          <h1 className="text-2xl font-bold mb-4">Welcome Admin</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card bg-base-100 border border-black">
            <div className="card-body">
              <h2 className="card-title">Total Postingan</h2>
              <p className="text-3xl font-bold">{posts}</p>
              <Link className="w-1/2 btn btn-primary ms-auto" href="/admin/posts">
                View Postingan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
