"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Submitter from "../shared/Submitter";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import RichTextEditor from "../shared/RichTextEditor";

const AdminAddBlog = ({ userData, fetchUserData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "/images/horizontal-placeholder.jpg"
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTitleChange = (e) => {
    const inputValue = e.target.value.slice(0, 60);
    setTitle(inputValue);
  };

  const handleDescChange = (e) => {
    const inputValue = e.target.value.slice(0, 10000);
    setDesc(inputValue);
  };

  const handleClose = () => {
    document.getElementById("create_blog_post").close();
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

      const blogRef = collection(db, "Blogs");
      const docRef = await addDoc(blogRef, {
        blog_title: title.trim(),
        blog_description: desc.trim(),
        blog_summary: "",
        blog_submitted_time: serverTimestamp(),
        blog_image: "",
        blog_visibility: true,
        blog_id: "-",
      });

      const newDocId = docRef.id;

      // Upload image
      const imageRef = ref(storage, `Blogs/2024/Thumbnails/${newDocId}`);
      await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(imageRef);

      const targetRef = doc(db, "Blogs", newDocId);
      await updateDoc(targetRef, {
        blog_id: newDocId,
        blog_image: imageUrl,
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
              Add Blog Post
            </p>
            <p className="text-subtle-regular md:text-small-regular text-slate-400">
              Click to create a blog post.
            </p>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="bg-primary-light text-white text-small-semibold md:text-base-semibold border rounded-lg px-5 py-1 tracking-wide"
            onClick={() =>
              document.getElementById("create_blog_post").showModal()
            }
          >
            Create
          </button>
          <dialog id="create_blog_post" className="modal">
            <div className="modal-box text-slate-700 tracking-wide">
              <p className="font-bold text-base-regular">Create a blog post!</p>
              <p className="text-small-regular">
                Add the contents for a blog post.
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
                  autoComplete="full_name"
                  className="simple_textinput"
                  placeholder="Title"
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>

              <div className="mt-4">
                <RichTextEditor content={"hey there"} setContent={setDesc} />
              </div>

              {/* <Tiptap /> */}

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

export default AdminAddBlog;
