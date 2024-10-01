import Image from "next/image";
import Link from "next/link";
import React from "react";

const MentorInfoCard = ({
  profileUrl,
  profileName,
  profileFieldOfStudy,
  profileId,
}) => {
  return (
    <div className=" flex flex-row justify-between space-x-2 items-center px-2 py-1.5 border rounded-lg border-slate-300">
      <div className="flex flex-row space-x-3">
        <Image
          src="/images/imed-logo.png"
          className="h-9 w-9 border rounded-full"
          height={512}
          width={512}
          alt="user profile"
        />
        <div>
          <p className="text-small-regular text-slate-700">IMED Connect</p>
          <p className="text-subtle-regular text-slate-500 line-clamp-1">
            Uploaded by IMED Administration
          </p>
        </div>
      </div>
      <Link
        href={`/messaging?id=${profileId}`}
        className=" bg-primary-light border rounded-lg py-1 px-4 h-8"
      >
        <Image
          src="/icons/message-white.svg"
          className="h-full w-full"
          height={512}
          width={512}
        />
      </Link>
    </div>
  );
};

export default MentorInfoCard;
