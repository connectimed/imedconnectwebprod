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

const AdminAddExam = ({ userData, fetchUserData, module, setCanfetch }) => {
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
        <p className="text-body-bold md:text-heading3-bold text-slate-800">
          Create Exam
        </p>
        <p className="text-small-regular text-slate-500 mt-2 tracking-wide  border-b border-slate-200 pb-2">
          Begin crafting a thorough exam to evaluate graduates' grasp and
          application of the module's key concepts and skills. Incorporate a
          variety of question types, including multiple-choice and true/false
          questions, while ensuring the exam aligns with the module's
          objectives. You can include as many questions as needed; the system
          will randomly select and present them to students, ensuring each exam
          is unique.
        </p>

        <div className="flex flex-row justify-end mt-4">
          <PrimaryButton
            text="Create Exam"
            action={() => document.getElementById("create_exam").showModal()}
          />
        </div>
      </div>
      <dialog id="create_exam" className="modal">
        <div className="modal-box text-slate-700 tracking-wide">
          <p className="font-bold text-base-regular">Create an exam!</p>
          <p className="text-small-regular">
            Enter exam title and instructions.
          </p>

          <div className="mt-2">
            <input
              type="text"
              autoComplete="full_name"
              className="simple_textinput"
              placeholder="Title"
              value={examTitle}
              onChange={handleTitleChange}
            />
          </div>

          <div className="mt-4">
            <textarea
              rows={3}
              className="simple_textinput max-h-32 min-h-24"
              defaultValue={""}
              placeholder="Instructions"
              value={instr}
              onChange={handleInstructionsChange}
            />
          </div>
          <p className="mt-2 text-subtle-regular">Exam duration in minutes</p>
          <div className="flex flex-row items-center space-x-4 mt-1">
            <input
              type="text"
              className="short_textinput"
              placeholder="Min"
              value={duration}
              onChange={handleDurationChange}
            />
            <p className="text-base-regular">Minutes</p>
          </div>

          <div className="w-full">
            {error && (
              <div className="bg-red-200 text-red-700 text-center text-small-regular px-4 py-3 rounded-md mb-6 mt-4">
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-row items-center justify-end w-full mt-5 space-x-4 ">
            <div className="">
              <button
                className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
            <button
              className="text-small-regular text-white bg-primary-deep-light rounded-lg px-6 py-1.5"
              onClick={submitPost}
            >
              <p>Submit</p>
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AdminAddExam;
