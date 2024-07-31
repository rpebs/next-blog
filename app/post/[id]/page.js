import { PrismaClient } from '@prisma/client'
import Image from 'next/image'

const prisma = new PrismaClient()

const fetchPost = async (id) => {
  return await prisma.post.findUnique({
    where: { id: parseInt(id) },
  })
}

export default async function Post({ params }) {
    const post = await fetchPost(params.id)
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <Image src={post.image} alt={post.title} width={1000} height={300} className="w-full h-60 object-cover rounded-lg" />
      <p>{post.content}</p>
      <p className="text-gray-500">Created at: {new Date(post.createdAt).toLocaleDateString()}</p>
    </div>
  )
}
