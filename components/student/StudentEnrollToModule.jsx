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

      // create chat head
      const docRef = doc(messagingRef, moduleId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // Update the existing document
        await updateDoc(docRef, {
          session_participants_ids: arrayUnion(userData.user_id),
          session_group_name: moduleTitle,
          session_last_interaction: serverTimestamp(),
          session_participants_names: arrayUnion(
            `${userData.user_id}-${userData.user_full_name}`
          ),
          session_participants_profiles: arrayUnion(
            `${userData.user_id}-${userData.user_image}`
          ),
          session_participants_types: arrayUnion(
            `${userData.user_id}-${userData.user_type}`
          ),
        });
      } else {
        // Create a new document
        await setDoc(docRef, {
          session_id: moduleId,
          session_is_group: true,
          session_group_name: moduleTitle,
          session_group_profile:
            "https://firebasestorage.googleapis.com/v0/b/imed-connect-staging.appspot.com/o/Placeholders%2Fgroup-profile.jpg?alt=media&token=daaf9c10-9856-40c7-a422-bc338b181b42",
          session_last_interaction: serverTimestamp(),
          session_participants_ids: [userData.user_id],
          session_participants_names: [
            `${userData.user_id}-${userData.user_full_name}`,
          ],
          session_participants_profiles: [
            `${userData.user_id}-${userData.user_image}`,
          ],
          session_participants_types: [
            `${userData.user_id}-${userData.user_type}`,
          ],
          session_last_text: "Be the first to send a message.",
          session_last_text_seen_by: [],
          session_blocked_users: [],
          session_read_only_users: [],
          session_admins: [],
        });
      }

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
