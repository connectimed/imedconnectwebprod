import Image from "next/image";
import React, { useEffect, useState } from "react";
import MediaTypeSelector from "../shared/MediaTypeSelector";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase/firebase";
import RingLoader from "../shared/RingLoader";
import EmptyState from "../shared/EmptyState";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { isValidVimeoUrl } from "@/lib/actions/isValidVimeoUrl";
import Link from "next/link";
import Submitter from "../shared/Submitter";

const SubtopicList = ({ data, userData }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (selectedPost) {
      const dialog = document.getElementById("subtopic_modal");
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
    const dialog = document.getElementById("subtopic_modal");
    if (dialog) {
      dialog.close();
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4">
      {data.map((post, index) => (
        <div key={post.subtopic_id}>
          <div
            className="w-full hover:cursor-pointer text-start"
            onClick={() => handlePostClick(post)}
          >
            <div className="flex flex-col overflow-x-hidden">
              <div className="flex flex-row text-small-regular font-bold tracking-wide space-x-1">
                <p className="">{index + 1}.</p>
                <p className="line-clamp-1">{post.subtopic_title}</p>
              </div>

              <p className="text-small-regular antialiased font-normal text-gray-600 w-full">
                {post.subtopic_description}
              </p>
            </div>
          </div>

          {selectedPost && (
            <dialog id="subtopic_modal" className="modal">
              <div className="modal-box">
                {selectedPost.subtopic_video ? (
                  <video
                    className="w-full aspect-video bg-black"
                    src={selectedPost.subtopic_video}
                    frameborder="0"
                    controls
                    controlsList="nodownload noremoteplayback"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    Browser not supported!
                  </video>
                ) : selectedPost.subtopic_document ? (
                  <Image
                    alt="image"
                    src="/images/pdf-thumbnail.jpg"
                    height={512}
                    width={512}
                    className="w-full aspect-video rounded-md  object-cover object-center mt-2"
                  />
                ) : selectedPost.subtopic_audio ? (
                  <audio className="w-full" controls preload="none">
                    <source src={selectedPost.subtopic_audio} />
                    Your browser does not support the video tag.
                  </audio>
                ) : (
                  <Image
                    alt="image"
                    src={selectedPost.topic_thumbnail}
                    height={512}
                    width={512}
                    className="w-full aspect-video rounded-md  object-cover object-center mt-2"
                  />
                )}

                <div className="flex flex-row text-base-medium font-bold tracking-wide mt-3 space-x-1">
                  <p className="">{index + 1}.</p>
                  <p className="">{selectedPost.subtopic_title}</p>
                </div>
                <p className="mt-1 text-small-regular font-normal line-clamp-6 tracking-wide text-slate-500">
                  {selectedPost.subtopic_description}
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
                  {selectedPost.subtopic_document && (
                    <Link
                      className="text-small-regular text-white bg-primary-deep-light rounded-lg px-6 py-1.5"
                      target="_blank"
                      href={`/pdf/${selectedPost.subtopic_id}`}
                      onClick={handleClose}
                    >
                      <p>Open PDF</p>
                    </Link>
                  )}
                </div>
              </div>
            </dialog>
          )}
        </div>
      ))}
    </div>
  );
};

const AdminSubtopics = ({
  userData,
  selectedPost,
  moduleId,
  topicId,
  fetchUserData,
}) => {
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("video");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [audioName, setAudioName] = useState("Select Audio");
  const [pdfName, setPdfName] = useState("Select PDF");

  const getSubtopics = async (next = true) => {
    const dbInstance = collection(db, `Subtopics`);
    let q = query(
      dbInstance,
      where("subtopic_parent_topic", "==", topicId),
      orderBy("subtopic_posted_time")
    );

    setLoading(true);
    try {
      const data = await getDocs(q);
      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      setSubtopics(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPost) {
      getSubtopics(false);
    }
  }, [selectedPost]);

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

  const handleFileChange = (setter, nameSetter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      nameSetter(file.name);
    }
  };

  const handleClose = () => {
    document.getElementById("create_subtopic").close();
  };

  const submitSubtopic = async (e) => {
    e.preventDefault();

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

      const subtopicsRef = collection(db, "Subtopics");
      const docRef = await addDoc(subtopicsRef, {
        subtopic_title: title.trim(),
        subtopic_description: desc.trim(),
        subtopic_parent_module: moduleId,
        subtopic_parent_topic: topicId,
        subtopic_poster_id: userData.user_id,
        subtopic_poster_name: userData.user_full_name,
        subtopic_poster_image: userData.user_image,
        subtopic_poster_field_of_study: userData.user_highest_field_of_study,
        subtopic_posted_time: serverTimestamp(),
        subtopic_updated_time: serverTimestamp(),
        subtopic_status: "APPROVED",
        subtopic_video: "",
        subtopic_thumbnail: "",
        subtopic_document: "",
        subtopic_audio: "",
        subtopic_visibility: true,
        subtopic_id: "",
      });

      const newDocId = docRef.id;

      // Upload files
      let audioUrl = "";
      let pdfUrl = "";
      if (audioFile) {
        const audioRef = ref(storage, `Subtopics/Files/2024/${newDocId}`);
        await uploadBytes(audioRef, audioFile);
        audioUrl = await getDownloadURL(audioRef);
      }

      if (pdfFile) {
        const pdfRef = ref(storage, `Subtopics/Files/2024/${newDocId}.pdf`);
        await uploadBytes(pdfRef, pdfFile);
        pdfUrl = await getDownloadURL(pdfRef);
      }

      // Update topic
      const updateTopicRef = doc(db, "Subtopics", newDocId);
      await updateDoc(updateTopicRef, {
        subtopic_id: newDocId,
        subtopic_video: videoUrl,
        subtopic_document: pdfUrl,
        subtopic_audio: audioUrl,
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
      fetchUserData(userData.user_id);
    }
  };

  return (
    <div>
      {isSubmitting && <Submitter />}
      <div className="mt-3">
        <div className="flex flex-row items-center space-x-4 border-b mb-2 pb-1 ">
          <p className="text-subtle-regular text-slate-500 tracking-wide">
            Subtopics
          </p>
          <Image
            className="h-4 w-4 cursor-pointer"
            src="/icons/add-plus.svg"
            height={512}
            width={512}
            alt="add icon"
            onClick={() =>
              document.getElementById("create_subtopic").showModal()
            }
          />
        </div>

        {loading && (
          <div className="flex flex-col justify-center h-32">
            <RingLoader />
          </div>
        )}
        {!loading && subtopics.length === 0 ? (
          <EmptyState
            title={"Section Is Empty"}
            desc={
              "There is no subtopics in this topic, once they are added they will appear here."
            }
          />
        ) : (
          <div className="">
            <SubtopicList data={subtopics} />
          </div>
        )}
        <dialog id="create_subtopic" className="modal">
          <div className="modal-box tracking-wide p-4 md:p-6">
            <p className="font-bold text-base-regular text-slate-700">
              Add subtopic!
            </p>
            <p className="text-subtle-regular text-slate-500">
              Please choose the file type you want to add to the subtopic. Then,
              enter a title and description for the subtopic.
            </p>
            <div className="mt-2">
              <MediaTypeSelector onTypeChange={handleTypeChange} />
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
                  onClick={() => document.getElementById("audioInput").click()}
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
                onClick={submitSubtopic}
                disabled={isSubmitting}
              >
                <p>Add Subtopic</p>
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default AdminSubtopics;
