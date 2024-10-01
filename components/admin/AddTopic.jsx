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
import { auth, db, storage } from "@/lib/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const AddTopic = ({ userData, fetchUserData, topicsCount, moduleId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    "/images/horizontal-placeholder.jpg"
  );

  const handleInputChange = (setter, limit) => (e) => {
    const inputValue = e.target.value.slice(0, limit);
    setter(inputValue);
  };

  const handleThumbnailChange = (setter, previewSetter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      // Create a temporary URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      previewSetter(previewUrl);
    }
  };

  const handleClose = () => {
    document.getElementById("create_topic").close();
  };

  const submitPost = async (e) => {
    e.preventDefault();

    if (!selectedThumbnail) {
      setError("Please select a thumbnail.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (title.length < 8) {
      setError("Please enter a longer title.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (desc.length < 120) {
      setError("Please enter a longer description.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      handleClose();

      const topicsRef = collection(db, "Topics");
      const docRef = await addDoc(topicsRef, {
        topic_title: title.trim(),
        topic_description: desc.trim(),
        topic_parent_module: moduleId,
        topic_poster_id: userData.user_id,
        topic_poster_name: userData.user_full_name,
        topic_poster_image: userData.user_image,
        topic_poster_field_of_study: userData.user_highest_field_of_study,
        topic_posted_time: serverTimestamp(),
        topic_updated_time: serverTimestamp(),
        topic_status: "APPROVED",
        topic_thumbnail: "",
        topic_visibility: true,
        topic_id: "",
      });

      const newDocId = docRef.id;

      // Upload thumbnail
      const thumbnailRef = ref(storage, `Topics/Thumbnails/2024/${newDocId}`);
      await uploadBytes(thumbnailRef, selectedThumbnail);
      const thumbUrl = await getDownloadURL(thumbnailRef);

      // Update topic
      const updateTopicRef = doc(db, "Topics", newDocId);
      await updateDoc(updateTopicRef, {
        topic_id: newDocId,
        topic_thumbnail: thumbUrl,
      });

      // Update parent module
      const moduleRef = doc(db, "Modules", moduleId);
      await updateDoc(moduleRef, {
        module_topics_count: increment(1),
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      setIsSubmitting(false);
      setError("Failed! Try again.");
    } finally {
      setIsSubmitting(false);
      setTitle("");
      setDesc("");
      setSelectedThumbnail(null);
      setThumbnailPreview("/images/horizontal-placeholder.jpg");
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
            src="/icons/add-inactive.svg"
            height={200}
            width={200}
            alt="arrow icon"
          />

          <div className="tracking-wide">
            <p className="text-base-medium text-slate-600">Add Topic</p>
            <p className="text-small-regular text-slate-400">
              Click to add topic to this module.
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
                Add topic!
              </p>
              <p className="text-subtle-regular text-slate-500">
                Please select a thumbnail, then enter a title and description to
                create a topic. After the topic is added, you'll be able to add
                subtopics.
              </p>

              <div className="relative w-full h-48 mt-3">
                <Image
                  className="w-full h-48 object-cover border border-slate-200 rounded-lg cursor-pointer"
                  src={thumbnailPreview}
                  height={512}
                  width={512}
                  alt="Module image"
                  onClick={() => document.getElementById("imageInput").click()}
                />
                <input
                  type="file"
                  id="imageInput"
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailChange(
                    setSelectedThumbnail,
                    setThumbnailPreview
                  )}
                />
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  autoComplete="full_name"
                  className="simple_textinput"
                  placeholder="Title"
                  value={title}
                  onChange={handleInputChange(setTitle, 60)}
                />
              </div>

              <div className="mt-4">
                <textarea
                  rows={3}
                  className="simple_textinput max-h-32 min-h-24"
                  defaultValue={""}
                  placeholder="Description"
                  value={desc}
                  onChange={handleInputChange(setDesc, 1000)}
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
                  disabled={isSubmitting}
                >
                  <p>Add Topic</p>
                </button>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default AddTopic;
