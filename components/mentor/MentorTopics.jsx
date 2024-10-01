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
import AdminSubtopics from "../admin/AdminSubtopics";
import MentorSubtopics from "./MentorSubtopics";

const TopicList = ({ data, userData, fetchUserData }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (selectedPost) {
      const dialog = document.getElementById("module_modal");
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
    const dialog = document.getElementById("module_modal");
    if (dialog) {
      dialog.close();
    }
  };

  return (
    <div className=" divide-y">
      {data.map((post, index) => (
        <div key={post.id}>
          <div
            className="flex flex-row items-start w-full py-2.5 hover:cursor-pointer text-start space-x-4"
            onClick={() => handlePostClick(post)}
          >
            <div className="h-20 md:h-24 aspect-square md:aspect-video border rounded-md bg-slate-100">
              <Image
                alt="image"
                src={post.topic_thumbnail}
                height={512}
                width={512}
                className="h-full w-full object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col overflow-x-hidden">
              <div className="h-24">
                <div className="flex flex-row text-small-regular font-bold tracking-wide space-x-1">
                  <p className="">{index + 1}.</p>
                  <p className="line-clamp-1">{post.topic_title}</p>
                </div>

                <p className="text-small-regular antialiased font-normal text-gray-600 line-clamp-3 md:line-clamp-3 w-full">
                  {post.topic_description}
                </p>
              </div>

              {selectedPost && selectedPost.topic_id === post.topic_id && (
                <MentorSubtopics
                  userData={userData}
                  selectedPost={selectedPost}
                  moduleId={selectedPost.topic_parent_module}
                  topicId={selectedPost.topic_id}
                  fetchUserData={fetchUserData}
                />
              )}
            </div>
          </div>
          {/* 
          {selectedPost && (
            <dialog id="module_modal" className="modal">
              <div className="modal-box">
                {selectedPost.topic_video ? (
                  <video
                    className="w-full aspect-video bg-black"
                    src={selectedPost.topic_video}
                    frameborder="0"
                    controls
                    controlsList="nodownload noremoteplayback"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    Browser not supported!
                  </video>
                ) : selectedPost.topic_document ? (
                  <Image
                    alt="image"
                    src={selectedPost.topic_thumbnail}
                    height={512}
                    width={512}
                    className="w-full aspect-video rounded-md  object-cover object-center mt-2"
                  />
                ) : selectedPost.topic_audio ? (
                  <audio className="w-full" controls preload="none">
                    <source src={selectedPost.topic_audio} />
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
                  <p className="">{selectedPost.topic_index}.</p>
                  <p className="">{selectedPost.topic_title}</p>
                </div>
                <p className="mt-1 text-small-regular font-normal line-clamp-6 tracking-wide text-slate-500">
                  {selectedPost.topic_description}
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
                  {selectedPost.topic_document && (
                    <Link
                      className="text-small-regular text-white bg-primary-deep-light rounded-lg px-6 py-1.5"
                      target="_blank"
                      href={`/pdf/${selectedPost.topic_id}`}
                      onClick={handleClose}
                    >
                      <p>Open PDF</p>
                    </Link>
                  )}
                </div>
              </div>
            </dialog>
          )} */}
        </div>
      ))}
    </div>
  );
};

const MentorTopics = ({ userData, moduleId, fetchUserData }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [isFirstPage, setIsFirstPage] = useState(true);

  const getNotices = async (next = true) => {
    const dbInstance = collection(db, `Topics`);
    let q = query(
      dbInstance,
      where("topic_parent_module", "==", moduleId),
      orderBy("topic_posted_time")
    );

    setLoading(true);
    try {
      const data = await getDocs(q);
      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      setTopics(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      getNotices(false);
    }
  }, [userData]);

  return (
    <div className="flex flex-col">
      {loading && (
        <div className="flex flex-col justify-center h-36">
          <RingLoader />
        </div>
      )}
      {!loading && topics.length === 0 ? (
        <EmptyState
          title={"Section Is Empty"}
          desc={
            "There is no topics in this module, once they are added they will appear here."
          }
        />
      ) : (
        <TopicList
          data={topics}
          userData={userData}
          fetchUserData={fetchUserData}
        />
      )}
    </div>
  );
};

export default MentorTopics;
