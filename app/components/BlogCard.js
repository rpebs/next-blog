import Image from 'next/image'
import Link from 'next/link'

const BlogCard = ({ post }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <Image
          src={post.image}
          alt={post.title}
          width={400}
          height={200}
          className="object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>
        <p>{post.content.substring(0, 100)}...</p> {/* Shorten content to make card more concise */}
        <div className="card-actions justify-end">
          <Link href={`/post/${post.id}`} className="btn btn-primary">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
