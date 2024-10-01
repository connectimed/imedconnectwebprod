import React, { useState } from "react";
import TextButton from "../shared/TextButton";
import Image from "next/image";
import Submitter from "../shared/Submitter";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "@/lib/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const AddModule = ({ userData, fetchUserData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "/images/horizontal-placeholder.jpg"
  );

  const handleTitleChange = (e) => {
    const inputValue = e.target.value.slice(0, 60);
    setTitle(inputValue);
  };

  const handleDescChange = (e) => {
    const inputValue = e.target.value.slice(0, 350);
    setDesc(inputValue);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    document.getElementById("create_module").close();
  };

  const submitPost = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      setError("Please select an image.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

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

      const packagesRef = collection(db, "Modules");
      const docRef = await addDoc(packagesRef, {
        module_title: title.trim(),
        module_description: desc.trim(),
        module_image: "",
        module_poster_id: userData.user_id,
        module_poster_name: userData.user_full_name,
        module_poster_image: userData.user_image,
        module_poster_field_of_study: userData.user_highest_field_of_study,
        module_posted_time: serverTimestamp(),
        module_updated_time: serverTimestamp(),
        module_status: "APPROVED",
        module_enrolled_student_ids: [],
        module_enrolled_student_images: [],
        module_video_count: 0,
        module_document_count: 0,
        module_audio_count: 0,
        module_topics_count: 0,
        module_has_exam: false,
        module_exam_title: "",
        module_exam_instructions: "",
        module_exam_duration: "",
        module_exam_submitted_time: serverTimestamp(),
        module_exam_total_questions: 0,
        module_students_taken_exam: [],
        module_visibility: true,
        module_id: "-",
      });

      const newDocId = docRef.id;

      // Upload image
      const imageRef = ref(storage, `Modules/2024/Thumbnails/${newDocId}`);
      await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(imageRef);

      await setDoc(
        doc(packagesRef, newDocId),
        {
          module_id: newDocId,
          module_image: imageUrl,
        },
        { merge: true }
      );

      // update modules count
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_modules: arrayUnion(newDocId),
      });

      //create group
      // create group chat head
      const messagingRef = collection(
        db,
        "Messaging/MessagingSessions/AllSessions"
      );
      const cgRef = doc(messagingRef, newDocId);

      await setDoc(cgRef, {
        session_id: newDocId,
        session_is_group: true,
        session_group_name: title.trim(),
        session_group_profile:
          "https://firebasestorage.googleapis.com/v0/b/imed-connect-staging.appspot.com/o/Placeholders%2Fgroup-profile.jpg?alt=media&token=daaf9c10-9856-40c7-a422-bc338b181b42",
        session_last_interaction: serverTimestamp(),
        session_participants_ids: [userData.user_id],
        session_participants_names: [
          `${userData.user_id}-${userData.user_full_name}`,
        ],
        session_participants_profiles: [
          `${userData.user_id}-${userData.user_image}`,
        ],
        session_participants_types: [
          `${userData.user_id}-${userData.user_type}`,
        ],
        session_last_text: "Be the first to send a message.",
        session_last_text_seen_by: [],
        session_blocked_users: [],
        session_read_only_users: [],
        session_admins: [],
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      setIsSubmitting(false);
      setError("Failed! Try again.");
    } finally {
      setIsSubmitting(false);
      setTitle("");
      setDesc("");
      setSelectedImage(null);
      setImagePreview("/images/horizontal-placeholder.jpg");
      fetchUserData(userData.user_id);
      //   router.push("/");
    }
  };

  return (
    <div>
      {isSubmitting && <Submitter />}
      <div className="flex flex-row justify-between items-center w-full border rounded-xl bg-white px-4 py-3 mb-4">
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
              Create Module
            </p>
            <p className="text-subtle-regular md:text-small-regular text-slate-400">
              Click to enter module details.
            </p>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="bg-primary-light text-white text-small-semibold md:text-base-semibold border rounded-lg px-5 py-1 tracking-wide"
            onClick={() => document.getElementById("create_module").showModal()}
          >
            Create
          </button>
          <dialog id="create_module" className="modal">
            <div className="modal-box text-slate-700 tracking-wide">
              <p className="font-bold text-base-regular">Create a module!</p>
              <p className="text-small-regular">
                Enter module details, you will add module content inside the
                topics.
              </p>
              <div className="relative w-full h-48 mt-2">
                <Image
                  className="w-full h-48 object-cover border border-slate-300 rounded-lg cursor-pointer"
                  src={imagePreview}
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
                  onChange={handleImageChange}
                />
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  autoComplete="title"
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

export default AddModule;
