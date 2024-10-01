import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import Image from "next/image";
import RingLoader from "../shared/RingLoader";
import TextButton from "../shared/TextButton";
import EmptyState from "../shared/EmptyState";
import calculateTimeAgo from "@/lib/actions/calculateTimeAgo";
import DangerButton from "../shared/DangerButton";
import Link from "next/link";

const NoticeList = ({ data, userData, fetchUserData }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
      {data.map((post) => (
        <Link
          key={post.id}
          className="bg-white rounded-lg border-2 border-slate-200 hover:cursor-pointer"
          href={`ecosystem/blogs/${post.blog_id}`}
        >
          <div className="p-3">
            <Image
              className="w-full aspect-video object-cover rounded-sm"
              src={post.blog_image}
              height={200}
              width={200}
              alt="blog image"
            />
            <h6 className="text-small-regular font-medium tracking-normal text-slate-700 mt-2">
              {post.blog_title}
            </h6>

            <div
              className="text-small-regular tracking-normal text-gray-700 line-clamp-2"
              contentEditable="false"
              dangerouslySetInnerHTML={{ __html: post.blog_description }}
            ></div>
            <div className="flex flex-row justify-end mt-2">
              <p className="text-subtle-regular text-slate-400">
                {calculateTimeAgo(post.blog_submitted_time)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

const AllBlogs = ({ userData, fetchUserData }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [isFirstPage, setIsFirstPage] = useState(true);

  const getBlogs = async (next = true) => {
    const dbInstance = collection(db, "Blogs");
    let q = query(dbInstance, orderBy("blog_submitted_time", "desc"), limit(4));
    setLoading(true);
    try {
      const data = await getDocs(q);
      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      setBlogs(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      getBlogs(false);
    }
  }, [userData]);

  return (
    <div className="flex flex-col gap-1 px-2 h-full">
      {loading && (
        <div className="flex flex-col justify-center h-full">
          <RingLoader />
        </div>
      )}
      {!loading && blogs.length === 0 && (
        <div className="flex flex-col justify-center h-full">
          <EmptyState
            title={"No Examinations Found"}
            desc={
              "Looks like there are no blogs yet. Once they are published, they will appear here."
            }
          />
        </div>
      )}
      {!loading && blogs.length > 0 && (
        <NoticeList
          data={blogs}
          userData={userData}
          fetchUserData={fetchUserData}
        />
      )}
    </div>
  );
};

export default AllBlogs;
