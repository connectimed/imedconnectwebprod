import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import RingLoader from "./RingLoader";
import Image from "next/image";
import calculateTimeAgo from "@/lib/actions/calculateTimeAgo";
import EmptyState from "./EmptyState";

const NotificationsList = ({ data, userData }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPost) {
      const dialog = document.getElementById("student_modal");
      if (dialog) {
        dialog.showModal();
      }
    }
  }, [selectedPost]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="space-y-3">
      {data.map((post) => (
        <div key={post.id}>
          <div
            className="flex flex-col w-full py-2 px-3 border rounded-lg border-slate-200 hover:bg-slate-200"
            onClick={() => handlePostClick(post)}
          >
            <h6 className="text-small-regular font-bold tracking-wide text-slate-800 line-clamp-1">
              {post.notification_title_en}
            </h6>
            <p className="text-small-regular text-gray-500 tracking-wide">
              {post.notification_body_en}
            </p>
            <p className="text-end text-tiny-regular text-gray-400 tracking-wide">
              {calculateTimeAgo(post.notification_time)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const NotificationDrawer = ({ userData, isDrawerOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateNotificationsRead = async (id) => {
    try {
      const userRef = doc(db, "Users", id);

      await updateDoc(userRef, {
        user_notification_count: 0,
      });
    } catch (error) {
      console.error("Error updating notifications");
    }
  };

  const getNotifications = async (next = true) => {
    const dbInstance = collection(
      db,
      `Notifications/system/${userData.user_id}`
    );
    let q = query(dbInstance, orderBy("notification_time", "desc"), limit(100));

    setLoading(true);
    try {
      const data = await getDocs(q);
      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      setNotifications(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      if (userData && isDrawerOpen) {
        updateNotificationsRead(userData.user_id);
        getNotifications(false);
      }
    }
  }, [userData, isDrawerOpen]);

  return (
    <div className="px-3 py-3 h-full">
      <p className="border-b border-slate-200 pb-1 mb-2">Notifications</p>
      {loading && (
        <div className="flex flex-col justify-center h-full">
          <RingLoader />
        </div>
      )}
      {!loading && notifications.length === 0 && (
        <div className="flex flex-col justify-center h-full">
          <EmptyState
            title={"Zero Notifications"}
            desc={
              "Looks like there are no notifications yet. Once they come up they will appear here."
            }
          />
        </div>
      )}
      {!loading && notifications.length > 0 && (
        <NotificationsList data={notifications} userData={userData} />
      )}
    </div>
  );
};

export default NotificationDrawer;
