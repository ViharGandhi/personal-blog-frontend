"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/blog-home-pages?populate=*`);
        const data = await response.json();
        setBlogs(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleReadMore = (documentId) => {
    router.push(`/blog/${documentId}`);
  };

  const themeClasses = "bg-[#1a1a1a] text-white";

  if (loading) {
    return (
      <div className={`${themeClasses} min-h-screen font-mono flex items-center justify-center`}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={`${themeClasses} min-h-screen font-mono`}>
      <Head>
        <title>My Personal Blog</title>
      </Head>
      <main className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Hi, I am ViharGandhi!</h1>
        </div>
        <p className="text-lg mb-8">Welcome to my blog where I share my knowledge and projects.</p>
        <section>
          <h2 className="text-2xl font-semibold mb-4">My Blogs</h2>
          <ul className="space-y-4">
            {blogs.map((blog) => (
              <li key={blog.id} className="border-b border-gray-700 pb-4">
                <h3 className="text-xl font-semibold">{blog.Title}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Published on {new Date(blog.publishedon).toLocaleDateString()}
                </p>
                <p className="text-gray-300 mb-2">{blog.description}</p>
                <button
                  onClick={() => handleReadMore(blog.documentId)}
                  className="text-sm underline text-blue-400"
                >
                  Read more
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}