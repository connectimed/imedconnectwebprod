"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserAuth } from "@/lib/context/AuthContext";

const Bottombar = () => {
  const pathname = usePathname();
  const { firebaseUser } = UserAuth();

  if (!firebaseUser) {
    return null;
  }

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link h-8 w-8 ${
                isActive && "bg-primary-500"
              }`}
            >
              <Image
                src={isActive ? link.imgURL : link.darkImgURL}
                alt={link.label}
                width={24}
                height={24}
              ></Image>

              <p className="text-subtle-medium text-dark-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
