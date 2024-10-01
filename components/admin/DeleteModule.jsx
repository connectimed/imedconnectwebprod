import Image from "next/image";
import React, { useEffect, useState } from "react";
import DangerButton from "../shared/DangerButton";
import { deleteObject, ref } from "firebase/storage";
import { storage, db } from "@/lib/firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const DeleteModule = ({ module }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const router = useRouter();

  useEffect(() => {
    let timer;
    if (isDeleting && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleDeleteModule();
    }
    return () => clearInterval(timer);
  }, [isDeleting, countdown]);

  const handleDeleteModule = async () => {
    try {
      // Reference to the image in Firebase Storage
      const imageRef = ref(storage, module.module_image);

      // Delete the image
      await deleteObject(imageRef);
      console.log("Image deleted successfully");

      // Reference to the module document in Firestore
      const moduleDocRef = doc(db, "Modules", module.module_id);

      // Delete the module document
      await deleteDoc(moduleDocRef);
      console.log("Module document deleted successfully");

      // Navigate to the '/modules' page
      router.push("/modules");
    } catch (error) {
      console.error("Error deleting module or image: ", error);
      // Reset state on error
      setIsDeleting(false);
      setCountdown(15);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setCountdown(15);
  };

  const handleStartDelete = () => {
    setIsDeleting(true);
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center w-full border border-red-200 rounded-xl bg-white px-4 py-3 mb-4">
        <div className="flex flex-row space-x-2 items-center">
          <Image
            className="h-10 w-10"
            src="/icons/delete.svg"
            height={200}
            width={200}
            alt="arrow icon"
          />

          <div className="tracking-wide">
            <p className="text-base-medium text-slate-600">Delete Module</p>
            <p className="text-small-regular text-slate-400">
              The module will be permanently deleted.
            </p>
          </div>
        </div>
        <div className="">
          {isDeleting ? (
            <DangerButton
              text={`Cancel ${countdown}s`}
              action={handleCancelDelete}
            />
          ) : (
            <DangerButton text="Delete" action={handleStartDelete} />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-row justify-between items-center w-full bg-white border-2 border-red-200 px-6 py-4 rounded-xl">
      <div className="flex flex-row">
        <div>
          <p className="text-body-bold md:text-heading3-bold text-slate-800">
            Delete Module
          </p>
          <p className="text-small-regular text-slate-500 mt-2 tracking-wide pb-2">
            The module will be permanently deleted.
          </p>
        </div>

        <div className="flex flex-row justify-end mt-4">
          {isDeleting ? (
            <DangerButton
              text={`Cancel ${countdown}s`}
              action={handleCancelDelete}
            />
          ) : (
            <DangerButton text="Delete" action={handleStartDelete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteModule;
