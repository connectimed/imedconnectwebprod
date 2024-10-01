import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { UserAuth } from "@/lib/contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { user } = UserAuth();

  useEffect(() => {
    if (!user.uid) {
      router.push("/signin");
    }
  }, [router, user]);

  return <div>{user ? children : null}</div>;
};

export default ProtectedRoute;
