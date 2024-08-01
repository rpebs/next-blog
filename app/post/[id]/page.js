import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import sanitizeHtml from 'sanitize-html'

const prisma = new PrismaClient()

const fetchPost = async (id) => {
  return await prisma.post.findUnique({
    where: { id: parseInt(id) },
  })
}

export default async function Post({ params }) {
  const post = await fetchPost(params.id)
  
  // Sanitize the content to avoid XSS attacks
  const sanitizedContent = sanitizeHtml(post.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt']
    },
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <Image src={post.image} alt={post.title} width={1000} height={300} className="w-full h-60 object-cover rounded-lg" />
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      <p className="text-gray-500">Created at: {new Date(post.createdAt).toLocaleDateString()}</p>
    </div>
  )
}
