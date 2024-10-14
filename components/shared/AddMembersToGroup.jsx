import React, { useEffect, useState } from "react";
import DateNavigator from "./DateNavigator";
import TimeInput from "./TimeInput";
import ErrorBody from "./ErrorBody";
import {
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { format } from "date-fns";
import { algoliasearch } from "algoliasearch";
import calculateTimeAgo from "@/lib/actions/calculateTimeAgo";
import Image from "next/image";

// Initialize Algolia client and index
const algoliaClient = algoliasearch(
  "QMB01TJZWC",
  "60ad3b773471127b19ca9cb3b98cc44c"
);

const indexName = "studentsIndex";

const StudentsList = ({ data, userData, fetchUserData, sessionId }) => {
  const [addedMemberIDs, setAddedMemberIDs] = useState([]);

  const handleRemoveUser = (post) => {
    setAddedMemberIDs((prev) => removeFromList(prev, post.user_id));
    removeFromGroupChat(post.user_id);
  };

  const handleAddUser = (post) => {
    setAddedMemberIDs((prev) => addToList(prev, post.user_id));
    addToGroupChat(post.user_id);
  };

  const addToGroupChat = async (userId) => {
    try {
      const chatHeadRef = doc(
        db,
        "Messaging/MessagingSessions/AllSessions",
        sessionId
      );

      await updateDoc(chatHeadRef, {
        session_last_interaction: serverTimestamp(),
        session_participants_ids: arrayUnion(userId),
      });

      console.log("User added to the group chat.");
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const removeFromGroupChat = async (userId) => {
    try {
      const chatHeadRef = doc(
        db,
        "Messaging/MessagingSessions/AllSessions",
        sessionId
      );

      await updateDoc(chatHeadRef, {
        session_last_interaction: serverTimestamp(),
        session_participants_ids: arrayRemove(userId),
      });

      console.log("User removed from the group chat.");
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  // Helper functions to manage the addedMemberIDs array
  const addToList = (prevList, userId) => {
    return [...prevList, userId];
  };

  const removeFromList = (prevList, userId) => {
    return prevList.filter((id) => id !== userId);
  };

  return (
    <div className="flex flex-col space-y-2 h-96">
      {data.map((post) => (
        <div key={post.id}>
          <div className="border border-slate-200 rounded-xl bg-white py-4 px-4">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row space-x-2">
                <Image
                  className="h-8 w-8 rounded-md"
                  src={post.user_image}
                  height={200}
                  width={200}
                  alt="arrow icon"
                />
                <div>
                  <div className="text-small-regular text-gray-500">
                    {post.user_full_name}
                  </div>

                  <div className="text-tiny-regular text-gray-500 line-clamp-1">
                    {post.user_highest_field_of_study}
                  </div>
                </div>
              </div>
              {addedMemberIDs.includes(post.user_id) ? (
                <Image
                  className="h-8 w-8 rounded-md hover:cursor-pointer"
                  src="/icons/check-active.svg"
                  height={200}
                  width={200}
                  alt="arrow icon"
                  onClick={() => handleRemoveUser(post)}
                />
              ) : (
                <Image
                  className="h-8 w-8 rounded-md hover:cursor-pointer"
                  src="/icons/check-inactive.svg"
                  height={200}
                  width={200}
                  alt="arrow icon"
                  onClick={() => handleAddUser(post)}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AddMembersToGroup = ({ userData, fetchUserData, invited, sessionId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [queryText, setQueryText] = useState("");
  const [desc, setDesc] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleQueryChange = (e) => {
    const inputValue = e.target.value.slice(0, 30);
    setQueryText(inputValue);
  };

  const handleClose = () => {
    document.getElementById("addMembers").close();
  };

  const submitMessage = async (newDocId) => {
    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);
    combinedDateTime.setSeconds(0); // Optional: Reset seconds to 0
    combinedDateTime.setMilliseconds(0);
    try {
      const messagesRef = collection(db, `Messaging/Messages/${sessionId}`);
      const msgRef = await addDoc(messagesRef, {
        message_is_image: false,
        message_body: `${
          userData.user_full_name
        } has created a livestream session. The session will begin on ${format(
          selectedDate,
          "EEEE, dd MMMM yyyy"
        )}. You can join the livestream using the following link: ${
          process.env.NEXT_PUBLIC_DOMAIN
        }/livestream/${newDocId}?roomID=${newDocId}"`,
        message_id: "",
        message_image: "",
        message_sender_id: userData.user_id,
        message_sender_name: userData.user_full_name,
        message_seen_by: [userData.user_id],
        message_time: serverTimestamp(),
        message_visibility: true,
        message_type: "message",
        message_quoted_id: "",
        message_quoted_name: "",
        message_quoted_body: "",
      });

      const msgDocId = msgRef.id;

      await setDoc(
        doc(messagesRef, msgDocId),
        {
          message_id: msgDocId,
        },
        { merge: true }
      );

      const chatSessionRef = doc(
        db,
        "Messaging/MessagingSessions/AllSessions",
        sessionId
      );
      const updateData = {
        session_last_text: "Livestream invitation link",
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
      fetchUserData(userData.user_id);
      // router.push("/");
    }
  };

  ///dearching stufff

  const getStudents = async () => {
    const dbInstance = collection(db, "Users");
    const q1 = query(
      dbInstance,
      where("user_type", "==", "Student"),
      where("user_verified", "==", true)
    );
    setLoading(true);
    try {
      const data = await getDocs(q1);

      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));

      setStudents(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false); // Set loading state after the query completes (whether success or error)
    }
  };

  // Function to search in Algolia and query Firestore
  const searchInAlgolia = async (term) => {
    if (!term) {
      getStudents(); // Fetch all students if search term is empty
      return;
    }

    setLoading(true);
    try {
      const { results } = await algoliaClient.search({
        requests: [
          {
            indexName,
            query: term,
          },
        ],
      });

      if (results.length > 0) {
        const hits = results[0].hits; // Get the first result set
        const names = hits.map((hit) => hit.user_full_name); // Extract the names from Algolia results

        // Query Firestore for users with the returned names
        if (names.length > 0) {
          const dbInstance = collection(db, "Users");
          const q2 = query(dbInstance, where("user_full_name", "in", names));
          const data = await getDocs(q2);
          const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setStudents(filteredData);
        } else {
          setStudents([]);
        }
      } else {
        setStudents([]); // No results from Algolia
      }
    } catch (error) {
      console.error("Error searching in Algolia or Firestore:", error);
    } finally {
      setLoading(false);
    }
  };

  // Watch for search input changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchInAlgolia(queryText);
    }, 300); // Adding a debounce for performance improvement

    return () => clearTimeout(delayDebounceFn);
  }, [queryText]);

  useEffect(() => {
    if (!queryText) {
      getStudents();
    }
  }, [queryText]);

  return (
    <div>
      <p className="font-bold text-base-regular">Add members!</p>

      <div className="mt-3">
        <input
          type="text"
          autoComplete="full_name"
          className="simple_textinput"
          placeholder="Search student"
          value={queryText}
          onChange={handleQueryChange}
        />
      </div>

      {!loading && students.length > 0 && (
        <div>
          <StudentsList
            data={students}
            userData={userData}
            fetchUserData={fetchUserData}
            sessionId={sessionId}
          />
        </div>
      )}

      <div className="modal-action w-full">
        <form method="dialog" className="w-full">
          {/* if there is a button in form, it will close the modal */}
          <div className="flex flex-row justify-end items-center space-x-4 w-full">
            <div className="">
              <button
                className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMembersToGroup;
