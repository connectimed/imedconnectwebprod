import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import NotificationDrawer from "./NotificationDrawer";
// import component 👇
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";
import AdminNewMentors from "../admin/AdminNewMentors";
import ChatView from "./ChatView";

const ProfileDropdown = ({ userData, fetchUserData }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messageIsOpen, setMessageIsOpen] = React.useState(false);
  const toggleMessageDrawer = () => {
    // setMessageIsOpen((prevState) => !prevState);
    setMessageIsOpen(true);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    if (isDrawerOpen) {
      fetchUserData(userData.user_id);
    }
  };

  return (
    <div className="flex flex-row items-center space-x-5">
      <div className="relative" onClick={toggleMessageDrawer}>
        <Image
          src="/icons/messaging.svg"
          className="h-6 w-6"
          height={200}
          width={200}
          alt="image"
        />
        {userData && userData.user_message_count > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full py-1.5 px-1 text-center text-x-regular border-2 border-white">
            {userData.user_message_count < 10
              ? userData.user_message_count
              : "9+"}
          </div>
        )}
        <Drawer
          open={messageIsOpen}
          onClose={() => setMessageIsOpen(false)}
          direction="bottom"
          className="h-full"
          lockBackgroundScroll={true}
          size="92%"
          style={{
            borderTopRightRadius: "20px",
            borderTopLeftRadius: "20px",
          }}
        >
          <div>
            {userData && (
              <ChatView userData={userData} fetchUserData={fetchUserData} />
            )}
          </div>
        </Drawer>
      </div>

      <div className="relative">
        <div onClick={toggleDrawer} className="relative cursor-pointer">
          <Image
            src="/icons/notification.svg"
            className="h-6 w-6"
            height={200}
            width={200}
            alt="notification"
          />
          {userData && userData.user_notification_count > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full py-1.5 px-1 text-x-regular border-2 border-white">
              {userData.user_notification_count < 10
                ? userData.user_notification_count
                : "9+"}
            </div>
          )}
        </div>

        {/* Overlay */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10"
            onClick={toggleDrawer}
          ></div>
        )}

        {/* Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-white transform transition-transform z-20 ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <NotificationDrawer
            userData={userData}
            isDrawerOpen={isDrawerOpen}
            fetchUserData={fetchUserData}
          />
        </div>
      </div>
      <Link
        href="/profile"
        className="w-9 h-9 rounded-md overflow-hidden border-2 border-slate-300"
      >
        <img
          src={
            userData
              ? userData.user_image
              : "https://firebasestorage.googleapis.com/v0/b/shipdashx.appspot.com/o/Placeholder%2Fuser.jpg?alt=media&token=49c006a6-a94c-4ab2-93ea-a96f14095060"
          }
          alt=""
          className="w-full h-full object-cover"
        />
      </Link>
    </div>
  );
};

export default ProfileDropdown;
