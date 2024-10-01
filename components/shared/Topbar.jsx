"use client";
import Image from "next/image";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import { UserAuth } from "@/lib/context/AuthContext";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";

const Topbar = () => {
  const pathname = usePathname();
  const { userData, fetchUserData, firebaseUser, logOut } = UserAuth();

  const handleSignOut = async () => {
    logOut();
  };

  if (!firebaseUser) {
    return null;
  }

  return (
    <nav className="topbar">
      <div className="flex flex-row justify-center items-center">
        <div className="drawer w-8 lg:hidden">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <div className="h-4">
              <label htmlFor="my-drawer" className="cursor-pointer">
                <img
                  src="/icons/menu-opener.svg"
                  alt="Open drawer"
                  className="w-4 h-4"
                />
              </label>
            </div>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <section className="custom-scrollbar drawer-menu">
              <div className="flex w-full flex-1 flex-col gap-2 px-6">
                {sidebarLinks.map((link) => {
                  const isActive =
                    (pathname.includes(link.route) && link.route.length > 1) ||
                    pathname === link.route;

                  return (
                    <Link
                      href={link.route}
                      key={link.label}
                      className={`leftsidebar_link ${
                        isActive && "bg-gray-100"
                      }`}
                    >
                      <Image
                        src={isActive ? link.imgURL : link.darkImgURL}
                        alt={link.label}
                        className="h-4"
                        width={24}
                        height={24}
                      />
                      <p
                        className={`max-lg:block ${
                          isActive ? "text-primary-light" : "text-gray-500"
                        }`}
                      >
                        {link.label}
                      </p>{" "}
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
        <Link href="/" className="">
          <p className="text-primary-deep-light text-heading4-medium">
            IMED Connect
          </p>
        </Link>
      </div>

      <ProfileDropdown userData={userData} fetchUserData={fetchUserData} />
    </nav>
  );
};

export default Topbar;
