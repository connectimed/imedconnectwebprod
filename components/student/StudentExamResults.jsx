import Image from "next/image";
import React, { useEffect, useState } from "react";
import DangerButton from "../shared/DangerButton";
import { deleteObject, ref } from "firebase/storage";
import { storage, db } from "@/lib/firebase/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import PrimaryButton from "../shared/PrimaryButton";
import RingLoader from "../shared/RingLoader";

const StudentExamResults = ({
  userData,
  fetchUserData,
  module,
  setCanfetch,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [duration, setDuration] = useState("60");
  const [instr, setInstr] = useState("");

  const handleTitleChange = (e) => {
    const inputValue = e.target.value.slice(0, 60);
    setExamTitle(inputValue);
  };

  const handleInstructionsChange = (e) => {
    const inputValue = e.target.value.slice(0, 350);
    setInstr(inputValue);
  };

  const handleDurationChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, "").slice(0, 2); // Remove non-numeric characters and limit to 2 digits
    setDuration(numericValue);
  };

  const handleClose = () => {
    document.getElementById("create_exam").close();
  };

  const submitPost = async (e) => {
    e.preventDefault();

    if (examTitle.length < 8) {
      setError("Please enter a longer name.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (instr.length < 120) {
      setError("Please enter a longer instructions.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      handleClose();

      const moduleRef = doc(db, "Modules", module.module_id);
      await updateDoc(moduleRef, {
        module_has_exam: true,
        module_exam_title: examTitle.trim(),
        module_exam_instructions: instr.trim(),
        module_exam_duration: duration,
        module_exam_submitted_time: serverTimestamp(),
        module_exam_total_questions: 0,
        module_students_taken_exam: [],
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      setIsSubmitting(false);
      setError("Failed! Try again.");
    } finally {
      setIsSubmitting(false);
      setExamTitle("");
      setInstr("");
      setCanfetch("delete");
      // fetchUserData(userData.user_id);
      //   router.push("/");
    }
  };

  const handleStartDelete = () => {
    // setIsDeleting(true);
  };

  return (
    <div className="flex flex-row justify-between items-center w-full bg-white border-2 border-success-2 px-6 py-4 rounded-xl">
      <div className="">
        <div className="flex flex-row justify-between">
          <p className="text-body-bold md:text-heading3-bold text-slate-800">
            Examination Results
          </p>
          <p className="text-body-bold md:text-heading3-bold text-slate-800">
            Score: {userData.user_exams[module.module_id]}%
          </p>
        </div>
        <div className="border-t border-slate-200 mt-1 pt-4">
          <p className="text-subtle-regular text-slate-600">Examination</p>
          <p className="text-base-semibold text-slate-800">
            {module.module_exam_title}
          </p>
          <p className="text-small-regular text-slate-500 mt-2 tracking-wide pb-2">
            {module.module_exam_instructions}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentExamResults;
