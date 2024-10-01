"use client";
import { UserAuth } from "@/lib/context/AuthContext";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import RingLoader from "@/components/shared/RingLoader";
import { Guardian } from "@/components/shared/Guardian";
import Submitter from "@/components/shared/Submitter";
import Link from "next/link";
import { calculateStartTime } from "@/lib/actions/calculateStartTime";
import { getDateAndMonth } from "@/lib/actions/getDateAndMonth";

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

const page = ({ params }) => {
  const roomID = params.roomID;
  const { firebaseUser, fetchUserData, userData, fireLoaded } = UserAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dbInstance = collection(db, "Livestreams");

  const myMeeting = async (element, userId, ownerId) => {
    const appId = +process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID;
    const serverSecret = process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET;
    const role =
      ownerId === userId ? ZegoUIKitPrebuilt.Host : ZegoUIKitPrebuilt.Audience;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomID,
      randomID(5),
      randomID(5)
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      // branding: {
      //   logoURL: "/images/imed-logo.png",
      // },
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: {
          role,
        },
      },
      sharedLinks: [
        {
          name: "Copy link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],
    });
  };

  const getMeetingDetails = async (id) => {
    const q = query(dbInstance, where("livestream_id", "==", id), limit(1));

    try {
      const data = await getDocs(q);
      const contentData = data.docs.find((item) => item.id === id);
      console.log("Getting data");

      if (contentData) {
        return { ...contentData.data(), id: contentData.id };
      } else {
        console.error("Content not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        setLoading(true);
        const data = await getMeetingDetails(roomID);
        setDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching press release:", error);
      }
    };

    fetchContentData();
  }, [roomID, fetchTrigger]);

  const authRedirectComponent = Guardian(userData, firebaseUser, fireLoaded);

  if (authRedirectComponent) {
    return authRedirectComponent;
  }

  const updateLivestream = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const forumsRef = doc(db, "Livestreams", details.livestream_id);
      await updateDoc(forumsRef, {
        livestream_invited_users: arrayUnion(userData.user_id),
      });
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setIsSubmitting(false);
      // Trigger a side effect after the update
      setFetchTrigger(!fetchTrigger);
    }
  };

  return (
    <div className="h-full">
      {isSubmitting && <Submitter />}
      {!details && (
        <div className="flex flex-col justify-center h-full">
          <RingLoader />
        </div>
      )}
      {details &&
        !details.livestream_invited_users.includes(userData.user_id) && (
          <div className="flex flex-col justify-center items-center h-full px-6">
            <div className=" bg-white rounded-lg border border-slate-300 max-w-4xl w-full px-6 py-4 space-y-4">
              <p className="text-heading3-bold text-slate-700 tracking-wide">
                Livestream
              </p>
              <div className="flex flex-row items-center space-x-4">
                <div className="flex flex-col justify-center items-center bg-success-2 rounded-lg aspect-square h-16 tracking-wide">
                  <p className="text-heading3-bold text-white">
                    {getDateAndMonth(details.livestream_start_time).date}
                  </p>
                  <p className="text-small-regular text-white line-clamp-1">
                    {getDateAndMonth(details.livestream_start_time).month}
                  </p>
                </div>
                <div>
                  <p className="text-base-semibold">
                    {details.livestream_title}
                  </p>
                  <p className="text-small-regular">
                    Host: {details.livestream_poster_user_name}
                  </p>
                  <p className="text-subtle-regular">
                    {calculateStartTime(details.livestream_start_time)}
                  </p>
                </div>
              </div>
              <p className="text-small-regular text-slate-600">
                {details.livestream_body}
              </p>

              {/* interactions */}
              <div className="flex flex-row justify-end pt-4 text-subtle-regular text-slate-400 tracking-wide space-x-6">
                <Link
                  className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
                  href="/"
                >
                  <p className="text-center">Not My Meeting</p>
                </Link>
                <button
                  className="text-small-regular cursor-pointer py-1.5 px-6 border rounded-lg bg-primary-light text-white"
                  onClick={updateLivestream}
                >
                  <p>Add Me In</p>
                </button>
              </div>
            </div>
          </div>
        )}
      {details &&
        details.livestream_invited_users.includes(userData.user_id) && (
          <div
            className="w-full h-screen"
            ref={(el) =>
              myMeeting(el, userData.user_id, userData.livestream_owner)
            }
            style={{ width: "100vw", height: "100vh" }}
          >
            page
          </div>
        )}
    </div>
  );
};

export default page;
