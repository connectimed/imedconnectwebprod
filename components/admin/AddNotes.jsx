import React, { useState } from "react";
import Image from "next/image";
import Submitter from "../shared/Submitter";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

const AddNotes = ({ userData, fetchUserData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleTitleChange = (e) => {
    const inputValue = e.target.value.slice(0, 60);
    setTitle(inputValue);
  };

  const handleDescChange = (e) => {
    const inputValue = e.target.value.slice(0, 350);
    setDesc(inputValue);
  };

  const handleClose = () => {
    document.getElementById("create_notice").close();
  };

  const submitPost = async (e) => {
    e.preventDefault();

    if (title.length < 8) {
      setError("Please enter a longer title.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (desc.length < 200) {
      setError("Please enter a longer description.");
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

      const noticeRef = collection(db, "NoticeBoard");
      const docRef = await addDoc(noticeRef, {
        notice_title: title.trim(),
        notice_target: ["general"],
        notice_description: desc.trim(),
        notice_submitted_time: serverTimestamp(),
        notice_visibility: true,
        notice_id: "-",
      });

      const newDocId = docRef.id;

      await setDoc(
        doc(noticeRef, newDocId),
        {
          notice_id: newDocId,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error during form submission:", error);
      setIsSubmitting(false);
      setError("Failed! Try again.");
    } finally {
      setIsSubmitting(false);
      setTitle("");
      setDesc("");
      fetchUserData(userData.user_id);
      //   router.push("/");
    }
  };

  return (
    <div>
      {isSubmitting && <Submitter />}
      <div className="flex flex-row justify-between items-center w-full border rounded-xl bg-white px-4 py-3">
        <div className="flex flex-row space-x-2 md:space-x-4 items-center">
          <Image
            className="h-8 w-8"
            src="/icons/doc-inactive.svg"
            height={200}
            width={200}
            alt="arrow icon"
          />

          <div className="tracking-wide">
            <p className="text-small-medium md:text-base-medium text-slate-600">
              Add Notice
            </p>
            <p className="text-subtle-regular md:text-small-regular text-slate-400">
              Click to add to noticeboard.
            </p>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="bg-primary-light text-white text-small-semibold md:text-base-semibold border rounded-lg px-5 py-1 tracking-wide"
            onClick={() => document.getElementById("create_notice").showModal()}
          >
            Create
          </button>
          <dialog id="create_notice" className="modal">
            <div className="modal-box text-slate-700 tracking-wide">
              <p className="font-bold text-base-regular">Create a notice!</p>
              <p className="text-small-regular">
                Enter notice title and description.
              </p>

              <div className="mt-2">
                <input
                  type="text"
                  autoComplete="full_name"
                  className="simple_textinput"
                  placeholder="Title"
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>

              <div className="mt-4">
                <textarea
                  rows={3}
                  className="simple_textinput max-h-32 min-h-24"
                  defaultValue={""}
                  placeholder="Description"
                  value={desc}
                  onChange={handleDescChange}
                />
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
      </div>
    </div>
  );
};

export default AddNotes;
