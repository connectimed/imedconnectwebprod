"use client";
import { Guardian } from "@/components/shared/Guardian";
import { UserAuth } from "@/lib/context/AuthContext";
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import RingLoader from "@/components/shared/RingLoader";
import NotFound from "@/components/shared/NotFound";
import EmptyState from "@/components/shared/EmptyState";
import "instantsearch.css/themes/satellite.css";
import Link from "next/link";
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
} from "react-instantsearch";
import Image from "next/image";
import { algoliasearch } from "algoliasearch";

const page = ({ params }) => {
  const { firebaseUser, fetchUserData, userData, fireLoaded } = UserAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const dbInstance = collection(db, "Livestreams");
  const livestreamId = params.livestreamId;
  const [copiedId, setCopiedId] = useState(false);

  const searchClient = algoliasearch(
    "WNF2HP7JZA",
    "673bf0f7c5f10e76917d0c812100d32d"
  );

  const getContentById = async (id) => {
    const q = query(dbInstance, where("livestream_id", "==", id), limit(1));

    try {
      const data = await getDocs(q);
      const contentData = data.docs.find((item) => item.id === id);
      console.log("Getting data");

      if (contentData) {
        return { ...contentData.data(), id: contentData.id };
      } else {
        console.error("Content not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
      throw error;
    }
  };

  function toFirebaseTimestamp(obj) {
    return new Timestamp(obj._seconds, obj._nanoseconds);
  }

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        setLoading(true);
        const data = await getContentById(livestreamId);
        // setNewStatus(data.package_status);
        // setStatus(data.package_status);
        setContent(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching press release:", error);
      }
    };

    fetchContentData();
  }, []);

  const authRedirectComponent = Guardian(userData, firebaseUser, fireLoaded);

  if (authRedirectComponent) {
    return authRedirectComponent;
  }

  const copyLink = (content) => {
    navigator.clipboard
      .writeText(
        window.location.protocol +
          "//" +
          window.location.host +
          content.livestream_url
      )
      .then(() => {
        setCopiedId(content.livestream_id);
        setTimeout(() => {
          setCopiedId("");
        }, 3000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  const inviteUser = async (id) => {
    try {
      // setIsSubmitting(true);

      const forumsRef = doc(db, "Livestreams", content.livestream_id);
      await updateDoc(forumsRef, {
        livestream_invited_users: arrayUnion(id),
      });
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      // setIsSubmitting(false);
      // Trigger a side effect after the update
      // setFetchTrigger(!fetchTrigger);
    }
  };

  function Hit({ hit }) {
    return (
      <div className="flex flex-row gap-x-6 py-1">
        <Image
          className=" h-12 w-12 rounded-full bg-gray-50 object-cover"
          src={hit.user_image}
          height={512}
          width={512}
          alt=""
        />
        <div className="flex flex-col">
          <div className="text-small-regular font-bold">
            <Highlight attribute="user_full_name" hit={hit} />
          </div>
          <p className="mt-1 text-subtle-regular text-gray-600 line-clamp-2 tracking-wide">
            <Highlight attribute="user_bio" hit={hit} />
          </p>
          <div className="mt-2">
            <button
              className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
              onClick={() => inviteUser(hit.user_id)}
            >
              <p>Invite To Livestream</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <RingLoader />;
  }

  if (!loading && !content) {
    return (
      <EmptyState
        title={"No Content"}
        desc={
          "Looks like there is no content for this livestream. Please check the url and try again."
        }
      />
    );
  }

  return (
    <div>
      <div className="border rounded-xl shadow-sm bg-white py-4 sm:py-6">
        <div className="px-4 sm:px-6">
          <p className="text-base-regular font-medium text-gray-700">
            {content.livestream_title}
          </p>
          <p className="mt-1 line-clamp-3 text-subtle-regular text-gray-400">
            Host: {content.livestream_poster_user_name}
          </p>
          <div className="mt-1 text-small-regular text-gray-500">
            {content.livestream_body}
          </div>
        </div>

        {/* interection */}
        <div className="flex flex-row justify-end px-4 sm:px-6 pt-4 text-subtle-regular text-slate-400 tracking-wide space-x-6">
          {copiedId === content.livestream_id ? (
            <button className=" text-success-1 text-small-regular outline-none tracking-wide border border-success-1 rounded-lg px-6 py-1.5">
              <p>✓ Copied</p>
            </button>
          ) : (
            <button
              className=" text-slate-500 text-small-regular outline-none tracking-wide border rounded-lg px-6 py-1.5"
              onClick={() => copyLink(content)}
            >
              <p>Copy Link</p>
            </button>
          )}
          <Link
            className="text-small-regular cursor-pointer py-1.5 px-6 border rounded-lg bg-primary-light text-white"
            target="_blank"
            href={content.livestream_url}
          >
            <p className="text-center">Join Livestream</p>
          </Link>
        </div>
        <div className="flex flex-col px-4 sm:px-6 pt-4">
          <InstantSearch searchClient={searchClient} indexName="studentsIndex">
            <Configure
              analytics={false}
              // filters={`package_branch_owner:${branchData.branch_owner}`}
              hitsPerPage={20}
            />
            <SearchBox className="" />
            <Hits hitComponent={Hit} className="mt-4" />
            <Pagination className="flex justify-center my-10" />
          </InstantSearch>
        </div>
      </div>
    </div>
  );
};

export default page;
