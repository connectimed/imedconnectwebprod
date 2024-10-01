import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import TimeAgo from "./TimeAgo";
import EmptyState from "./EmptyState";
import NoChatSession from "./NoChatSession";
import RingLoader from "./RingLoader";
import calculateTimeAgo from "@/lib/actions/calculateTimeAgo";
import {
  Message,
  MessageList,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { format } from "date-fns";
import ReactLinkify from "react-linkify";

// const MessageList = ({ data, userData }) => {
//   const getFormattedDate = (timestamp) => {
//     const date = new Date(timestamp.seconds * 1000);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   let lastDate = null;

//   return (
//     <ul className="space-y-4 py-2 px-3">
//       {data.map((post, index) => {
//         if (!post.message_time) {
//           // Render a loading state or placeholder until the message_time is available
//           return (
//             <div key={index} className="flex justify-center mb-4">
//               <div className="rounded py-2 px-6 bg-[#DDECF2]">
//                 <p className="text-subtle-regular uppercase">Loading...</p>
//               </div>
//             </div>
//           );
//         }

//         const postDate = getFormattedDate(post.message_time);
//         const showDateSeparator = postDate !== lastDate;
//         lastDate = postDate;

//         return (
//           <div key={index}>
//             {showDateSeparator && (
//               <div className="flex justify-center mb-4">
//                 <div className="rounded py-2 px-6 bg-[#DDECF2]">
//                   <p className="text-subtle-regular uppercase">{postDate}</p>
//                 </div>
//               </div>
//             )}
//             {post.message_sender_id !== userData.user_id &&
//               post.message_type === "message" && (
//                 <div className="flex mb-2">
//                   <div className="rounded-t-xl rounded-br-xl max-w-md py-2 px-4 bg-[#F2F2F2]">
//                     <p className="text-small-regular font-medium text-primary-deep-light tracking-wide">
//                       {post.message_sender_name}
//                     </p>
//                     <p className="text-small-regular">{post.message_body}</p>
//                     <p className="text-right text-subtle-regular text-slate-400 mt-1">
//                       <TimeAgo timestamp={post.message_time} />
//                     </p>
//                   </div>
//                 </div>
//               )}
//             {post.message_type === "info" && (
//               <div className="flex justify-center mb-4">
//                 <div className="rounded-md py-2 px-4 bg-[#FCF4CB]">
//                   <p className="text-small-regular">{post.message_body}</p>
//                 </div>
//               </div>
//             )}
//             {post.message_sender_id === userData.user_id && (
//               <div className="flex justify-end mb-2">
//                 <div className="rounded-t-xl rounded-bl-xl max-w-md py-2 px-4 bg-[#E2F7CB]">
//                   <p className="text-small-regular mt-1">{post.message_body}</p>
//                   <p className="text-right text-subtle-regular text-slate-400 mt-1">
//                     <TimeAgo timestamp={post.message_time} />
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </ul>
//   );
// };

const MessagesView = ({ sessionData, userData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  const handleBodyChange = (e) => {
    const inputValue = e.target.value.slice(0, 500);
    setMessageBody(inputValue);
  };

  const submitMessage = async (e) => {
    e.preventDefault();

    if (!messageBody || isSubmitting) {
      // setError("Please fill everything correctly.");
      return;
    }

    try {
      setIsSubmitting(true);
      // setError(null);

      const messagesRef = collection(
        db,
        `Messaging/Messages/${sessionData.session_id}`
      );
      const msgRef = await addDoc(messagesRef, {
        message_is_image: false,
        message_body: messageBody,
        message_id: "",
        message_image: "",
        message_sender_id: userData.user_id,
        message_sender_name: userData.user_full_name,
        message_seen_by: arrayUnion(userData.user_id),
        message_time: serverTimestamp(),
        message_visibility: true,
        message_type: "message",
        message_quoted_id: "",
        message_quoted_name: "",
        message_quoted_body: "",
      });

      const newDocId = msgRef.id;

      await setDoc(
        doc(messagesRef, newDocId),
        {
          message_id: newDocId,
        },
        { merge: true }
      );

      const chatSessionRef = doc(
        db,
        "Messaging/MessagingSessions/AllSessions",
        sessionData.session_id
      );
      const updateData = {
        session_last_text: messageBody,
        session_last_time: serverTimestamp(),
      };

      // Update only if the user is 'Admin'
      if (userData.user_type === "Admin") {
        updateData.session_user_one_profile_url = userData.user_image;
        updateData.session_user_one_name = userData.user_full_name;
      }

      // Update only if the user is 'Mentor'
      if (userData.user_type === "Mentor") {
        updateData.session_user_two_profile_url = userData.user_image;
        updateData.session_user_two_name = userData.user_full_name;
      }

      // Update only if the user is 'Student'
      if (userData.user_type === "Student") {
        updateData.session_user_three_profile_url = userData.user_image;
        updateData.session_user_three_name = userData.user_full_name;
      }

      await updateDoc(chatSessionRef, updateData);
    } catch (error) {
      console.error("Error during form submission:", error);

      // setError("Imefeli, jaribu tena!.");
    } finally {
      setIsSubmitting(false);
      setMessageBody("");
      // router.push("/");
    }
  };

  const formatDate = (timestamp) => {
    // If the timestamp is null or undefined, return '...'
    if (!timestamp) {
      return "...";
    }
    return format(new Date(timestamp.seconds * 1000), "EEEE, dd MMMM yyyy");
  };

  let lastDate = ""; // Variable to track the last date

  useEffect(() => {
    if (sessionData) {
      const dbInstance = collection(
        db,
        `Messaging/Messages/${sessionData.session_id}`
      );
      const q1 = query(dbInstance, orderBy("message_time"));

      const unsubscribe = onSnapshot(q1, (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessages(newData);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [sessionData]);

  if (!sessionData || messages === 0) {
    return (
      <div className="h-full">
        <NoChatSession />
      </div>
    );
  }

  return (
    <MessageList>
      {messages.map((post, index) => {
        const messageDate = formatDate(post.message_time);

        // Check if the date has changed
        const showSeparator = messageDate !== lastDate && messageDate !== "...";
        lastDate = messageDate !== "..." ? messageDate : lastDate; // Update lastDate only if the date is valid

        return (
          <React.Fragment key={post.id}>
            {showSeparator && <MessageSeparator content={messageDate} />}
            <Message
              model={{
                direction:
                  post.message_sender_id === userData.user_id
                    ? "outgoing"
                    : "incoming",
                message: post.message_body,
                position: "single",
                sender: post.message_sender_name,
                sentTime: calculateTimeAgo(post.message_time),
              }}
            >
              <Message.CustomContent>
                {/* <strong>{post.message_sender_name}</strong>
                <br />
                {post.message_body} Here:
                <a>
                  https://staging.imedconnect.or.tz/livestream/TGrUSpZm21c2wNqYiM0y?roomID=TGrUSpZm21c2wNqYiM0y
                </a>
                <e componentDecorator={function Na() {}}>
                  This message contains link to the https://chatscope.io
                  website.
                  <br />
                  This link is clickable thanks to the
                  https://github.com/tasti/react-linkify library.
                </e> */}
                <ReactLinkify
                  componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a
                      target="blank"
                      rel="noopener"
                      href={decoratedHref}
                      key={key}
                      style={{ textDecoration: "underline" }}
                    >
                      {decoratedText}
                    </a>
                  )}
                >
                  <strong>{post.message_sender_name}</strong>
                  <br />
                  {post.message_body}
                </ReactLinkify>
              </Message.CustomContent>
              <Message.Footer sentTime={calculateTimeAgo(post.message_time)} />
            </Message>
          </React.Fragment>
        );
      })}
    </MessageList>
  );

  // return (
  //   <div className="h-full flex flex-col">
  //     {/* Header */}

  //     <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
  //       <div className="flex items-center">
  //         <div className="h-10 aspect-square">
  //           {sessionData.session_is_group && (
  //             <Image
  //               className="w-10 h-10 rounded-full object-cover"
  //               src={sessionData.session_user_one_profile_url}
  //               height={512}
  //               width={512}
  //               alt="profile"
  //             />
  //           )}

  //           {!sessionData.session_is_group &&
  //             sessionData.session_user_one_profile_url &&
  //             userData.user_type !== "Admin" && (
  //               <Image
  //                 className="w-10 h-10 rounded-full object-cover"
  //                 src={sessionData.session_user_one_profile_url}
  //                 height={512}
  //                 width={512}
  //                 alt="profile"
  //               />
  //             )}

  //           {!sessionData.session_is_group &&
  //             sessionData.session_user_two_profile_url &&
  //             userData.user_type !== "Mentor" && (
  //               <Image
  //                 className="w-10 h-10 rounded-full object-cover"
  //                 src={sessionData.session_user_two_profile_url}
  //                 height={512}
  //                 width={512}
  //                 alt="profile"
  //               />
  //             )}

  //           {!sessionData.session_is_group &&
  //             sessionData.session_user_three_profile_url &&
  //             userData.user_type !== "Student" && (
  //               <Image
  //                 className="w-10 h-10 rounded-full object-cover"
  //                 src={sessionData.session_user_three_profile_url}
  //                 height={512}
  //                 width={512}
  //                 alt="profile"
  //               />
  //             )}
  //         </div>
  //         <div className="ml-4">
  //           <div>
  //             {sessionData.session_is_group && (
  //               <p className="text-small-regular line-clamp-1 w-full">
  //                 {sessionData.session_group_name}
  //               </p>
  //             )}

  //             {!sessionData.session_is_group &&
  //               sessionData.session_user_one_name &&
  //               userData.user_type !== "Admin" && (
  //                 <p className="text-small-regular line-clamp-1 w-full">
  //                   {sessionData.session_user_one_name}
  //                 </p>
  //               )}

  //             {!sessionData.session_is_group &&
  //               sessionData.session_user_two_name &&
  //               userData.user_type !== "Mentor" && (
  //                 <p className="text-small-regular line-clamp-1 w-full">
  //                   {sessionData.session_user_two_name}
  //                 </p>
  //               )}

  //             {!sessionData.session_is_group &&
  //               sessionData.session_user_three_name &&
  //               userData.user_type !== "Student" && (
  //                 <p className="text-small-regular line-clamp-1 w-full">
  //                   {sessionData.session_user_three_name}
  //                 </p>
  //               )}
  //           </div>
  //           <p className="text-subtle-regular">
  //             {sessionData.session_is_group
  //               ? `${sessionData.session_participants.length} Members`
  //               : calculateTimeAgo(sessionData.session_last_time)}
  //           </p>
  //         </div>
  //       </div>

  //       <div className="flex">
  //         <Image
  //           className="w-8 h-8"
  //           src="/icons/vertical-menu-inactive.svg"
  //           height={512}
  //           width={512}
  //           alt="profile"
  //         />
  //       </div>
  //     </div>

  //     {/* Messages */}
  //     <div className="flex flex-col-reverse overflow-y-auto bg-[#DAD3CC] h-full">
  //       {loading && (
  //         <div className="flex flex-col justify-center h-full">
  //           <RingLoader />
  //         </div>
  //       )}

  //       {!loading && messages.length === 0 ? (
  //         <div className="mt-32 items-center">
  //           <EmptyState
  //             title={"This Chat Is Empty"}
  //             desc={
  //               "There is no messages in this chat, please add add a message to this chat or choose another chat. "
  //             }
  //           />
  //         </div>
  //       ) : (
  //         <MessageList data={messages} userData={userData} />
  //       )}
  //     </div>

  //     {/* Input */}
  //     <div className="bg-grey-lighter px-4 py-4 flex flex-row items-center">
  //       <div>
  //         <Image
  //           className="w-8 h-8 rounded-full object-cover"
  //           src="/icons/image-inactive.svg"
  //           height={512}
  //           width={512}
  //           alt="icon"
  //         />
  //       </div>
  //       <div className="flex-1 mx-4">
  //         <input
  //           className="w-full border rounded px-2 py-2"
  //           type="text"
  //           value={messageBody}
  //           onChange={handleBodyChange}
  //         />
  //       </div>
  //       <button
  //         type="button"
  //         className=" bg-primary-light border rounded-lg px-2 py-0"
  //         onClick={submitMessage}
  //       >
  //         <Image
  //           className="h-8 w-8"
  //           src="/icons/send-arrow.svg"
  //           height={200}
  //           width={200}
  //           alt="arrow icon"
  //         />
  //       </button>
  //     </div>
  //   </div>
  // );
};

export default MessagesView;
