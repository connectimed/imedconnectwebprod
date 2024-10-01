"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";
import { useRouter, usePathname, redirect } from "next/navigation";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [firebaseUser, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [fireLoaded, setFireLoaded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const passwordSignIn = async (phoneNumber, password) => {
    const email = `255${phoneNumber}@gmail.com`;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("firebase user:", user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error: ", errorMessage);
      });
  };

  const fetchUserData = async (uid) => {
    const userDoc = doc(collection(db, "Users"), uid);
    const docSnapshot = await getDoc(userDoc);
    if (docSnapshot.exists()) {
      setUserData(docSnapshot.data());
      recordUserData(uid);
      setFireLoaded(true);

      console.log("document exists!");
    } else {
      console.log("No such document!");
      setFireLoaded(true);
    }

    //calculate progress
    const userRef = doc(db, "Users", uid);
    // console.log("updated last interaction");
    await updateDoc(userRef, {
      user_learning_progress:
        (docSnapshot.data().user_modules_completed +
          docSnapshot.data().user_exams_completed) /
        docSnapshot.data().user_modules.length,
    });
  };

  const recordUserData = async (uid) => {
    const userRef = doc(db, "Users", uid);
    // console.log("updated last interaction");
    await updateDoc(userRef, {
      user_last_interaction: serverTimestamp(),
    });
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setUserData(null);
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  useEffect(() => {
    const isItLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    setIsLocalhost(isItLocal);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // This function will be called whenever the authentication state changes
      if (user) {
        // User is signed in
        // if (pathname === "/register") {
        //   router.push("/");
        // }
        setUser(user);
        fetchUserData(user.uid);
        // console.log("firebase user:", user);
      } else {
        // User is signed out
        setFireLoaded(true);
        setUser(null);
        console.log("firebase user is out:");
        if (
          pathname !== "/terms" &&
          pathname !== "/privacy" &&
          pathname !== "/register" &&
          pathname !== "/sign-in" &&
          pathname !== "/reset" &&
          pathname !== "/action"
        ) {
          router.push("/sign-in");
        }
      }
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        passwordSignIn,
        firebaseUser,
        userData,
        fireLoaded,
        fetchUserData,
        isLocalhost,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }
  return context;
};
