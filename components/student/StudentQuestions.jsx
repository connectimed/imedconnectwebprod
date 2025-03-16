import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import RingLoader from "../shared/RingLoader";
import EmptyState from "../shared/EmptyState";
import QuestionChoiceChips from "../shared/QuestionChoiceChips";

const QuestionList = ({ data, userData, fetchUserData, moduleId }) => {
  const [answers, setAnswers] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);

  const updatePoints = (selectedQuestion, isCorrect) => {
    const previousAnswer = answers[selectedQuestion.id];

    // Check if the previous answer was correct
    if (previousAnswer?.isCorrect && !isCorrect) {
      setTotalPoints((prevPoints) => prevPoints - 4); // Subtract points if switching from correct to wrong
    } else if (!previousAnswer?.isCorrect && isCorrect) {
      setTotalPoints((prevPoints) => prevPoints + 4); // Add points if switching from wrong to correct
    }
  };

  const handleChoiceSelect = (selectedChoice, selectedQuestion) => {
    const isCorrect =
      selectedChoice[0] === selectedQuestion.question_choices_answer;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [selectedQuestion.id]: {
        choice: selectedChoice,
        type: "multiple",
        isCorrect,
      },
    }));

    updatePoints(selectedQuestion, isCorrect);

    if (isCorrect) {
      console.log(`Question ${selectedQuestion.id}: Correct`);
    } else {
      console.log(
        `Question ${selectedQuestion.id}: Wrong - ${selectedChoice[0]} is incorrect, expected ${selectedQuestion.question_choices_answer}`
      );
    }
  };

  const savePoints = async (e) => {
    const userRef = doc(db, "Users", userData.user_id);
    await updateDoc(userRef, {
      [`user_exams.${moduleId}`]: totalPoints,
    });
  };

  useEffect(() => {
    savePoints();
    console.log("changed");
  }, [totalPoints]);

  const handleBoolSelect = (selectedChoice, selectedQuestion) => {
    const isCorrect = selectedChoice === selectedQuestion.question_bool_answer;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [selectedQuestion.id]: {
        choice: selectedChoice,
        type: "boolean",
        isCorrect,
      },
    }));

    updatePoints(selectedQuestion, isCorrect);

    if (isCorrect) {
      console.log(`Question ${selectedQuestion.id}: Correct`);
    } else {
      console.log(
        `Question ${selectedQuestion.id}: Wrong - ${selectedChoice} is incorrect, expected ${selectedQuestion.question_bool_answer}`
      );
    }
  };

  return (
    <div className="">
      {data.map((post, index) => (
        <div key={post.id}>
          <div className="flex flex-row items-start w-full py-2.5 text-start space-x-4">
            <div className="flex flex-col overflow-x-hidden">
              <div className="flex flex-row text-small-regular text-slate-600 tracking-wide space-x-1">
                <p className="">{index + 1}.</p>
                <p className="">{post.question_title}</p>
              </div>

              {post.question_is_multiple && (
                <div className="mt-2 ml-4">
                  <QuestionChoiceChips
                    choices={[
                      `A. ${post.question_choice_a}`,
                      `B. ${post.question_choice_b}`,
                      `C. ${post.question_choice_c}`,
                    ]}
                    selectedChoice={answers[post.id]?.choice || ""}
                    onSelectChoice={(choice) =>
                      handleChoiceSelect(choice, post)
                    }
                  />
                </div>
              )}

              {!post.question_is_multiple && (
                <div className="mt-2 ml-4">
                  <QuestionChoiceChips
                    choices={["True", "False"]}
                    selectedChoice={answers[post.id]?.choice || ""}
                    onSelectChoice={(choice) => handleBoolSelect(choice, post)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const StudentQuestions = ({ userData, module, examId, fetchUserData }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getQuestions = async () => {
    const dbInstance = collection(db, "Questions");
    let q = query(
      dbInstance,
      where("question_parent_module", "==", module.module_id),
      orderBy("question_posted_time"),
      limit(10)
    );

    setLoading(true);
    try {
      const data = await getDocs(q);
      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      setQuestions(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      getQuestions();
    }
  }, [userData]);

  return (
    <div className="flex flex-col">
      {loading && (
        <div className="flex flex-col justify-center h-36">
          <RingLoader />
        </div>
      )}
      {!loading && questions.length === 0 ? (
        <EmptyState
          title={"No Questions Found"}
          desc={
            "There are no questions in this exam, once they are added they will appear here."
          }
        />
      ) : (
        <QuestionList
          data={questions}
          userData={userData}
          fetchUserData={fetchUserData}
          moduleId={module.module_id}
        />
      )}
    </div>
  );
};

export default StudentQuestions;
