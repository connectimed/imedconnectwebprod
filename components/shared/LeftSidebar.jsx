"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserAuth } from "@/lib/context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import MiniProfileCard from "../shared/MiniProfileCard";

const LeftSidebar = () => {
  const pathname = usePathname();
  const { firebaseUser, logOut, userData, branchData } = UserAuth();

  if (!firebaseUser) {
    return null;
  }

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-2 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-gray-100"}`}
            >
              <Image
                src={isActive ? link.imgURL : link.darkImgURL}
                alt={link.label}
                className="h-4 w-4"
                width={24}
                height={24}
              />

              <div className="flex flex-row items-center">
                <p
                  className={`max-lg:hidden tracking-wide ${
                    isActive ? "text-primary-light" : "text-gray-500"
                  }`}
                >
                  {link.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {!userData ? null : (
        <div className="cursor-pointer" onClick={logOut}>
          <MiniProfileCard userInfo={userData} />
        </div>
      )}
    </section>
  );
};

export default LeftSidebar;
