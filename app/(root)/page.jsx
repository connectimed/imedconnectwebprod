"use client";
import React from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import { Guardian } from "@/components/shared/Guardian";
import NoticeBoard from "@/components/student/NoticeBoard";
import MyModules from "@/components/student/MyModules";
import AchievementsSection from "@/components/student/AchievementsSection";
import StudentHero from "@/components/student/StudentHero";
import MentorHero from "@/components/mentor/MentorHero";
import MentorNoticeBoard from "@/components/mentor/MentorNoticeBoard";
import RingLoader from "@/components/shared/RingLoader";
import AdminHero from "@/components/admin/AdminHero";
import AdminNoticeBoard from "@/components/admin/AdminNoticeBoard";
import AddNotes from "@/components/admin/AddNotes";
import AdminNewStudents from "@/components/admin/AdminNewStudents";
import AdminAllAdmins from "@/components/admin/AdminAllAdmins";
import AdminNewMentors from "@/components/admin/AdminNewMentors";
import MentorBookingStudents from "@/components/mentor/MentorBookingStudents";
import StudentsMyMentors from "@/components/student/StudentsMyMentors";
import StudentsMyExams from "@/components/student/StudentsMyExams";
import AdminExams from "@/components/admin/AdminExams";
import AdminTrashedStudents from "@/components/admin/AdminTrashedStudents";
import AdminTrashedMentors from "@/components/admin/AdminTrashedMentors";
import AdminNewEntrepreneurs from "@/components/admin/AdminNewEntrepreneurs";

export default function Home() {
  const { authLoading, userData, firebaseUser, fetchUserData, fireLoaded } =
    UserAuth();

  const authRedirectComponent = Guardian(userData, firebaseUser, fireLoaded);

  if (authRedirectComponent) {
    return authRedirectComponent;
  }

  if (userData.user_type === "Student") {
    return (
      <div className="flex flex-col gap-8">
        {/* 1x1 */}
        <StudentHero userData={userData} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <NoticeBoard userData={userData} />
          </div>
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <MyModules userData={userData} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <StudentsMyMentors
              userData={userData}
              fetchUserData={fetchUserData}
            />
          </div>
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <StudentsMyExams
              userData={userData}
              fetchUserData={fetchUserData}
            />
          </div>
        </div>

        {/* 2x1 */}
        {/* <div>
          <AchievementsSection />
        </div> */}
      </div>
    );
  }

  if (userData.user_type === "Mentor") {
    return (
      <div className="flex flex-col gap-8">
        {/* 1x1 */}
        <MentorHero userData={userData} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <MentorNoticeBoard userData={userData} />
          </div>
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <MentorBookingStudents
              userData={userData}
              fetchUserData={fetchUserData}
            />
          </div>
        </div>
      </div>
    );
  }

  if (userData.user_type === "Entrepreneur") {
    return (
      <div className="flex flex-col gap-8">
        <StudentHero userData={userData} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <NoticeBoard userData={userData} />
          </div>
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <MyModules userData={userData} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <StudentsMyMentors
              userData={userData}
              fetchUserData={fetchUserData}
            />
          </div>
        </div>
      </div>
    );
  }

  if (userData.user_type === "Admin") {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        {/* 1x1 */}
        <AdminHero userData={userData} />

        <AddNotes userData={userData} fetchUserData={fetchUserData} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <AdminNoticeBoard
              userData={userData}
              fetchUserData={fetchUserData}
            />
          </div>
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <AdminNewStudents
              userData={userData}
              fetchUserData={fetchUserData}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <AdminNewMentors
              userData={userData}
              fetchUserData={fetchUserData}
            />
          </div>
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <AdminAllAdmins userData={userData} fetchUserData={fetchUserData} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <AdminNewEntrepreneurs
              userData={userData}
              fetchUserData={fetchUserData}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <AdminTrashedMentors
              userData={userData}
              fetchUserData={fetchUserData}
            />
          </div>
          <div className="h-96 rounded-xl border-2 border-slate-200 bg-white">
            <AdminTrashedStudents
              userData={userData}
              fetchUserData={fetchUserData}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center h-full">
      <RingLoader />
    </div>
  );
}
