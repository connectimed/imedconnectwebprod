import Image from "next/image";
import React, { useEffect, useState } from "react";
import DangerButton from "../shared/DangerButton";
import { deleteObject, ref } from "firebase/storage";
import { storage, db } from "@/lib/firebase/firebase";
import {
  arrayUnion,
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
import AdminQuestions from "../admin/AdminQuestions";
import StudentQuestions from "./StudentQuestions";

const StudentTakeExam = ({ userData, module, fetchUserData, setCanfetch }) => {
  const durationInMinutes = parseInt(module.module_exam_duration, 10);
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);
  const [start, setStart] = useState(false);
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
  const longText =
    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.    ";

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
    document.getElementById("take_exam").close();
  };

  const handleStart = async (id) => {
    setStart(true);
    const moduleRef = doc(db, "Modules", module.module_id);
    await updateDoc(moduleRef, {
      module_students_taken_exam: arrayUnion(userData.user_id),
    });
  };
  const startExam = (id) => {
    // router.push(`/modules/exams/${id}`);
  };

  const submitPost = async (e) => {
    fetchUserData(userData.user_id);
  };

  useEffect(() => {
    if (start) {
      if (timeLeft <= 0) {
        console.log("time out");
        fetchUserData(userData.user_id);
        return;
      }

      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId); // Cleanup on unmount
    }
  }, [timeLeft, start]);
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours}hr ${minutes}min ${secs.toString().padStart(2, "0")}sec`;
  };

  return (
    <div className="flex flex-row justify-between items-center w-full bg-white border-2 border-slate-200 px-6 py-4 rounded-xl">
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

        <div className="flex flex-row justify-end mt-4">
          <PrimaryButton
            text="Take Exam"
            action={() => document.getElementById("take_exam").showModal()}
          />
        </div>
      </div>
      <dialog id="take_exam" className="modal">
        <div className="modal-box text-slate-700 tracking-wide">
          {!start ? (
            <div>
              <Image
                className="h-10 w-10"
                src="/icons/exam_info.svg"
                height={512}
                width={512}
                alt="icon"
              />
              <p className="font-bold text-base-regular">Examination Notice!</p>
              <p className="text-small-regular">
                You are about to begin your exam, which consists of 25
                questions, each worth 4 marks. Once started, the exam cannot be
                canceled. It will automatically submit when the time runs out.
                You have {module.module_exam_duration} minutes to complete the
                exam.
              </p>

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
                  onClick={() => handleStart()}
                >
                  <p>Start</p>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-row justify-center bg-red-200 fixed top-0 left-0 w-full z-50 px-4 py-2">
                <p className="text-subtle-regular">
                  Time left: {formatTime(timeLeft)}
                </p>
              </div>
              <div className="mt-2 h-96 overflow-y-scroll">
                <p className="font-bold text-base-regular mt-4">
                  {module.module_exam_title}
                </p>
                <p className="text-small-regular">
                  {module.module_exam_instructions}
                </p>
                <p className="text-slate-700 text-base-semibold mt-4">
                  Questions:
                </p>
                {userData.user_type === "Student" && (
                  <StudentQuestions
                    userData={userData}
                    module={module}
                    examId={module.exam_id}
                    fetchUserData={fetchUserData}
                  />
                )}
              </div>
              <div className="flex flex-row items-center justify-end w-full mt-5 space-x-4">
                <div className="">
                  <button
                    className="text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
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
          )}
        </div>
      </dialog>
    </div>
  );
};

export default StudentTakeExam;
