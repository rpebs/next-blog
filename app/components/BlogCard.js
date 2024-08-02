import Image from 'next/image'
import Link from 'next/link'
import sanitizeHtml from 'sanitize-html'


const BlogCard = ({ post }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="w-full h-60">
        <Image
          src={post.image}
          alt={post.title}
          width={400}
          height={200}
          className="object-cover h-full w-full"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>
        {/* <p>{post.content.substring(0, 100)}...</p> Shorten content to make card more concise */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
