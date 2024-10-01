"use client";
import RingLoader from "@/components/shared/RingLoader";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";

const page = ({ params }) => {
  const pdfID = params.pdfID;
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fetchUrl = async () => {
      const storage = getStorage();
      try {
        const fileRef = ref(storage, `Subtopics/Files/2024/${pdfID}.pdf`);
        const downloadUrl = await getDownloadURL(fileRef);
        setUrl(downloadUrl);
      } catch (error) {
        console.error("Error fetching file URL:", error);
        // Handle any errors
      }
    };

    fetchUrl();
  }, [pdfID]);

  return (
    <div>
      {url ? (
        <iframe className="w-full h-screen" src={url} />
      ) : (
        <div className="mt-80 mb-80">
          <RingLoader />
        </div>
      )}
    </div>
  );
};

export default page;
