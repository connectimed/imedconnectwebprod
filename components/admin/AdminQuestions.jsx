import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import Image from "next/image";
import RingLoader from "../shared/RingLoader";
import Link from "next/link";
import EmptyState from "../shared/EmptyState";
import calculateTimeAgo from "@/lib/actions/calculateTimeAgo";
import AdminSubtopics from "./AdminSubtopics";
import ChoiceChips from "../shared/ChoiceChips";

const QuestionList = ({ data, userData, fetchUserData }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [choicesAnswer, setChoicesAnswer] = useState("");
  const [boolAnswer, setBoolAnswer] = useState("");

  useEffect(() => {
    if (selectedPost) {
      const dialog = document.getElementById("question_modal");
      if (dialog) {
        dialog.showModal();
      }
    }
  }, [selectedPost]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleClose = () => {
    setSelectedPost(null);
    const dialog = document.getElementById("question_modal");
    if (dialog) {
      dialog.close();
    }
  };

  return (
    <div className="">
      {data.map((post, index) => (
        <div key={post.id}>
          <div
            className="flex flex-row items-start w-full py-2.5 text-start space-x-4"
            onClick={() => handlePostClick(post)}
          >
            <div className="flex flex-col overflow-x-hidden">
              <div className="flex flex-row text-small-regular text-slate-600 tracking-wide space-x-1">
                <p className="">{index + 1}.</p>
                <p className="">{post.question_title}</p>
              </div>

              {post.question_is_multiple && (
                <div className="mt-2 ml-4">
                  <ChoiceChips
                    choices={[
                      `A. ${post.question_choice_a}`,
                      `B. ${post.question_choice_b}`,
                      `C. ${post.question_choice_c}`,
                    ]}
                    selectedChoice={choicesAnswer}
                    onSelectChoice={setChoicesAnswer}
                  />
                </div>
              )}

              {!post.question_is_multiple && (
                <div className="mt-2 ml-4">
                  <ChoiceChips
                    choices={["True", "False"]}
                    selectedChoice={boolAnswer}
                    onSelectChoice={setBoolAnswer}
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

const AdminQuestions = ({ userData, module, examId, fetchUserData }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getQuestions = async (next = true) => {
    const dbInstance = collection(db, "Questions");
    let q = query(
      dbInstance,
      where("question_parent_module", "==", module.module_id),
      orderBy("question_posted_time")
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
      getQuestions(false);
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
        />
      )}
    </div>
  );
};

export default AdminQuestions;
