"use client";
import { UserAuth } from "@/lib/context/AuthContext";
import { Guardian } from "@/components/shared/Guardian";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import RingLoader from "@/components/shared/RingLoader";
import TimeAgo from "@/components/shared/TimeAgo";
import MessagesView from "@/components/shared/MessagesView";
import EmptyState from "@/components/shared/EmptyState";
import { useRouter } from "next/navigation";

const ChatHeads = ({ data, userData, onSelectChatHead }) => {
  const handlePostClick = (post) => {
    onSelectChatHead(post);
  };

  return (
    <div className="">
      {data.map((post) => (
        <div className="py-1 px-1 ">
          <div
            className="px-2 flex items-center hover:bg-slate-200 rounded-md cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            <div className="h-10 aspect-square">
              {post.session_is_group && (
                <Image
                  className="w-10 h-10 rounded-full object-cover"
                  src={post.session_user_one_profile_url}
                  height={512}
                  width={512}
                  alt="profile"
                />
              )}

              {!post.session_is_group &&
                post.session_user_one_profile_url &&
                userData.user_type !== "Admin" && (
                  <Image
                    className="w-10 h-10 rounded-full object-cover"
                    src={post.session_user_one_profile_url}
                    height={512}
                    width={512}
                    alt="profile"
                  />
                )}

              {!post.session_is_group &&
                post.session_user_two_profile_url &&
                userData.user_type !== "Mentor" && (
                  <Image
                    className="w-10 h-10 rounded-full object-cover"
                    src={post.session_user_two_profile_url}
                    height={512}
                    width={512}
                    alt="profile"
                  />
                )}

              {!post.session_is_group &&
                post.session_user_three_profile_url &&
                userData.user_type !== "Student" && (
                  <Image
                    className="w-10 h-10 rounded-full object-cover"
                    src={post.session_user_three_profile_url}
                    height={512}
                    width={512}
                    alt="profile"
                  />
                )}
            </div>
            <div className="ml-4 flex-col border-b py-2 w-full">
              <div className="flex flex-row justify-between items-center w-full">
                <div>
                  {post.session_is_group && (
                    <p className="text-small-regular line-clamp-1 w-full">
                      {post.session_group_name}
                    </p>
                  )}

                  {!post.session_is_group &&
                    post.session_user_one_name &&
                    userData.user_type !== "Admin" && (
                      <p className="text-small-regular line-clamp-1 w-full">
                        {post.session_user_one_name}
                      </p>
                    )}

                  {!post.session_is_group &&
                    post.session_user_two_name &&
                    userData.user_type !== "Mentor" && (
                      <p className="text-small-regular line-clamp-1 w-full">
                        {post.session_user_two_name}
                      </p>
                    )}

                  {!post.session_is_group &&
                    post.session_user_three_name &&
                    userData.user_type !== "Student" && (
                      <p className="text-small-regular line-clamp-1 w-full">
                        {post.session_user_three_name}
                      </p>
                    )}
                </div>
                <p className="text-subtle-regular text-end min-w-16">
                  <TimeAgo timestamp={post.session_last_time} />
                </p>
              </div>
              <p className="text-subtle-regular line-clamp-1">
                {post.session_last_text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const page = () => {
  const { userData, firebaseUser, fireLoaded } = UserAuth();
  const [chatHeads, setChatHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionData, setSelectedSessionData] = useState(null);
  const router = useRouter();

  const getChatHeads = async (next = true) => {
    const dbInstance = collection(
      db,
      "Messaging/MessagingSessions/AllSessions"
    );
    const q = query(
      dbInstance,
      where("session_participants", "array-contains", userData.user_id),
      orderBy("session_last_time", "desc"),
      limit(100)
    );

    setLoading(true);
    try {
      const data = await getDocs(q);
      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      setChatHeads(newData);
      const userRef = doc(db, "Users", userData.user_id);
      await updateDoc(userRef, {
        user_message_count: 0,
      });
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      getChatHeads(false);
    }
  }, [userData]);

  const authRedirectComponent = Guardian(userData, firebaseUser, fireLoaded);

  if (authRedirectComponent) {
    return authRedirectComponent;
  }

  return (
    <div className="h-screen">
      <div className="flex border border-grey rounded shadow-lg h-full w-full">
        {/* <!-- Left --> */}
        <div className="w-full md:w-1/3 border flex flex-col bg-white">
          {/* <!-- Header --> */}
          <div className="py-2 px-3 flex flex-row space-x-4 items-center">
            <div className="h-6 aspect-square bg-red-00">
              <Image
                className="w-6 h-6 rounded-full hover:cursor-pointer"
                src="/icons/left-arrow.svg"
                height={512}
                width={512}
                alt="profile"
                onClick={() => router.back()}
              />
            </div>
            <div className="h-10 aspect-square">
              <Image
                className="w-10 h-10 rounded-full"
                src={userData.user_image}
                height={512}
                width={512}
                alt="profile"
              />
            </div>

            <div className="w-full">
              <p className="text-small-regular text-slate-700">
                {userData.user_full_name}
              </p>
              <p className="text-subtle-regular text-slate-500 line-clamp-1">
                {userData.user_field_of_study}
              </p>
            </div>
          </div>

          {/* <!-- Search --> */}
          <div className="py-2 px-2 bg-grey-lightest">
            <input
              type="text"
              className="simple_textinput"
              placeholder="Search or start new chat"
            />
          </div>

          {/* <!-- Contacts --> */}
          <div className="flex-1 overflow-auto">
            {loading && (
              <div className="flex flex-col justify-center h-full">
                <RingLoader />
              </div>
            )}
            {!loading && chatHeads.length === 0 ? (
              <div className="flex flex-col justify-center h-full">
                <EmptyState
                  title={"No Conversations"}
                  desc={
                    "Looks like you haven't started any conversation. Publish a module and you will have your first chat session."
                  }
                />
              </div>
            ) : (
              <ChatHeads
                data={chatHeads}
                userData={userData}
                onSelectChatHead={setSelectedSessionData}
              />
            )}
          </div>
        </div>

        {/* <!-- Right --> */}
        <div className="hidden md:flex flex-col md:w-2/3 border">
          <MessagesView sessionData={selectedSessionData} userData={userData} />
        </div>
      </div>
    </div>
  );
};

export default page;
