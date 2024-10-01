import React, { useState } from "react";
import DateNavigator from "./DateNavigator";
import TimeInput from "./TimeInput";
import ErrorBody from "./ErrorBody";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { format } from "date-fns";

const CreateLivestream = ({ userData, fetchUserData, invited, sessionId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    console.log("Selected date:", newDate);
    setSelectedDate(newDate);
  };

  const handleTitleChange = (e) => {
    const inputValue = e.target.value.slice(0, 30);
    setTitle(inputValue);
  };

  const handleDescChange = (e) => {
    const inputValue = e.target.value.slice(0, 500);
    setDesc(inputValue);
  };

  const handleClose = () => {
    document.getElementById("createls").close();
  };

  const submitPost = async (e) => {
    e.preventDefault();

    if (title.length < 10) {
      setError("Title too short.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (desc.length < 30) {
      setError("Description too short.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (hours === "" || minutes === "") {
      setError("Please provide both hours and minutes.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (isSubmitting) {
      return;
    }
    document.getElementById("createls").close();

    try {
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(hours);
      combinedDateTime.setMinutes(minutes);
      combinedDateTime.setSeconds(0); // Optional: Reset seconds to 0
      combinedDateTime.setMilliseconds(0);

      const forumsRef = collection(db, "Livestreams");
      const docRef = await addDoc(forumsRef, {
        livestream_title: title.trim(),
        livestream_body: desc.trim(),
        livestream_owner: userData.user_id,
        livestream_created_time: serverTimestamp(),
        livestream_url: "",
        livestream_visible: true,
        livestream_is_public: true,

        // analytics
        livestream_joined_users: [],
        livestream_invited_users: invited,
        livestream_left_users: [],
        livestream_removed_users: [],
        livestream_start_time: Timestamp.fromDate(combinedDateTime),
        livestream_end_time: serverTimestamp(),
        livestream_id: "",
        livestream_room_id: "",

        // poster user data
        livestream_poster_full_name: userData.user_full_name,
        livestream_poster_user_name: userData.user_full_name,
        livestream_poster_image_url: userData.user_image,
      });

      const newDocId = docRef.id;

      await setDoc(
        doc(forumsRef, newDocId),
        {
          livestream_id: newDocId,
          livestream_room_id: newDocId,
          livestream_url: `/livestream/${newDocId}?roomID=${newDocId}`,
        },
        { merge: true }
      );

      // Call submitMessage to send a message
      submitMessage(newDocId);
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setIsSubmitting(false);
      setDesc("");
      setTitle("");
    }
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

  return (
    <div>
      <p className="font-bold text-base-regular">Enter details!</p>
      <p className="text-small-regular mt-1">
        Enter the details to create the livestream!
      </p>
      <div className="mt-3">
        <input
          type="text"
          autoComplete="full_name"
          className="simple_textinput"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <div className="mt-4 leading-relaxed ">
        <textarea
          rows={3}
          className="simple_textinput max-h-32 min-h-24"
          defaultValue={""}
          placeholder="Description"
          value={desc}
          onChange={handleDescChange}
        />
      </div>

      <div className="mt-2 flex flex-col space-y-4">
        <div>
          <p className="text-small-regular mb-2">
            Schedule the livestreaming date
          </p>
          <DateNavigator
            initialDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>

        <div>
          <p className="text-small-regular mb-2">Set time in 24 hrs format</p>
          <TimeInput
            hours={hours}
            minutes={minutes}
            onHoursChange={setHours}
            onMinutesChange={setMinutes}
          />
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <ErrorBody error={error} />
        </div>
      )}

      <div className="modal-action w-full">
        <form method="dialog" className="w-full">
          {/* if there is a button in form, it will close the modal */}
          <div className="flex flex-row justify-between items-center space-x-4 w-full">
            <div className="">
              <button
                className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
            <button
              className="bg-primary-light text-white text-base-semibold border rounded-lg px-5 py-1 tracking-wide"
              onClick={submitPost}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLivestream;
