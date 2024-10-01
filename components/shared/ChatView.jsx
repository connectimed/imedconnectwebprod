import React, { useCallback, useEffect, useState } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationList,
  Conversation,
  Avatar,
  MessageSeparator,
  VoiceCallButton,
  VideoCallButton,
  ConversationHeader,
  TypingIndicator,
  Sidebar,
  Search,
  ExpansionPanel,
  InfoButton,
  EllipsisButton,
  StarButton,
} from "@chatscope/chat-ui-kit-react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { getOtherUserName } from "@/lib/actions/getOtherUserName";
import { getOtherUserProfile } from "@/lib/actions/getOtherUserProfile";
import calculateTimeAgo from "@/lib/actions/calculateTimeAgo";
import PrimaryButton from "./PrimaryButton";
import CreateGroupChat from "./CreateGroupChat";
import MessagesView from "./MessagesView";
import CreateLivestream from "./CreateLivestream";

const ChatView = ({ userData, fetchUserData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatHeads, setChatHeads] = useState([]);
  const [selectedChatHead, setSelectedChatHead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingLS, setSettingLS] = useState(false);
  const [messageBody, setMessageBody] = useState("");

  const handleBackClick = () => {
    setSelectedChatHead(null);
  };

  const getChatHeads = async (next = true) => {
    const dbInstance = collection(
      db,
      "Messaging/MessagingSessions/AllSessions"
    );
    const q = query(
      dbInstance,
      where("session_participants_ids", "array-contains", userData.user_id),
      orderBy("session_last_interaction", "desc"),
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

  const getMessages = async (next = true) => {
    // const dbInstance = collection(
    //   db,
    //   "Messaging/MessagingSessions/AllSessions"
    // );
    // const q = query(
    //   dbInstance,
    //   where("session_participants_ids", "array-contains", userData.user_id),
    //   orderBy("session_last_interaction", "desc"),
    //   limit(100)
    // );
    // setLoading(true);
    // try {
    //   const data = await getDocs(q);
    //   const newData = data.docs.map((item) => ({
    //     ...item.data(),
    //     id: item.id,
    //   }));
    //   setChatHeads(newData);
    //   const userRef = doc(db, "Users", userData.user_id);
    //   await updateDoc(userRef, {
    //     user_message_count: 0,
    //   });
    // } catch (error) {
    //   console.error("Error fetching Firestore data:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    if (selectedChatHead) {
      getMessages(false);
    }
  }, [selectedChatHead]);

  const submitMessage = async (e) => {
    if (!messageBody || isSubmitting) {
      // setError("Please fill everything correctly.");
      return;
    }

    try {
      setIsSubmitting(true);
      // setError(null);

      const messagesRef = collection(
        db,
        `Messaging/Messages/${selectedChatHead.session_id}`
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
        selectedChatHead.session_id
      );
      const updateData = {
        session_last_text: messageBody,
        session_last_interaction: serverTimestamp(),
      };

      //   // Update only if the user is 'Admin'
      //   if (userData.user_type === "Admin") {
      //     updateData.session_user_one_profile_url = userData.user_image;
      //     updateData.session_user_one_name = userData.user_full_name;
      //   }

      //   // Update only if the user is 'Mentor'
      //   if (userData.user_type === "Mentor") {
      //     updateData.session_user_two_profile_url = userData.user_image;
      //     updateData.session_user_two_name = userData.user_full_name;
      //   }

      //   // Update only if the user is 'Student'
      //   if (userData.user_type === "Student") {
      //     updateData.session_user_three_profile_url = userData.user_image;
      //     updateData.session_user_three_name = userData.user_full_name;
      //   }

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

  const updateChatHead = async (post) => {
    try {
      const chatSessionRef = doc(
        db,
        "Messaging/MessagingSessions/AllSessions",
        post.session_id
      );
      await updateDoc(chatSessionRef, {
        session_last_text_seen_by: arrayUnion(userData.user_id),
      });
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const handleBodyChange = (textContent) => {
    const inputValue = textContent.slice(0, 500); // Limit to 500 characters
    setMessageBody(inputValue);
  };

  return (
    <div>
      <div style={{ position: "relative", height: "500px" }}>
        <MainContainer
          responsive
          style={{
            height: "92vh",
          }}
        >
          <Sidebar
            style={{ display: "block" }}
            position="left"
            scrollable={false}
          >
            <ConversationHeader>
              <Avatar
                className="border border-red-600 md:border-blue"
                name="Emily"
                src={userData.user_image}
              />
              <ConversationHeader.Content
                info={userData.user_highest_field_of_study}
                userName={userData.user_full_name}
              />
              <ConversationHeader.Actions>
                {/* <InfoButton title="Show info" /> */}
              </ConversationHeader.Actions>
            </ConversationHeader>
            <ConversationList>
              {chatHeads.map((post) => (
                <Conversation
                  key={post.id}
                  active={
                    selectedChatHead &&
                    post.session_id === selectedChatHead.session_id
                  }
                  info={post.session_last_text}
                  //   lastSenderName="Lilly"
                  name={
                    post.session_is_group
                      ? post.session_group_name
                      : getOtherUserName(
                          userData.user_id,
                          post.session_participants_names
                        )
                  }
                  unreadDot={
                    !post.session_last_text_seen_by.includes(userData.user_id)
                  }
                  onClick={() => {
                    setSelectedChatHead(post);
                    updateChatHead(post);
                  }}
                >
                  <Avatar
                    name="Lilly"
                    src={
                      post.session_is_group
                        ? post.session_group_profile
                        : getOtherUserProfile(
                            userData.user_id,
                            post.session_participants_profiles
                          )
                    }
                    // status="invisible"
                  />
                </Conversation>
              ))}
            </ConversationList>
          </Sidebar>
          {selectedChatHead ? (
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Back onClick={handleBackClick} />
                <Avatar
                  //   name="Zoex"
                  src={
                    selectedChatHead.session_is_group
                      ? selectedChatHead.session_group_profile
                      : getOtherUserProfile(
                          userData.user_id,
                          selectedChatHead.session_participants_profiles
                        )
                  }
                />
                <ConversationHeader.Content
                  info={
                    selectedChatHead.session_is_group
                      ? `${selectedChatHead.session_participants_ids.length} members`
                      : `Active ${calculateTimeAgo(
                          selectedChatHead.session_last_interaction
                        )}`
                  }
                  userName={
                    selectedChatHead.session_is_group
                      ? selectedChatHead.session_group_name
                      : getOtherUserName(
                          userData.user_id,
                          selectedChatHead.session_participants_names
                        )
                  }
                />
                <ConversationHeader.Actions>
                  {(userData.user_type === "Admin" ||
                    userData.user_type === "Mentor") && (
                    <VideoCallButton
                      onClick={() =>
                        document.getElementById("createls").showModal()
                      }
                    />
                  )}
                </ConversationHeader.Actions>
              </ConversationHeader>
              {selectedChatHead && (
                <MessageList>
                  <MessagesView
                    sessionData={selectedChatHead}
                    userData={userData}
                  />
                </MessageList>
              )}
              {/* <MessageList>
                <MessageSeparator content="Saturday, 30 November 2019" />
                <Message
                  model={{
                    direction: "incoming",
                    message: "Hello my friend",
                    position: "single",
                    sender: "Zoe",
                    sentTime: "15 mins ago",
                  }}
                >
                  <Message.CustomContent>
                    <strong>This is strong text</strong>
                    <br />
                    Message content is provided as{" "}
                    <span style={{ color: "red" }}> custom elements</span> from
                    child <strong>Message.CustomContent</strong> element ahhaha
                    ahahaha ahahhaha ahahahah hahaha hhahah ahahahahhah ahahha
                  </Message.CustomContent>
                  <Message.Footer sentTime="just now" />
                </Message>
                <Message
                  model={{
                    direction: "outgoing",
                    message: "Hello my friend",
                    position: "single",
                    sender: "Patrik",
                    sentTime: "15 mins ago",
                  }}
                >
                  <Message.CustomContent>
                    <strong>This is strong text</strong>
                    <br />
                    Message content is provided as{" "}
                    <span style={{ color: "red" }}> custom elements</span> from
                    child <strong>Message.CustomContent</strong> element ahhaha
                    ahahaha ahahhaha ahahahah hahaha hhahah ahahahahhah ahahha
                  </Message.CustomContent>
                  <Message.Footer sentTime="just now" />
                </Message>
              </MessageList> */}
              <MessageInput
                placeholder="Type message here"
                onChange={handleBodyChange}
                value={messageBody}
                onSend={submitMessage}
              />
            </ChatContainer>
          ) : (
            <CreateGroupChat
              userData={userData}
              fetchUserData={fetchUserData}
            />
          )}
        </MainContainer>
      </div>
      {selectedChatHead && (
        <dialog id="createls" className="modal">
          <div className="modal-box">
            <CreateLivestream
              userData={userData}
              fetchUserData={fetchUserData}
              invited={selectedChatHead.session_participants_ids}
              sessionId={selectedChatHead.session_id}
            />
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ChatView;
