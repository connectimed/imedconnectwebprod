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
import ErrorBody from "../shared/ErrorBody";
import { isValidUrl } from "@/lib/actions/isValidUrl";

const AddReferenceMaterial = ({ userData, fetchUserData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
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

  const handleUrlChange = (e) => {
    const inputValue = e.target.value.slice(0, 240);
    setUrl(inputValue);
  };

  const handleClose = () => {
    document.getElementById("create_reference").close();
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

    if (desc.length < 180) {
      setError("Please enter a longer description.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL.");
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

      const referenceRef = collection(db, "References");
      const docRef = await addDoc(referenceRef, {
        reference_title: title.trim(),
        reference_description: desc.trim(),
        reference_url: url,
        reference_poster_id: userData.user_id,
        reference_poster_name: userData.user_full_name,
        reference_poster_image: userData.user_image,
        reference_posted_time: serverTimestamp(),
        reference_updated_time: serverTimestamp(),
        reference_clicks_count: 0,
        reference_clickers: [],
        reference_visibility: true,
        reference_id: "-",
      });

      const newDocId = docRef.id;

      await setDoc(
        doc(referenceRef, newDocId),
        {
          reference_id: newDocId,
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
      setUrl("");
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
              Create Reference
            </p>
            <p className="text-subtle-regular md:text-small-regular text-slate-400">
              Click to add reference materials.
            </p>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="bg-primary-light text-white text-small-semibold md:text-base-semibold border rounded-lg px-5 py-1 tracking-wide"
            onClick={() =>
              document.getElementById("create_reference").showModal()
            }
          >
            Create
          </button>
          <dialog id="create_reference" className="modal">
            <div className="modal-box text-slate-700 tracking-wide">
              <p className="font-bold text-base-regular">Create a reference!</p>
              <p className="text-small-regular">
                Please enter the title, description, and a link for the content.
              </p>

              <div className="mt-2">
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

              <div className="mt-2">
                <input
                  type="text"
                  className="simple_textinput"
                  placeholder="Reference URL"
                  value={url}
                  onChange={handleUrlChange}
                />
              </div>

              {error && (
                <div className="mt-4">
                  <ErrorBody error={error} />
                </div>
              )}

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

export default AddReferenceMaterial;
