import Image from "next/image";
import React, { useEffect, useState } from "react";
import DangerButton from "../shared/DangerButton";
import { deleteObject, ref } from "firebase/storage";
import { storage, db } from "@/lib/firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const DeleteBlog = ({ module }) => {
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
      handleDeleteBlog();
    }
    return () => clearInterval(timer);
  }, [isDeleting, countdown]);

  const handleDeleteBlog = async () => {
    try {
      // Reference to the image in Firebase Storage
      const imageRef = ref(storage, module.blog_image);

      // Delete the image
      await deleteObject(imageRef);
      console.log("Image deleted successfully");

      // Reference to the module document in Firestore
      const blogDocRef = doc(db, "Blogs", module.blog_id);

      // Delete the module document
      await deleteDoc(blogDocRef);
      console.log("Module document deleted successfully");

      // Navigate to the '/modules' page
      router.push("/ecosystem");
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
    <div className="flex flex-row justify-between items-center w-full bg-white border-2 border-red-200 px-6 py-4 rounded-xl">
      <div className="">
        <p className="text-body-bold md:text-heading3-bold text-slate-800">
          Delete Post
        </p>
        <p className="text-small-regular text-slate-500 mt-2 tracking-wide  border-b border-slate-200 pb-2">
          The post will be permanently deleted, including all the interactions.
          This action is irreversible and can not be undone.
        </p>
        <div className="flex flex-row mt-4 space-x-3 text-slate-600 border-b border-slate-200 pb-4">
          <Image
            alt=""
            src={module.blog_image}
            height={1080}
            width={1920}
            className="w-16 md:w-32 aspect-video rounded-md object-cover"
          />
          <div>
            <p className="text-small-regular font-extrabold">
              {module.blog_title}
            </p>

            <div
              className="text-small-regular line-clamp-3 max-w-md font-normal text-slate-500"
              contentEditable="true"
              dangerouslySetInnerHTML={{ __html: module.blog_description }}
            ></div>
          </div>
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

export default DeleteBlog;
