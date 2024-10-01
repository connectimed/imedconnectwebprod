import React, { useEffect, useState } from "react";
import TimeAgo from "./TimeAgo";
import Image from "next/image";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import Link from "next/link";
import EmptyState from "./EmptyState";
import calculateTimeAgo from "@/lib/actions/calculateTimeAgo";
import RingLoader from "./RingLoader";

const CommentsList = ({ data, userData }) => {
  return (
    <div className="">
      {data.map((post) => (
        <div key={post.id} className="">
          <div
            className="flex flex-row items-start w-full py-2.5 px-1.5 text-start space-x-2"
            // onClick={() => handlePostClick(post)}
          >
            <Image
              alt="image"
              src={post.comment_poster_image_url}
              height={512}
              width={512}
              className="h-6 w-6 rounded-full  object-cover object-center"
            />
            <div className="flex flex-col w-full">
              <div className="w-full flex flex-row justify-between tracking-wide">
                <h6 className="text-x-small-regular text-slate-700 line-clamp-1">
                  {post.comment_poster_full_name}
                </h6>
                <p className="text-tiny-regular text-slate-400 ">
                  {calculateTimeAgo(post.comment_time)}
                </p>
              </div>
              <p className="text-subtle-regular text-gray-700">
                {post.comment_text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ForumItems = ({ data, userData, fetchUserData }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [postsData, setPostsData] = useState(data);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textToReply, setTextToReply] = useState("");
  const [repliedCommentSortingId, setRepliedCommentSortingId] = useState("");

  const handleCommentChange = (e) => {
    const inputValue = e.target.value.slice(0, 10000);
    setComment(inputValue);
  };

  const openDialog = (post) => {
    setSelectedPost(post);
    const dialog = document.getElementById("forum_modal");
    if (dialog) {
      dialog.showModal();
      setTextToReply();
    }
  };

  const handleClose = () => {
    setSelectedPost(null);
    setComments([]);
    const dialog = document.getElementById("forum_modal");
    if (dialog) {
      dialog.close();
    }
  };

  const getComments = () => {
    const dbInstance = collection(db, "ForumComments");
    const q1 = query(
      dbInstance,
      where("comment_parent_forum", "==", selectedPost.forum_id),
      orderBy("comment_replied_id", "desc")
    );

    setLoading(true);

    const unsubscribe = onSnapshot(
      q1,
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setComments(newData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching Firestore data:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Clean up the listener
  };

  useEffect(() => {
    const dialog = document.getElementById("forum_modal");
    if (selectedPost && dialog) {
      dialog.showModal();
      const unsubscribe = getComments();
      return () => unsubscribe(); // Clean up on component unmount
    }
  }, [selectedPost]);

  // useEffect(() => {
  //   if (selectedPost) {
  //     const unsubscribe = getComments();
  //     return () => unsubscribe(); // Clean up on component unmount
  //   }
  // }, [selectedPost]);

  // This is a comment

  useEffect(() => {
    setPostsData(data);
  }, [data]);

  const toggleLike = async (forumId) => {
    const updatedPosts = postsData.map((post) => {
      if (post.forum_id === forumId) {
        const isLiked = post.forum_likes.includes(userData.user_id);
        const updatedLikes = isLiked
          ? post.forum_likes.filter((uid) => uid !== userData.user_id)
          : [...post.forum_likes, userData.user_id];

        // Update the likes count and likedByUser in Firestore

        updateDoc(doc(collection(db, "Forums"), forumId), {
          forum_likes: updatedLikes,
        });

        // Update post data
        // Hello there
        const updatedPost = {
          ...post,
          forum_likes: updatedLikes,
        };

        // If the post is the selected one, update it as well
        if (selectedPost && selectedPost.forum_id === forumId) {
          setSelectedPost(updatedPost);
        }

        return updatedPost;
      }
      return post;
    });

    setPostsData(updatedPosts);
  };

  const submitPost = async (e) => {
    e.preventDefault();

    // if (!comment || isSubmitting) {
    //   // setError("Please fill everything correctly.");
    //   return;
    // }

    try {
      // setIsSubmitting(true);
      // setError(null);

      const commentsRef = collection(db, "ForumComments");
      const docRef = await addDoc(commentsRef, {
        comment_text: comment.trim(),
        comment_time: serverTimestamp(),
        comment_owner: userData.user_id,
        comment_parent_forum: selectedPost.forum_id,
        comment_replied_text: "textToReply",
        comment_replied_id: "",
        comment_replied_username: "usernameToReply",
        comment_replied_user_id: "userIdToReply",
        comment_replied_by: [],
        comment_id: "",
        comment_image: "",
        comment_has_image: false,
        comment_video: "",
        comment_has_video: false,
        comment_audio: "",
        comment_has_audio: false,
        comment_voice: "",
        comment_has_voice: false,
        comment_visible: true,

        //analytics
        comment_views: 0,
        comment_total_replies: 0,
        comment_likes: [],
        comment_unique_views: [],
        comment_ranking: 100,

        ///poster user data
        comment_poster_full_name: userData.user_full_name,
        comment_poster_user_name: userData.user_full_name,
        comment_poster_image_url: userData.user_image,
      });

      const newDocId = docRef.id;

      const commentUpdateRef = doc(db, "ForumComments", newDocId);
      await updateDoc(commentUpdateRef, {
        comment_id: newDocId,
      });

      const forumUpdateRef = doc(db, "Forums", selectedPost.forum_id);
      await updateDoc(forumUpdateRef, {
        forum_comments_count: increment(1),
        forum_views: increment(1),
      });
    } catch (error) {
      console.error("Error during form submission:", error);

      // setError("Imefeli, jaribu tena!.");
    } finally {
      // setIsSubmitting(false);
      setComment("");
      // fetchUserData(userData.user_id);
      // router.push("/");
    }
  };

  // Function to hide the post by updating the forum_visibility field
  const hidePost = async (forumId) => {
    try {
      const forumRef = doc(db, "Forums", forumId);
      await updateDoc(forumRef, { forum_visible: false });
      console.log("Post hidden:", forumId);

      fetchUserData(userData.user_id);
    } catch (error) {
      console.error("Error hiding post:", error);
    }
  };

  // Function to delete the post from Firestore
  const deletePost = async (forumId) => {
    try {
      const forumRef = doc(db, "Forums", forumId);
      await deleteDoc(forumRef);
      console.log("Post deleted:", forumId);

      fetchUserData(userData.user_id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <ul className="space-y-4">
        {postsData.map((post) => (
          <div
            key={post.forum_id}
            className="border rounded-xl shadow-sm bg-white py-4 sm:py-6"
          >
            <div className="px-4 sm:px-6">
              <div className="flex flex-row space-x-2">
                <div className="flex flex-row space-x-2 border border-slate-300 rounded-lg px-2 py-1.5 w-full">
                  <Image
                    className="h-8 w-8 rounded-md"
                    src={post.forum_poster_image_url}
                    height={200}
                    width={200}
                    alt="user avatar"
                  />
                  <div>
                    <div className="text-small-regular text-gray-500">
                      {post.forum_poster_full_name}
                    </div>
                    <div className="text-tiny-regular text-gray-500">
                      <TimeAgo timestamp={post.forum_posted_time} />
                    </div>
                  </div>
                </div>

                <div className="dropdown dropdown-end h-full aspect-square">
                  <button
                    tabIndex={0}
                    className="border border-slate-300 rounded-lg px-2 py-2"
                    // onClick={submitPost}
                  >
                    <Image
                      className="h-8 w-8"
                      src="/icons/vertical-dots.svg"
                      height={200}
                      width={200}
                      alt="arrow icon"
                    />
                  </button>

                  {/* tabIndex={0} */}
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-white rounded-xl border border-slate-300 mt-2 z-[1] w-52 p-2 shadow-md"
                  >
                    <li>
                      <a onClick={() => hidePost(post.forum_id)}>Hide Post</a>
                    </li>
                    <li>
                      <a onClick={() => deletePost(post.forum_id)}>
                        Delete Post
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <p
                className="mt-2 line-clamp-3 text-small-regular text-gray-500 cursor-pointer"
                onClick={() => openDialog(post)}
              >
                {post.forum_body}
              </p>
            </div>
            <div className="flex flex-row justify-between px-4 sm:px-6 pt-2 text-subtle-regular text-slate-400 tracking-wide">
              <div
                className="flex flex-row items-end cursor-pointer"
                onClick={() => toggleLike(post.forum_id)}
              >
                <Image
                  className="h-4 w-4 rounded-md"
                  src={
                    post.forum_likes.includes(userData.user_id)
                      ? "/icons/liked.svg"
                      : "/icons/unliked.svg"
                  }
                  height={200}
                  width={200}
                  alt="like icon"
                />
                <p className="pl-2">{`${post.forum_likes.length} likes`}</p>
              </div>
              <div className="flex flex-row items-end">
                <Image
                  className="h-4 w-4 rounded-md"
                  src="/icons/comments.svg"
                  height={200}
                  width={200}
                  alt="comments icon"
                />
                <p className="pl-2">{`${post.forum_comments_count} comments`}</p>
              </div>
              <div className="flex flex-row items-end">
                <Image
                  className="h-4 w-4 rounded-md"
                  src="/icons/chart-bar.svg"
                  height={200}
                  width={200}
                  alt="views icon"
                />
                <p className="pl-2">{`${post.forum_views} views`}</p>
              </div>
            </div>
          </div>
        ))}
      </ul>

      {selectedPost && (
        <dialog id="forum_modal" className="modal w-full h-full">
          <div className="modal-box w-full h-full flex flex-col p-4 md:p-5">
            <div className="sticky w-full flex flex-col">
              <div className="flex flex-row justify-between border border-slate-300 rounded-lg px-2 py-1.5">
                <div className="flex flex-row space-x-2">
                  <Image
                    className="h-8 w-8 rounded-md"
                    src={selectedPost.forum_poster_image_url}
                    height={200}
                    width={200}
                    alt="user avatar"
                  />
                  <div>
                    <div className="text-small-regular text-gray-500">
                      {selectedPost.forum_poster_full_name}
                    </div>
                    <div className="text-tiny-regular text-gray-500">
                      <TimeAgo timestamp={selectedPost.forum_posted_time} />
                    </div>
                  </div>
                </div>
                <div
                  className="border border-primary-light rounded-md h-8 w-8 items-center bg-primary-light"
                  onClick={handleClose}
                >
                  <Image
                    className="h-full w-full rounded-md p-2"
                    src="/icons/close.svg"
                    height={200}
                    width={200}
                    alt="close icon"
                  />
                </div>
              </div>
              <p className="mt-2 text-small-regular">
                {selectedPost.forum_body}
              </p>

              {/* interactions */}
              <div className="flex flex-row justify-between pt-3 text-subtle-regular text-slate-400 tracking-wide border-b border-slate-300 pb-2">
                <div
                  className="flex flex-row items-end cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(selectedPost.forum_id);
                  }}
                >
                  <Image
                    className="h-4 w-4 rounded-md"
                    src={
                      selectedPost.forum_likes.includes(userData.user_id)
                        ? "/icons/liked.svg"
                        : "/icons/unliked.svg"
                    }
                    height={200}
                    width={200}
                    alt="like icon"
                  />
                  <p className="pl-2">{`${selectedPost.forum_likes.length} likes`}</p>
                </div>
                <div className="flex flex-row items-end">
                  <Image
                    className="h-4 w-4 rounded-md"
                    src="/icons/comments.svg"
                    height={200}
                    width={200}
                    alt="comments icon"
                  />
                  <p className="pl-2">{`${selectedPost.forum_comments_count} comments`}</p>
                </div>
                <div className="flex flex-row items-end">
                  <Image
                    className="h-4 w-4 rounded-md"
                    src="/icons/chart-bar.svg"
                    height={200}
                    width={200}
                    alt="views icon"
                  />
                  <p className="pl-2">{`${selectedPost.forum_views} views`}</p>
                </div>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto h-full">
              {loading && (
                <div className="flex flex-col justify-center h-full">
                  <RingLoader />
                </div>
              )}
              {!loading && comments.length === 0 && (
                <div className="flex flex-col justify-center h-full">
                  <EmptyState
                    title={"Selection is Empty"}
                    desc={
                      "There is no items in this selection, please add items to this selection or choose another selection. "
                    }
                  />
                </div>
              )}
              {comments.length > 0 && (
                <CommentsList data={comments} userData={userData} />
              )}
            </div>
            <div className="w-full bg-white pt-4 border-t sticky bottom-0">
              <div className="w-full flex flex-row space-x-2 h-10">
                <input
                  type="text"
                  className="w-full border border-slate-300 focus:border-primary-light outline-none py-2 px-4 text-small-regular bg-white rounded-md"
                  placeholder="Type your comment..."
                  value={comment}
                  onChange={handleCommentChange}
                />
                <button
                  type="button"
                  className="bg-primary-light border rounded-lg h-full w-16"
                  onClick={submitPost}
                >
                  <Image
                    className="h-full w-full p-1"
                    src="/icons/send-arrow.svg"
                    height={200}
                    width={200}
                    alt="arrow icon"
                  />
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ForumItems;
