"use client";
import AddQuestion from "@/components/admin/AddQuestion";
import AddTopic from "@/components/admin/AddTopic";
import AdminQuestions from "@/components/admin/AdminQuestions";
import AdminTopics from "@/components/admin/AdminTopics";
import DeleteExam from "@/components/admin/DeleteExam";
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
  const dbInstance = collection(db, "Modules");

  const getContentById = async (id) => {
    const q = query(dbInstance, where("module_id", "==", id), limit(1));

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
        setLoading(true);
        const data = await getContentById(params.examId);
        // setNewStatus(data.package_status);
        // setStatus(data.package_status);
        setContent(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching press release:", error);
      }
    };

    fetchContentData();
  }, []);

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
      {userData.user_type === "Admin" && (
        <AddQuestion
          userData={userData}
          fetchUserData={fetchUserData}
          topicsCount={content.module_topics_count}
          module={content}
        />
      )}

      {userData.user_type === "Student" &&
        !userData.user_modules.includes(content.module_id) && (
          <StudentEnrollToModule
            userData={userData}
            fetchUserData={fetchUserData}
            moduleId={content.module_id}
            moduleTitle={content.module_title}
            moduleHost={content.module_poster_name}
            moduleImage={content.module_image}
          />
        )}
      <div className=" rounded-xl p-4 border bg-white">
        <div>
          <h6 className="text-small-regular font-medium leading-relaxed tracking-normal text-slate-700">
            {content.module_exam_title}
          </h6>
          <div className="flex flex-row text-subtle-regular text-slate-400 space-x-2">
            <p>Module: {content.module_title},</p>
            <p>{content.exam_total_questions} questions</p>
          </div>
          <p className="text-small-regular antialiased font-normal leading-normal text-gray-700">
            {content.module_exam_instructions}
          </p>
        </div>
        {/* topics */}
        <div className=" mt-4 ">
          <div className="flex flex-row justify-between border-b pt-2">
            <p className="pb-2 text-base-regular font-bold tracking-wide">
              Questions:
            </p>
          </div>

          {userData.user_type === "Mentor" && (
            <MentorTopics
              userData={userData}
              moduleId={content.module_id}
              fetchUserData={fetchUserData}
            />
          )}

          {userData.user_type === "Admin" && (
            <AdminQuestions
              userData={userData}
              module={content}
              examId={content.exam_id}
              fetchUserData={fetchUserData}
            />
          )}

          {userData.user_type === "Student" && (
            <StudentTopics userData={userData} moduleId={content.module_id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
