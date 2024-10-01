import Image from "next/image";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import RingLoader from "../shared/RingLoader";
import EmptyState from "../shared/EmptyState";
import Link from "next/link";

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

const StudentSubtopics = ({
  userData,
  selectedPost,
  moduleId,
  topicId,
  fetchUserData,
}) => {
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <div className="mt-3">
        <div className="flex flex-row items-center space-x-4 border-b mb-2 pb-1 ">
          <p className="text-subtle-regular text-slate-500 tracking-wide">
            Subtopics
          </p>
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
      </div>
    </div>
  );
};

export default StudentSubtopics;
