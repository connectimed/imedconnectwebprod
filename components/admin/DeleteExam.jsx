import React, { useEffect, useState } from "react";
import DangerButton from "../shared/DangerButton";
import { db } from "@/lib/firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const DeleteExam = ({ exam }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const router = useRouter();

  useEffect(() => {
    let timer;
    if (isDeleting && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleDeleteModule();
    }
    return () => clearInterval(timer);
  }, [isDeleting, countdown]);

  const handleDeleteModule = async () => {
    try {
      // Reference to the exam document in Firestore
      const examDocRef = doc(db, "Examinations/AllExams/general", exam.exam_id);

      // Delete the exam document
      await deleteDoc(examDocRef);
      console.log("Exam document deleted successfully");

      // Navigate to the '/modules' page
      router.push("/exams");
    } catch (error) {
      console.error("Error deleting exam or image: ", error);
      // Reset state on error
      setIsDeleting(false);
      setCountdown(15);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setCountdown(15);
  };

  const handleStartDelete = () => {
    setIsDeleting(true);
  };

  return (
    <div className="flex flex-row justify-between items-center w-full bg-white border-2 border-red-200 px-6 py-4 rounded-xl">
      <div className="">
        <p className="text-body-bold md:text-heading3-bold text-slate-800">
          Delete Exam
        </p>
        <p className="text-small-regular text-slate-500 mt-2 tracking-wide  border-b border-slate-200 pb-2">
          The exam will be permanently deleted, including its questions and
          interactions. This action is irreversible and can not be undone.
        </p>
        <div className="flex flex-row mt-4 space-x-3 text-slate-600 border-b border-slate-200 pb-4">
          <div>
            <p className="text-small-regular font-extrabold">
              {exam.exam_title}
            </p>
            <p className="text-small-regular line-clamp-3 max-w-lg font-normal text-slate-500">
              {exam.exam_instructions}
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-end mt-4">
          {isDeleting ? (
            <DangerButton
              text={`Cancel ${countdown}s`}
              action={handleCancelDelete}
            />
          ) : (
            <DangerButton text="Delete" action={handleStartDelete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteExam;
