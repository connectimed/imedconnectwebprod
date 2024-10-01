import React from "react";
import PrimaryButton from "./PrimaryButton";
import { useRouter } from "next/navigation";

const AccessDenied = () => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/"); // Navigate to the home page
  };
  return (
    <section className="bg-gray-50">
      <div className="mx-auto">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl text-body-bold">Page Not Found</h1>

          <p className="mt-4 text-small-regular">
            The content you’re looking for doesn’t exist. Either it was removed,
            or you mistyped the link. Sorry about that! Please visit our hompage
            to get where you need to go.
          </p>

          <div className="mt-10">
            <PrimaryButton text={"Go Home"} action={handleNavigation} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessDenied;
