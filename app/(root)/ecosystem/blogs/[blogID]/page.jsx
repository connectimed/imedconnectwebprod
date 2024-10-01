"use client";
import AddTopic from "@/components/admin/AddTopic";
import AdminAddExam from "@/components/admin/AdminAddExam";
import AdminModuleExam from "@/components/admin/AdminModuleExam";
import AdminTopics from "@/components/admin/AdminTopics";
import DeleteBlog from "@/components/admin/DeleteBlog";
import DeleteModule from "@/components/admin/DeleteModule";
import MentorInfoCard from "@/components/mentor/MentorInfoCard";
import MentorTopics from "@/components/mentor/MentorTopics";
import { Guardian } from "@/components/shared/Guardian";
import NotFound from "@/components/shared/NotFound";
import RingLoader from "@/components/shared/RingLoader";
import TimeAgo from "@/components/shared/TimeAgo";
import StudentEnrollToModule from "@/components/student/StudentEnrollToModule";
import StudentTopics from "@/components/student/StudentTopics";
import { UserAuth } from "@/lib/context/AuthContext";
import { db } from "@/lib/firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const page = ({ params }) => {
  const { firebaseUser, fetchUserData, userData, fireLoaded } = UserAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const dbInstance = collection(db, "Blogs");

  const getContentById = async (id) => {
    const q = query(dbInstance, where("blog_id", "==", id), limit(1));

    try {
      const data = await getDocs(q);
      const contentData = data.docs.find((item) => item.id === id);
      console.log("Getting data");

      if (contentData) {
        return { ...contentData.data(), id: contentData.id };
      } else {
        console.error("Content not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        if (params.blogID) {
          setLoading(true);
          const data = await getContentById(params.blogID);
          // comment
          //comment two
          setContent(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching press release:", error);
      }
    };
    fetchContentData();
  }, [params]);

  const authRedirectComponent = Guardian(userData, firebaseUser, fireLoaded);

  if (authRedirectComponent) {
    return authRedirectComponent;
  }

  if (loading) {
    return <RingLoader />;
  }

  if (!loading && !content) {
    return <NotFound />;
  }

  return (
    <div>
      <div className=" rounded-xl p-4 border bg-white">
        <div className="flex flex-col">
          <Image
            alt=""
            src={content.blog_image}
            height={1080}
            width={1920}
            className="w-full aspect-video rounded-md object-cover"
          />

          <div className="h-full rounded-lg">
            <div>
              <p className="text-base-medium font-bold mt-2 text-slate-700">
                {content.blog_title}
              </p>

              <div
                className="text-small-regular text-slate-600"
                contentEditable="true"
                dangerouslySetInnerHTML={{ __html: content.blog_description }}
              ></div>
              <div className="flex flex-row justify-between mt-1">
                <div className="flex flex-row space-x-1 text-subtle-regular text-slate-400 tracking-wide">
                  <p className="">Posted:</p>
                  <TimeAgo timestamp={content.blog_submitted_time} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* topics */}
      </div>

      {userData.user_type === "Admin" && (
        <div className="mt-6">
          <DeleteBlog module={content} />
        </div>
      )}
    </div>
  );
};

export default page;
