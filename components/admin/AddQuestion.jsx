import React, { useEffect, useState } from "react";
import Image from "next/image";
import Submitter from "../shared/Submitter";
import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import QuestionTypeSelector from "../shared/QuestionTypeSelector";
import ChoiceChips from "../shared/ChoiceChips";

const AddQuestion = ({ userData, fetchUserData, module }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [selectedQuestionType, setSelectedQuestionType] =
    useState("Multiple Choices");
  const [choicesAnswer, setChoicesAnswer] = useState("");
  const [choiceA, setChoiceA] = useState("");
  const [choiceB, setChoiceB] = useState("");
  const [choiceC, setChoiceC] = useState("");
  const [boolAnswer, setBoolAnswer] = useState("");

  const handleInputChange = (setter, limit) => (e) => {
    const inputValue = e.target.value.slice(0, limit);
    setter(inputValue);
  };

  const handleTypeChange = (type) => {
    setSelectedQuestionType(type);
    setChoiceA("");
    setChoiceB("");
    setChoiceC("");
    setChoicesAnswer("");
    setBoolAnswer("");
  };

  const handleClose = () => {
    document.getElementById("create_topic").close();
  };

  const submitQuestion = async (e) => {
    e.preventDefault();

    if (question.length < 3) {
      setError("Please enter a longer question.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (selectedQuestionType === "Multiple Choices") {
      if (!choiceA || !choiceB || !choiceC) {
        setError("Please enter all three choices.");
        setTimeout(() => setError(""), 2000);
        return;
      }

      if (!choicesAnswer) {
        setError("Please select the correct answer.");
        setTimeout(() => setError(""), 2000);
        return;
      }
    } else {
      if (!boolAnswer) {
        setError("Please select the correct answer.");
        setTimeout(() => setError(""), 2000);
        return;
      }
    }

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      handleClose();

      const topicsRef = collection(db, "Questions");
      const docRef = await addDoc(topicsRef, {
        question_title: question.trim(),
        question_is_multiple: selectedQuestionType === "Multiple Choices",
        question_choice_a: choiceA,
        question_choice_b: choiceB,
        question_choice_c: choiceC,
        question_choices_answer: choicesAnswer,
        question_bool_answer: boolAnswer,
        question_parent_module: module.module_id,
        question_poster_id: userData.user_id,
        question_poster_name: userData.user_full_name,
        question_poster_image: userData.user_image,
        question_poster_field_of_study: userData.user_highest_field_of_study,
        question_posted_time: serverTimestamp(),
        question_updated_time: serverTimestamp(),
        question_visibility: true,
        question_id: "",
      });

      const newDocId = docRef.id;

      // Update topic
      const updateTopicRef = doc(db, "Questions", newDocId);
      await updateDoc(updateTopicRef, {
        question_id: newDocId,
      });

      // Update parent exam
      const moduleRef = doc(db, "Modules", module.module_id);
      await updateDoc(moduleRef, {
        module_exam_total_questions: increment(1),
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      setIsSubmitting(false);
      setError("Failed! Try again.");
    } finally {
      setIsSubmitting(false);
      setQuestion("");
      setChoiceA("");
      setChoiceB("");
      setChoiceC("");
      setChoicesAnswer("");
      setBoolAnswer("");
      fetchUserData(userData.user_id);
    }
  };

  return (
    <div>
      {isSubmitting && <Submitter />}
      <div className="flex flex-row justify-between items-center w-full border rounded-xl bg-white px-4 py-3 mb-4">
        <div className="flex flex-row space-x-4 items-center">
          <Image
            className="h-8 w-8"
            src="/icons/question-square.svg"
            height={200}
            width={200}
            alt="arrow icon"
          />

          <div className="tracking-wide">
            <p className="text-base-medium text-slate-600">Add Question</p>
            <p className="text-small-regular text-slate-400">
              Click to add a question to this exam.
            </p>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="bg-primary-light text-white text-base-semibold border rounded-lg px-5 py-1 tracking-wide"
            onClick={() => document.getElementById("create_topic").showModal()}
          >
            Add
          </button>
          <dialog id="create_topic" className="modal">
            <div className="modal-box tracking-wide p-4 md:p-6">
              <p className="font-bold text-base-regular text-slate-700">
                Add question!
              </p>
              <p className="text-subtle-regular text-slate-500">
                Please enter a question along with its corresponding answer.
              </p>

              <div className="mt-2">
                <QuestionTypeSelector onTypeChange={handleTypeChange} />
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  className="simple_textinput"
                  placeholder="Question"
                  value={question}
                  onChange={handleInputChange(setQuestion, 240)}
                />
              </div>
              {selectedQuestionType === "Multiple Choices" && (
                <div>
                  <p className="text-subtle-regular text-slate-500 mt-4">
                    Please enter three choices.
                  </p>

                  <div className="relative mt-2">
                    <input
                      type="text"
                      placeholder="First choice"
                      className="start_icon_simple_textinput"
                      value={choiceA}
                      onChange={handleInputChange(setChoiceA, 240)}
                    />

                    <span className="pointer-events-none absolute inset-y-0 start-0 grid w-10 place-content-center text-gray-500">
                      <p className="text-small-regular">A.</p>
                    </span>
                  </div>

                  <div className="relative mt-3">
                    <input
                      type="text"
                      placeholder="Second choice"
                      className="start_icon_simple_textinput"
                      value={choiceB}
                      onChange={handleInputChange(setChoiceB, 240)}
                    />

                    <span className="pointer-events-none absolute inset-y-0 start-0 grid w-10 place-content-center text-gray-500">
                      <p className="text-small-regular">B.</p>
                    </span>
                  </div>

                  <div className="relative mt-3">
                    <input
                      type="text"
                      placeholder="Third choice"
                      className="start_icon_simple_textinput"
                      value={choiceC}
                      onChange={handleInputChange(setChoiceC, 240)}
                    />

                    <span className="pointer-events-none absolute inset-y-0 start-0 grid w-10 place-content-center text-gray-500">
                      <p className="text-small-regular">C.</p>
                    </span>
                  </div>

                  <p className="text-subtle-regular text-slate-500 mt-4">
                    Please select the correct answer.
                  </p>
                  <div className="mt-2">
                    <ChoiceChips
                      choices={["A", "B", "C"]}
                      selectedChoice={choicesAnswer}
                      onSelectChoice={setChoicesAnswer}
                    />
                  </div>
                </div>
              )}

              {selectedQuestionType === "True Or False" && (
                <div>
                  <p className="text-subtle-regular text-slate-500 mt-4">
                    Please select the correct answer.
                  </p>
                  <div className="mt-2">
                    <ChoiceChips
                      choices={["True", "False"]}
                      selectedChoice={boolAnswer}
                      onSelectChoice={setBoolAnswer}
                    />
                  </div>
                </div>
              )}

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
                  onClick={submitQuestion}
                  disabled={isSubmitting}
                >
                  <p>Add Question</p>
                </button>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;
