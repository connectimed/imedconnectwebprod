import {
  collection,
  deleteDoc,
  doc,
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
import TextButton from "../shared/TextButton";
import EmptyState from "../shared/EmptyState";
import calculateTimeAgo from "@/lib/actions/calculateTimeAgo";
import DangerButton from "../shared/DangerButton";

const NoticeList = ({ data, userData, fetchUserData }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (selectedPost) {
      const dialog = document.getElementById("notice_modal");
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
    const dialog = document.getElementById("notice_modal");
    if (dialog) {
      dialog.close();
    }
  };

  useEffect(() => {
    let timer;
    if (isDeleting && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleDeleteNotice();
    }
    return () => clearInterval(timer);
  }, [isDeleting, countdown]);

  const handleDeleteNotice = async () => {
    try {
      const noticeDocRef = doc(db, "NoticeBoard", selectedPost.notice_id);
      await deleteDoc(noticeDocRef);
      console.log("Notice deleted successfully");
      handleClose();
      fetchUserData(userData.user_id);
    } catch (error) {
      console.error("Error deleting module or image: ", error);
      setIsDeleting(false);
      setCountdown(15);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setCountdown(15);
  };

  const handleStartDelete = () => {
    setIsDeleting(true);
  };

  return (
    <div className=" divide-y">
      {data.map((post) => (
        <div>
          <div
            className="flex flex-row items-start w-full py-2 px-1.5 hover:border hover:bg-slate-200 hover:cursor-pointer text-start space-x-2"
            onClick={() => handlePostClick(post)}
          >
            <Image
              alt="candice"
              src="/icons/bell-dark.svg"
              height={512}
              width={512}
              className="h-4 w-4 !rounded-full  object-cover object-center mt-1.5"
            />
            <div>
              <h6 className="text-small-regular font-medium leading-relaxed tracking-normal text-slate-700">
                {post.notice_title}
              </h6>
              <p className="text-small-regular antialiased font-normal leading-normal text-gray-700 line-clamp-2">
                {post.notice_description}
              </p>
            </div>
          </div>
          {selectedPost && (
            <dialog id="notice_modal" className="modal ">
              <div className="modal-box bg-white">
                <h3 className="text-base-medium">
                  {selectedPost.notice_title}
                </h3>
                <p className="pt-2 text-small-regular text-slate-600">
                  {selectedPost.notice_description}
                </p>
                <div className="flex flex-row justify-end mt-1 text-tiny-regular text-slate-400 tracking-wider space-x-1">
                  <p>Posted: </p>
                  <p className="">
                    {calculateTimeAgo(post.notice_submitted_time)}
                  </p>
                </div>
                <div className="flex flex-row items-center justify-end w-full mt-5 space-x-3">
                  <div className="flex flex-row justify-end">
                    {isDeleting ? (
                      <DangerButton
                        text={`Cancel ${countdown}s`}
                        action={handleCancelDelete}
                      />
                    ) : (
                      <DangerButton text="Delete" action={handleStartDelete} />
                    )}
                  </div>
                  <div className="">
                    <button
                      className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </dialog>
          )}
        </div>
      ))}
    </div>
  );
};

const AdminNoticeBoard = ({ userData, fetchUserData }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [isFirstPage, setIsFirstPage] = useState(true);

  const getNotices = async (next = true) => {
    const dbInstance = collection(db, `NoticeBoard`);
    let q;
    if (next) {
      q = query(
        dbInstance,
        orderBy("notice_submitted_time", "desc"),
        startAfter(lastDoc || 0),
        limit(4)
      );
    } else {
      q = query(dbInstance, orderBy("notice_submitted_time", "desc"), limit(4));
    }
    setLoading(true);
    try {
      const data = await getDocs(q);
      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      setNotices(newData);
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
    if (!loading && notices.length == 4) {
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
      <div className="flex flex-row justify-between border-b pb-1.5 pt-2">
        <p className="pl-2 text-base-regular font-bold tracking-wide">
          Noticeboard
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
              loading || notices.length < 4
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            src={
              loading || notices.length < 4
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
      {!loading && notices.length === 0 && (
        <div className="flex flex-col justify-center h-full">
          <EmptyState
            title={"Noticeboard Is Empty"}
            desc={
              "Looks like there are no items published here yet. Once they are, they will appear here."
            }
          />
        </div>
      )}
      {!loading && notices.length > 0 && (
        <NoticeList
          data={notices}
          userData={userData}
          fetchUserData={fetchUserData}
        />
      )}
    </div>
  );
};

export default AdminNoticeBoard;
