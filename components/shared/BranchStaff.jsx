import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import RingLoader from "./RingLoader";
import CustomerCard from "../xcustomers/CustomerCard";
import Image from "next/image";

const CustomerCardList = ({ data, userData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {data.map((post) => (
        <div>
          <div className="col-span-1 rounded-lg bg-white border border-slate-200">
            <div className="flex w-full items-center justify-between space-x-6 px-4 py-3">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <div className="truncate text-base-regular font-bold text-gray-900">
                    {post.user_full_name}
                  </div>
                  <span className="inline-flex flex-shrink-0 rounded-full bg-green-50 px-2.5 py-0.5 text-tiny-regular text-success-1 ring-1 ring-inset ring-green-600/20">
                    {post.user_depot_branch_role}
                  </span>
                </div>
                <p className=" text-small-regular mt-1">
                  {post.user_phone.replace(/^0/, "+255")}
                </p>
              </div>
              <Image
                className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-300 border-2 border-amber-200 object-cover"
                src={post.user_image}
                alt=""
                height={500}
                width={500}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const BranchStaff = ({ branchData }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStaff = async () => {
    const dbInstance = collection(db, "Users");
    const q1 = query(
      dbInstance,
      where("user_depot_branch", "==", branchData.branch_id)
    );
    setLoading(true);
    try {
      const data = await getDocs(q1);

      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));

      setUsers(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false); // Set loading state after the query completes (whether success or error)
    }
  };

  useEffect(() => {
    getStaff();
  }, []);

  return (
    <div className="">
      {loading ? <RingLoader /> : <CustomerCardList data={users} />}
    </div>
  );
};

export default BranchStaff;
