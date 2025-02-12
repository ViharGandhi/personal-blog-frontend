// app/blog/[documentId]/page.js
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ZoomableImage from "@/app/components/ZoomableImage";


export default function BlogPost({ params }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [documentId, setDocumentId] = useState(null);

  useEffect(() => {
    // Set the documentId after component mounts
    if (params?.documentId) {
      setDocumentId(params.documentId);
    }
  }, [params]);

  useEffect(() => {
    // Only fetch when documentId is available
    if (!documentId) return;

    const fetchBlogPost = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}api/blog-home-pages/${documentId}?populate=*`
        );
        const { data } = await response.json();
        setBlog(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [documentId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Enhanced theme classes for better readability
  const themeClasses = "bg-[#1a1a1a] text-white leading-relaxed";
  const codeThemeClasses = "bg-[#272822] text-[#f8f8f2] p-6 rounded-lg relative mb-8 shadow-lg";
  const subheadingClasses = "text-4xl font-bold mb-6 mt-12 text-gray-100";
  const linkClasses = "text-blue-400 hover:text-blue-300 transition-colors duration-200 underline text-lg mb-8 block";
  const imageClasses = "w-full h-auto rounded-lg shadow-lg mb-8";

  if (loading) {
    return (
      <div className={`${themeClasses} min-h-screen font-mono flex items-center justify-center`}>
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`${themeClasses} min-h-screen font-mono flex items-center justify-center`}>
        <p className="text-xl">Blog post not found</p>
      </div>
    );
  }

  return (
    <div className={`${themeClasses} min-h-screen font-mono`}>
      <Head>
        <title>{blog.Title} | My Blog</title>
      </Head>

      <main className="p-8 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => router.push("/")}
            className="text-lg hover:text-gray-300 transition-colors duration-200 flex items-center gap-2"
          >
            <span>&larr;</span>
            <span>Back to Home</span>
          </button>
        </div>

        {/* Header Section */}
        <header className="mb-16">
          <h1 className="text-5xl font-bold mb-6 leading-tight">{blog.Title}</h1>
          <div className="space-y-2 text-gray-400">
            <p className="text-lg">Written by ViharGandhi</p>
            <p className="text-lg">
              Published on {new Date(blog.publishedon).toLocaleDateString()}
            </p>
          </div>
        </header>

        {/* Content Section */}
        <article className="prose prose-invert max-w-none">
          {blog.contents && blog.contents.map((section, index) => {
            if (section.type === "text") {
              return (
                <p
                  key={index}
                  className="text-lg mb-8 leading-relaxed whitespace-pre-wrap"
                >
                  {section.value}
                </p>
              );
            }

            if (section.type === "subheading") {
              return (
                <h2 key={index} className={subheadingClasses}>
                  {section.value}
                </h2>
              );
            }

            if (section.type === "link") {
              return (
                <a
                  key={index}
                  href={section.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  {section.linktitle || section.value}
                </a>
              );
            }

            if (section.type === "image") {
              return (
                <div key={index} className="relative w-full mb-8">
                  <ZoomableImage
                    src={section.value}
                    alt="Blog content image"
                    width={800}
                    height={500}
                    className={imageClasses}
                  />
                </div>
              );
            }

            // Code section
            return (
              <div key={index} className={codeThemeClasses}>
                <pre className="overflow-x-auto text-base leading-relaxed p-2">
                  {section.value}
                </pre>
                <button
                  onClick={() => copyToClipboard(section.value)}
                  className="absolute top-4 right-4 text-sm bg-[#49483e] hover:bg-[#75715e] text-white py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Copy
                </button>
              </div>
            );
          })}
        </article>
      </main>
    </div>
  );
}