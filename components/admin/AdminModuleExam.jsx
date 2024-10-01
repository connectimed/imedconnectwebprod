import Image from "next/image";
import React, { useEffect, useState } from "react";
import DangerButton from "../shared/DangerButton";
import { deleteObject, ref } from "firebase/storage";
import { storage, db } from "@/lib/firebase/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import PrimaryButton from "../shared/PrimaryButton";

const AdminModuleExam = ({ userData, module, fetchUserData, setCanfetch }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [error, setError] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [duration, setDuration] = useState("60");
  const [instr, setInstr] = useState("");
  const [exam, setExam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleId, setModuleId] = useState("");
  const router = useRouter();

  const getExam = async () => {
    const dbInstance = collection(db, "Examinations/AllExams/general");
    const q = query(
      dbInstance,
      where("exam_parent_module_id", "==", module.module_id),
      limit(1)
    );

    setLoading(true);
    try {
      const data = await getDocs(q);
      const exams = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (exams.length > 0) {
        setExam(exams[0]); // Set the first exam found
      } else {
        setExam(null); // Handle case where no exams are found
      }
    } catch (error) {
      console.error("Error fetching exam data:", error);
    } finally {
      setLoading(false); // Ensure loading state is updated after the query
    }
  };

  useEffect(() => {
    if (module) {
      getExam();
    }
  }, [module]);

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

    if (!moduleId) {
      setError("Please select associated module.");
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

      const examRef = collection(db, "Examinations/AllExams/general");
      const docRef = await addDoc(examRef, {
        exam_title: examTitle.trim(),
        exam_instructions: instr.trim(),
        exam_parent_module_id: moduleId,
        exam_parent_module_title: moduleTitle,
        exam_participants: [],
        exam_completed_participants: [],
        exam_ongoing_participants: [],
        exam_submitted_time: serverTimestamp(),
        exam_visibility: false,
        exam_duration: duration,
        exam_submitting_user: userData.user_id,
        exam_id: "-",
        exam_total_questions: 0,

        // questions
        // question_01: "",
        // question_01_choice_a: "",
        // question_01_choice_b: "",
        // question_01_choice_c: "",
        // question_01_answer: "",
      });

      const newDocId = docRef.id;

      const newExamRef = doc(db, "Examinations/AllExams/general", newDocId);
      await updateDoc(newExamRef, {
        exam_id: newDocId,
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      setIsSubmitting(false);
      setError("Failed! Try again.");
    } finally {
      setIsSubmitting(false);
      setExamTitle("");
      setInstr("");
      fetchUserData(userData.user_id);
      //   router.push("/");
    }
  };

  const handleStart = (id) => {
    router.push(`/modules/exams/${id}`);
  };

  useEffect(() => {
    let timer;
    if (isDeleting && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleDeleteExam();
    }
    return () => clearInterval(timer);
  }, [isDeleting, countdown]);

  const handleDeleteExam = async () => {
    try {
      const moduleRef = doc(db, "Modules", module.module_id);
      await updateDoc(moduleRef, {
        module_has_exam: false,
        module_exam_title: "",
        module_exam_instructions: "",
        module_exam_duration: "0",
        module_exam_submitted_time: serverTimestamp(),
        module_exam_total_questions: 0,
        module_students_taken_exam: [],
      });
    } catch (error) {
      console.error("Error deleting module or image: ", error);
      // Reset state on error
      setIsDeleting(false);
      setCountdown(15);
    } finally {
      setCanfetch("add");
      // fetchUserData(userData.user_id);
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
    <div className="flex flex-row justify-between items-center w-full bg-white border-2 border-slate-200 px-6 py-4 rounded-xl">
      {!exam ? (
        <div className="tracking-wide">
          <div className="flex flex-row items-center justify-between">
            <div>
              <p className="text-subtle-regular text-slate-600">Examination</p>
              <p className="text-base-semibold text-slate-800">
                {module.module_exam_title}
              </p>
            </div>

            <div className="text-st">
              <p className="text-tiny-regular">
                {module.module_exam_total_questions} Questions
              </p>
              <p className="text-tiny-regular">
                Duration: {module.module_exam_duration} Minutes
              </p>
            </div>
          </div>
          <p className="text-small-regular text-slate-500 mt-2 tracking-wide  border-b border-slate-200 pb-2">
            {module.module_exam_instructions}
          </p>

          <div className="flex flex-row justify-between mt-4">
            {isDeleting ? (
              <DangerButton
                text={`Cancel ${countdown}s`}
                action={handleCancelDelete}
              />
            ) : (
              <DangerButton text="Delete Exam" action={handleStartDelete} />
            )}
            <PrimaryButton
              text="View Exam"
              action={() => handleStart(module.module_id)}
            />
          </div>
        </div>
      ) : (
        <div className="">
          <div className="flex flex-row items-center justify-between">
            <p className="text-body-bold md:text-heading3-bold text-slate-800">
              Examination
            </p>

            <p>Duration: 60 Minutes</p>
          </div>
          <p className="text-small-regular text-slate-500 mt-2 tracking-wide  border-b border-slate-200 pb-2">
            The module will be permanently deleted, including its topics and
            interactions. This action is irreversible and can not be undone.
          </p>
          <div className="flex flex-row mt-4 space-x-3 text-slate-600 border-b border-slate-200 pb-4">
            <Image
              alt=""
              src={module.module_image}
              height={1080}
              width={1920}
              className="w-16 md:w-32 aspect-video rounded-md object-cover"
            />
            <div>
              <p className="text-small-regular font-extrabold">
                {module.module_title}
              </p>
              <p className="text-small-regular line-clamp-3 max-w-md font-normal text-slate-500">
                {module.module_description}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-end mt-4">
            <PrimaryButton
              text="Delete"
              // action={handleStart(module.module_id)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModuleExam;
