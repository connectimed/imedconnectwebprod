"use client";
import AddTopic from "@/components/admin/AddTopic";
import AdminAddExam from "@/components/admin/AdminAddExam";
import AdminModuleExam from "@/components/admin/AdminModuleExam";
import AdminTopics from "@/components/admin/AdminTopics";
import DeleteModule from "@/components/admin/DeleteModule";
import MentorInfoCard from "@/components/mentor/MentorInfoCard";
import MentorTopics from "@/components/mentor/MentorTopics";
import { Guardian } from "@/components/shared/Guardian";
import NotFound from "@/components/shared/NotFound";
import RingLoader from "@/components/shared/RingLoader";
import TimeAgo from "@/components/shared/TimeAgo";
import StudentEnrollToModule from "@/components/student/StudentEnrollToModule";
import StudentExamResults from "@/components/student/StudentExamResults";
import StudentTakeExam from "@/components/student/StudentTakeExam";
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
  const [canFetch, setCanfetch] = useState("fetch");
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
        const data = await getContentById(params.moduleId);
        // setNewStatus(data.package_status);
        // setStatus(data.package_status);
        setContent(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching press release:", error);
      }
    };

    fetchContentData();
  }, [canFetch]);

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
        <AddTopic
          userData={userData}
          fetchUserData={fetchUserData}
          topicsCount={content.module_topics_count}
          moduleId={content.module_id}
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Image
            alt=""
            src={content.module_image}
            height={1080}
            width={1920}
            className="w-full aspect-video rounded-md object-cover"
          />

          <div className="h-full rounded-lg">
            <div>
              <MentorInfoCard
                profileUrl={content.module_poster_image}
                profileName={content.module_poster_name}
                profileFieldOfStudy={content.module_poster_field_of_study}
                profileId={content.module_poster_id}
              />
              <p className="text-base-medium font-bold mt-2 text-slate-700">
                {content.module_title}
              </p>
              <p className="text-small-regular text-slate-600">
                {content.module_description}
              </p>
              <div className="flex flex-row justify-between mt-1">
                <div className="flex flex-row text-subtle-regular text-slate-400">
                  <p className="mr-1 ">{content.module_topics_count}</p>
                  <p className="">
                    {content.module_topics_count === 1 ? "topic" : "topics"}
                  </p>
                </div>

                <div className="flex flex-row space-x-1 text-subtle-regular text-slate-400 tracking-wide">
                  <p className="">Posted:</p>
                  <TimeAgo timestamp={content.module_posted_time} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* topics */}
        <div className=" mt-4 ">
          <div className="flex flex-row justify-between border-b pt-2">
            <p className="pb-2 text-base-regular font-bold tracking-wide">
              Topics:
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
            <AdminTopics
              userData={userData}
              moduleId={content.module_id}
              fetchUserData={fetchUserData}
            />
          )}

          {userData.user_type === "Student" && (
            <StudentTopics userData={userData} moduleId={content.module_id} />
          )}
        </div>
      </div>

      {userData.user_type === "Admin" && (
        <div className="mt-6">
          {content.module_has_exam ? (
            <AdminModuleExam
              userData={userData}
              module={content}
              fetchUserData={fetchUserData}
              setCanfetch={setCanfetch}
            />
          ) : (
            <AdminAddExam
              userData={userData}
              fetchUserData={fetchUserData}
              module={content}
              setCanfetch={setCanfetch}
            />
          )}
        </div>
      )}

      {userData.user_type === "Student" &&
        userData.user_modules.includes(content.module_id) &&
        content.module_has_exam && (
          <div className="mt-6">
            {userData.user_exams.hasOwnProperty(content.module_id) ? (
              <StudentExamResults
                userData={userData}
                fetchUserData={fetchUserData}
                module={content}
                setCanfetch={setCanfetch}
              />
            ) : (
              <StudentTakeExam
                userData={userData}
                module={content}
                fetchUserData={fetchUserData}
                setCanfetch={setCanfetch}
              />
            )}
          </div>
        )}

      {userData.user_type === "Admin" && (
        <div className="mt-6">
          <DeleteModule
            userData={userData}
            module={content}
            fetchContentData={fetchUserData}
          />
        </div>
      )}
    </div>
  );
};

export default page;
