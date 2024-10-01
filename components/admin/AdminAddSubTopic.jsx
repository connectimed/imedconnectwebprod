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
import MediaTypeSelector from "../shared/MediaTypeSelector";
import { isValidVimeoUrl } from "@/lib/actions/isValidVimeoUrl";

const AdminAddSubTopic = ({
  userData,
  fetchUserData,
  topicsCount,
  moduleId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [topicIndex, setTopicIndex] = useState(topicsCount);
  const [selectedMediaType, setSelectedMediaType] = useState("video");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [audioName, setAudioName] = useState("Select Audio");
  const [pdfName, setPdfName] = useState("Select PDF");
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    "/images/horizontal-placeholder.jpg"
  );

  const handleTypeChange = (type) => {
    setSelectedMediaType(type);
    setVideoUrl("");
    setAudioFile(null);
    setAudioName("Select Audio");
    setPdfFile(null);
    setPdfName("Select PDF");
  };

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

  const handleFileChange = (setter, nameSetter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      nameSetter(file.name);
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

    if (selectedMediaType === "video" && !isValidVimeoUrl(videoUrl)) {
      setError("Please enter a valid Vimeo URL");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (
      (selectedMediaType === "audio" && !audioFile) ||
      (selectedMediaType === "pdf" && !pdfFile)
    ) {
      setError("Please select a file.");
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
        topic_enrolled_student_ids: [],
        topic_enrolled_student_images: [],
        topic_video: "",
        topic_index: topicIndex + 1,
        topic_thumbnail: "",
        topic_document: "",
        topic_audio: "",
        topic_visibility: true,
        topic_id: "",
      });

      const newDocId = docRef.id;

      // Upload thumbnail
      const thumbnailRef = ref(storage, `Topics/Thumbnails/2024/${newDocId}`);
      await uploadBytes(thumbnailRef, selectedThumbnail);
      const thumbUrl = await getDownloadURL(thumbnailRef);

      // Upload files
      let audioUrl = "";
      let pdfUrl = "";
      if (audioFile) {
        const audioRef = ref(storage, `Topics/Files/2024/${newDocId}`);
        await uploadBytes(audioRef, audioFile);
        audioUrl = await getDownloadURL(audioRef);
      }

      if (pdfFile) {
        const pdfRef = ref(storage, `Topics/Files/2024/${newDocId}.pdf`);
        await uploadBytes(pdfRef, pdfFile);
        pdfUrl = await getDownloadURL(pdfRef);
      }

      // Update topic
      const updateTopicRef = doc(db, "Topics", newDocId);
      await updateDoc(updateTopicRef, {
        topic_id: newDocId,
        topic_thumbnail: thumbUrl,
        topic_video: videoUrl,
        topic_document: pdfUrl,
        topic_audio: audioUrl,
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
      setAudioFile(null);
      setPdfFile(null);
      setSelectedThumbnail(null);
      setThumbnailPreview("/images/horizontal-placeholder.jpg");
      fetchUserData(userData.user_id);
      setTopicIndex(topicIndex + 1);
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
                Please select the file type you want to add to the topic. Apart
                from the file, each topic needs an image to act as a thumbnail
                for the topic.
              </p>
              <div className="mt-2">
                <MediaTypeSelector onTypeChange={handleTypeChange} />
              </div>
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

              {selectedMediaType === "video" && (
                <div className="mt-4">
                  <input
                    type="text"
                    className="simple_textinput"
                    placeholder="Video Url"
                    value={videoUrl}
                    onChange={handleInputChange(setVideoUrl, 380)}
                  />
                </div>
              )}

              {selectedMediaType === "audio" && (
                <div>
                  <div
                    className="flex flex-row items-center h-10 mt-4 w-full rounded-md border border-slate-300 text-small-regular cursor-pointer"
                    onClick={() =>
                      document.getElementById("audioInput").click()
                    }
                  >
                    <div className="bg-slate-600 h-full w-10 rounded-s-md">
                      <Image
                        className="p-3"
                        src="/icons/mic-white.svg"
                        height={512}
                        width={512}
                        alt="mic icon"
                      />
                    </div>
                    <p className="px-4 py-2 text-small-regular">{audioName}</p>
                    <input
                      type="file"
                      id="audioInput"
                      className="hidden"
                      accept="audio/mpeg"
                      onChange={handleFileChange(setAudioFile, setAudioName)}
                    />
                  </div>
                </div>
              )}

              {selectedMediaType === "pdf" && (
                <div>
                  <div
                    className="flex flex-row items-center h-10 mt-4 w-full rounded-md border border-slate-300 text-small-regular cursor-pointer"
                    onClick={() => document.getElementById("pdfInput").click()}
                  >
                    <div className="bg-slate-600 h-full w-10 rounded-s-md">
                      <Image
                        className="p-3"
                        src="/icons/doc-white.svg"
                        height={512}
                        width={512}
                        alt="pdf icon"
                      />
                    </div>
                    <p className="px-4 py-2 text-small-regular">{pdfName}</p>
                    <input
                      type="file"
                      id="pdfInput"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange(setPdfFile, setPdfName)}
                    />
                  </div>
                </div>
              )}
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

export default AdminAddSubTopic;
