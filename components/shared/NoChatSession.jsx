import Image from "next/image";
import React from "react";

const NoChatSession = () => {
  return (
    <div className="h-full">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <Image
          className="h-40 w-40 object-contain"
          src="/images/messaging.png"
          height={512}
          width={512}
          alt="messaging"
        />
        <p className="text-heading3-bold">No Chat Selected</p>
        <p className="max-w-md text-center mt-4 text-small-regular tracking-wide">
          Coverstions of a chat will be viewed from here. Select a chat to view
          the messages in it.
        </p>
      </div>
    </div>
  );
};

export default NoChatSession;
