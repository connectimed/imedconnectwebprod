import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import Image from "next/image";
import RingLoader from "../shared/RingLoader";
import Link from "next/link";
import EmptyState from "../shared/EmptyState";

const ModuleList = ({ data, userData }) => {
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
      {data.map((post) => (
        <div>
          <div
            className="flex flex-row items-start w-full py-2.5 px-1.5 hover:bg-slate-200 hover:cursor-pointer text-start space-x-2"
            onClick={() => handlePostClick(post)}
          >
            <Image
              alt="image"
              src={post.module_image}
              height={512}
              width={512}
              className="h-16 aspect-video rounded-md  object-cover object-center"
            />
            <div>
              <h6 className="text-small-regular font-medium tracking-normal text-slate-700 line-clamp-1">
                {post.module_title}
              </h6>
              <p className="text-small-regular antialiased font-normal text-gray-700 line-clamp-2">
                {post.module_description}
              </p>
            </div>
          </div>
          {selectedPost && (
            <dialog id="module_modal" className="modal">
              <div className="modal-box">
                <p className="text-base-medium">{selectedPost.module_title}</p>
                <Image
                  alt="image"
                  src={selectedPost.module_image}
                  height={512}
                  width={512}
                  className="w-full aspect-video rounded-md  object-cover object-center mt-1"
                />
                <p className="py-4 text-small-regular line-clamp-6">
                  {selectedPost.module_description}
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
                  <Link
                    className="text-small-regular text-white bg-primary-deep-light rounded-lg px-6 py-1.5"
                    href={`/modules/${selectedPost.module_id}`}
                    onClick={handleClose}
                  >
                    <p>View Module</p>
                  </Link>
                </div>
              </div>
            </dialog>
          )}
        </div>
      ))}
    </div>
  );
};

const MyModules = ({ userData }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [isFirstPage, setIsFirstPage] = useState(true);

  const getNotices = async (next = true) => {
    const dbInstance = collection(db, `Modules`);
    let q;
    if (next) {
      q = query(
        dbInstance,
        orderBy("module_posted_time", "desc"),
        startAfter(lastDoc || 0),
        limit(4)
      );
    } else {
      q = query(dbInstance, orderBy("module_posted_time", "desc"), limit(4));
    }
    setLoading(true);
    try {
      const data = await getDocs(q);
      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      setModules(newData);
      if (data.docs.length > 0) {
        setLastDoc(data.docs[data.docs.length - 1]);
        setFirstDoc(data.docs[0]);
      }
      setIsFirstPage(!next);
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

  const handleNext = () => {
    if (!loading && modules.length == 4) {
      getNotices(true);
    }
  };

  const handlePrevious = () => {
    if (!loading && !isFirstPage) {
      getNotices(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 px-2 h-full">
      <div className="flex flex-row justify-between border-b pb-1.5  pt-2">
        <p className="pl-2 text-base-regular font-bold tracking-wide">
          My Modules
        </p>
        <div className="flex flex-row space-x-2 pr-2">
          <Image
            className={`h-6 w-6 ${
              loading || isFirstPage ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            src={
              loading || isFirstPage
                ? "/icons/previous-inactive.svg"
                : "/icons/previous-active.svg"
            }
            height={200}
            width={200}
            alt="arrow icon"
            onClick={handlePrevious}
            disabled={loading || isFirstPage}
          />
          <Image
            className={`h-6 w-6 ${
              loading || modules.length < 4
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            src={
              loading || modules.length < 4
                ? "/icons/next-inactive.svg"
                : "/icons/next-active.svg"
            }
            height={200}
            width={200}
            alt="arrow icon"
            onClick={handleNext}
            disabled={loading}
          />
        </div>
      </div>

      {loading && (
        <div className="flex flex-col justify-center h-full">
          <RingLoader />
        </div>
      )}
      {!loading && modules.length === 0 && (
        <div className="flex flex-col justify-center h-full">
          <EmptyState
            title={"No Modules Found"}
            desc={
              "Looks like you haven't enrolled to any module yet. Once you enroll the modules will appear here."
            }
          />
        </div>
      )}
      {!loading && modules.length > 0 && <ModuleList data={modules} />}
    </div>
  );
};

export default MyModules;
