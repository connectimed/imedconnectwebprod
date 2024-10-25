import React, { useState, useEffect } from "react";
import Image from "next/image";
import Submitter from "../shared/Submitter";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

const StudentEnrollToModule = ({
  userData,
  fetchUserData,
  moduleId,
  moduleTitle,
  moduleHost,
  moduleImage,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const startEnrolling = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const modulesRef = collection(db, "Modules");
      const usersRef = collection(db, "Users");
      const messagingRef = collection(
        db,
        "Messaging/MessagingSessions/AllSessions"
      );

      await updateDoc(doc(modulesRef, moduleId), {
        module_enrolled_student_ids: arrayUnion(userData.user_id),
        module_enrolled_student_images: arrayUnion(userData.user_image),
      });

      await updateDoc(doc(usersRef, userData.user_id), {
        user_modules: arrayUnion(moduleId),
        user_modules_completed: 50,
      });

      setIsSubmitting(false);
      fetchUserData(userData.user_id);
    } catch (error) {
      console.error("Error during form submission:", error);
      setIsSubmitting(false);
      setError("Failed! Try again.");
    }
  };

  return (
    <div>
      {isSubmitting && <Submitter />}
      {error && <div className="error">{error}</div>}
      <div className="flex flex-row justify-between items-center w-full border rounded-xl bg-white px-4 py-3 mb-4">
        <div className="flex flex-row space-x-4 items-center">
          <Image
            className="h-8 w-8"
            src="/icons/group-inactive.svg"
            height={200}
            width={200}
            alt="arrow icon"
          />

          <div className="tracking-wide">
            <p className="text-base-medium text-slate-600">Module enrolment</p>
            <p className="text-small-regular text-slate-400">
              Click 'Enroll' to start enrolment.
            </p>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="bg-primary-light text-white text-base-semibold border rounded-lg px-5 py-1 tracking-wide"
            onClick={startEnrolling}
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollToModule;
