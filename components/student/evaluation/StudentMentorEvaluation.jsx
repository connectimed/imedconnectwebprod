import React, { useEffect, useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import ErrorBody from "@/components/shared/ErrorBody";
import ChoiceChips from "@/components/shared/ChoiceChips";

const StudentMentorEvaluation = ({ userData }) => {
  const { fetchUserData, logOut, isLocalhost } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mentorAccessibility, setMentorAccessibility] = useState("");
  const [mentorCommunication, setMentorCommunication] = useState("");
  const [mentorHelp, setMentorHelp] = useState("");
  const [mentorConcern, setMentorConcern] = useState("");
  const [mentorWasAsset, setMentorWasAsset] = useState("");
  const [mentorMyCareerPath, setMentorMyCareerPath] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const handleSuggestionChange = (e) => {
    const inputValue = e.target.value.slice(0, 600);
    setSuggestion(inputValue);
  };

  const saveData = async () => {
    if (
      !mentorAccessibility ||
      !mentorCommunication ||
      !mentorConcern ||
      !mentorHelp ||
      !mentorMyCareerPath ||
      !mentorWasAsset
    ) {
      setError("Please fill everything!");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "Evaluation", userData.user_id);
      await updateDoc(userRef, {
        evaluation_form_type: "MENTOR EVALUATION FORM",
        evaluation_performing_user: userData.user_id,
        evaluation_start_time: serverTimestamp(),
        evaluation_mentor_accessibility: mentorAccessibility,
        evaluation_mentor_communication: mentorCommunication,
        evaluation_mentor_help: mentorHelp,
        evaluation_mentor_concern: mentorConcern,
        evaluation_mentor_was_assets: mentorWasAsset,
        evaluation_mentor_my_career: mentorMyCareerPath,
        evaluation_suggestions: suggestion,
      });
      fetchUserData(userData.user_id);

      console.log("updated");
      setLoading(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div>
      <div className="mx-auto bg-white rounded-lg py-4">
        <p className="text-heading3-bold px-6">MENTOR EVALUATION FORM</p>
        <p className="text-small-regular text-gray-1 px-6">
          Please take time to provide feedback on the experience from your
          mentor/ coach. Your candid feedback will help us continuously improve
          the experience and relationship for a better impact. The information
          you provide shall be used with the highest degree of confidentially
          and not otherwise.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
          <div className="flex flex-col px-6">
            <p className="mt-1 mb-2 text-gray-1 text-small-regular">
              My mentor was accessible and available during the agreed mentoring
              sessions.
            </p>
            <div className="">
              <ChoiceChips
                choices={[
                  "Strongly Disagree",
                  "Disagree",
                  "Neutral",
                  "Agree",
                  "Strongly Agree",
                ]}
                selectedChoice={mentorAccessibility}
                onSelectChoice={setMentorAccessibility}
              />
            </div>
            {/* Question 2 */}
            <p className="mt-4 mb-2 text-gray-1 text-small-regular">
              My mentor communicated regularly with me.
            </p>
            <div className="">
              <ChoiceChips
                choices={[
                  "Strongly Disagree",
                  "Disagree",
                  "Neutral",
                  "Agree",
                  "Strongly Agree",
                ]}
                selectedChoice={mentorCommunication}
                onSelectChoice={setMentorCommunication}
              />
            </div>
            {/* Questuon 3 */}
            <p className="mt-4 mb-2 text-gray-1 text-small-regular">
              My mentor helps me find the correct resources to resolve my
              challenges.
            </p>
            <div className="">
              <ChoiceChips
                choices={[
                  "Strongly Disagree",
                  "Disagree",
                  "Neutral",
                  "Agree",
                  "Strongly Agree",
                ]}
                selectedChoice={mentorHelp}
                onSelectChoice={setMentorHelp}
              />
            </div>
            {/* Questuon 4 */}
            <p className="mt-4 mb-2 text-gray-1 text-small-regular">
              My mentor demonstrated a reasonable interest/concern towards me.
            </p>
            <div className="">
              <ChoiceChips
                choices={[
                  "Strongly Disagree",
                  "Disagree",
                  "Neutral",
                  "Agree",
                  "Strongly Agree",
                ]}
                selectedChoice={mentorConcern}
                onSelectChoice={setMentorConcern}
              />
            </div>
          </div>
          <div className="flex flex-col px-6 mt-4">
            {/* Questuon 5 */}
            <p className="mb-2 text-gray-1 text-small-regular">
              Overall, my mentor was an asset and a benefit to me.
            </p>
            <div className="">
              <ChoiceChips
                choices={[
                  "Strongly Disagree",
                  "Disagree",
                  "Neutral",
                  "Agree",
                  "Strongly Agree",
                ]}
                selectedChoice={mentorWasAsset}
                onSelectChoice={setMentorWasAsset}
              />
            </div>

            {/* Questuon 6 */}
            <p className="mt-4 mb-2 text-gray-1 text-small-regular">
              I feel more certain of my career path as a result of going through
              the mentoring experience.
            </p>
            <div className="">
              <ChoiceChips
                choices={[
                  "Strongly Disagree",
                  "Disagree",
                  "Neutral",
                  "Agree",
                  "Strongly Agree",
                ]}
                selectedChoice={mentorMyCareerPath}
                onSelectChoice={setMentorMyCareerPath}
              />
            </div>

            {/* Questuon 6 */}
            <p className="mt-4 mb-2 text-gray-1 text-small-regular">
              Any suggestion for improving mentorship/coaching experience?
            </p>
            <div className="">
              <textarea
                rows={3}
                className="simple_textinput max-h-32 min-h-24"
                defaultValue={""}
                placeholder="Description"
                value={suggestion}
                onChange={handleSuggestionChange}
              />
            </div>

            <div className="w-full mt-6">
              <div className="w-full">
                <button
                  type="button"
                  onClick={loading ? null : saveData}
                  className="simple_btn flex flex-row justify-center items-center gap-3"
                  disabled={loading}
                >
                  <Image
                    src="/icons/circle-chase.svg"
                    className={`h-4 w-4 animate-spin ${
                      loading ? "block" : "hidden"
                    }`}
                    height={20}
                    width={20}
                    alt="image"
                  />
                  <p>Submit</p>
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-5">
                <ErrorBody error={error} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMentorEvaluation;
