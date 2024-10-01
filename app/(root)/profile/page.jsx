"use client";
import React, { useState } from "react";
import { UserAuth } from "@/lib/context/AuthContext";
import { Guardian } from "@/components/shared/Guardian";
import TextButton from "@/components/shared/TextButton";
import AdminProfile from "@/components/admin/AdminProfile";
import MentorProfile from "@/components/mentor/MentorProfile";
import StudentProfile from "@/components/student/StudentProfile";
import Submitter from "@/components/shared/Submitter";

const Profile = () => {
  const { userData, firebaseUser, fireLoaded, logOut } = UserAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const authRedirectComponent = Guardian(userData, firebaseUser, fireLoaded);

  if (authRedirectComponent) {
    return authRedirectComponent;
  }

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const submitNewPassword = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!oldPassword) {
      setError("Old password cannot be empty!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (!newPassword) {
      setError("New password cannot be empty!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      try {
        setLoading(true);
        setError("");

        // Re-authenticate the user
        const credential = EmailAuthProvider.credential(
          `${userData.user_phone}@gmail.com`,
          oldPassword
        );
        await reauthenticateWithCredential(firebaseUser, credential);

        // Update password
        await updatePassword(firebaseUser, newPassword);

        // Clear input fields after successful password change
        setOldPassword("");
        setNewPassword("");
        setSuccess("Password was changed successfully");
        setTimeout(() => {
          setSuccess("");
        }, 2000);
      } catch (error) {
        const errorCode = error.code;
        if (errorCode === "auth/invalid-credential") {
          setError(`Your old password is incorect.`);
        } else {
          setError(`Error! Check and try again.`);
        }
        setTimeout(() => {
          setError("");
        }, 2000);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      {loading && <Submitter />}
      {userData.user_type === "Admin" && <AdminProfile userData={userData} />}
      {userData.user_type === "Mentor" && <MentorProfile userData={userData} />}
      {userData.user_type === "Student" && (
        <StudentProfile userData={userData} />
      )}

      <div className="flex flex-col w-full mt-16">
        <p className="text-heading3-bold">Advanced Settings</p>
        <p className="text-base-medium">Notifications</p>
        <div className="flex flex-col space-y-4 mt-1">
          <div className="flex flex-col border border-slate-300 rounded-lg bg-white py-2 px-4">
            <p className="text-base-medium">New messages</p>
            <div className="flex flex-row justify-between space-x-6">
              <p className="text-small-regular ">
                You will receive notifications for every private message and
                group you are part of. We recommend keeping this feature enabled
                for instant alerts.
              </p>
              <div>
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  defaultChecked
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col border border-slate-300 rounded-lg bg-white py-2 px-4">
            <p className="text-base-medium">Modules and topics</p>
            <div className="flex flex-row justify-between space-x-6">
              <p className="text-small-regular ">
                You will receive notifications regarding your modules or any
                updates to existing ones. We recommend keeping this feature
                enabled to stay up-to-date with your lessons.
              </p>
              <div>
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  defaultChecked
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col border border-slate-300 rounded-lg bg-white py-2 px-4">
            <p className="text-base-medium">Forums you have interacted with</p>
            <div className="flex flex-row justify-between space-x-6">
              <p className="text-small-regular ">
                You will receive notifications for forums you are engaged in. We
                recommend keeping this feature enabled to stay updated with the
                latest discussions in the forums.
              </p>
              <div>
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  defaultChecked
                />
              </div>
            </div>
          </div>
        </div>
        {/* privacy and security */}
        <p className="text-base-medium mt-8">Privacy & Security</p>
        <div className="flex flex-col space-y-4 mt-1">
          <div className="flex flex-col border border-slate-300 rounded-lg bg-white py-2 px-4">
            <p className="text-base-medium">Privacy</p>
            <p className="text-small-regular ">
              We prioritize your privacy and confidentiality. We do not share
              any of your personal information with third parties or
              institutions without your explicit consent. Your data remains
              secure and used solely for the purposes outlined in our privacy
              policy. Rest assured, we are committed to safeguarding your
              information and ensuring transparency in how it is handled.
            </p>
          </div>
          <div className="flex flex-col border border-slate-300 rounded-lg bg-white py-2 px-4">
            <p className="text-base-medium">Change password</p>
            <p className="text-small-regular ">
              Your account security is your responsibility. To change your
              password, please enter your current password along with the new
              password below.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-8 my-2">
              <div className="">
                <input
                  type="text"
                  className="w-full py-2 border rounded-md border-gray-300 px-4 text-slate-700 outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
                  placeholder="Old password"
                  value={oldPassword}
                  disabled={loading}
                  onChange={handleOldPasswordChange}
                />
              </div>
              <div className="">
                <input
                  type="text"
                  className="w-full py-2 border rounded-md border-gray-300 px-4 text-slate-700 outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
                  placeholder="New password"
                  value={newPassword}
                  disabled={loading}
                  onChange={handleNewPasswordChange}
                />
              </div>
            </div>
            {error && (
              <div className="my-2">
                <ErrorBody error={error} />
              </div>
            )}

            {success && (
              <div className="my-2">
                <SuccessBody text={success} />
              </div>
            )}
            <div className="flex flex-row justify-end">
              <button
                className="text-small-regular text-white bg-primary-deep-light rounded-lg px-6 py-1.5 mt-1 mb-2"
                onClick={submitNewPassword}
              >
                <p>Change Password</p>
              </button>
            </div>
          </div>
        </div>

        {/* drawer */}
      </div>
      <div className="w-32 mx-auto mt-32">
        <TextButton text={"Log Out"} action={logOut} />
      </div>
    </div>
  );
};

export default Profile;
