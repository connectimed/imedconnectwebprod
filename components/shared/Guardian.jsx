import React from "react";
import RingLoader from "@/components/shared/RingLoader";
import VerifyPhoneNumber from "../shared/VerifyPhoneNumber";
import PendingAccount from "../shared/PendingAccount";
import { usePathname } from "next/navigation";
import AccountDecider from "./AccountDecider";
import StudentStepTwo from "../student/StudentStepTwo";
import StudentStepThree from "../student/StudentStepThree";
import StudentStepFour from "../student/StudentStepFour";
import MentorStepTwo from "../mentor/MentorStepTwo";
import MentorStepThree from "../mentor/MentorStepThree";
import MentorStepFour from "../mentor/MentorStepFour";
import MentorStepFive from "../mentor/MentorStepFive";
import StudentStepFive from "../student/StudentStepFive";
import EmploymentReadiness from "../student/EmploymentReadiness";
import Employability from "../student/Employability";
import StudentMentorEvaluation from "../student/evaluation/StudentMentorEvaluation";
import BaselineEmployability from "../student/BaselineEmployability";

export const Guardian = (userData, firebaseUser, fireLoaded) => {
  const pathname = usePathname();
  if (!fireLoaded || !firebaseUser) {
    return (
      <div className="flex flex-col justify-center h-full">
        <RingLoader />
      </div>
    );
  }

  if (!userData && firebaseUser) {
    return <PendingAccount />;
  }

  if (userData && firebaseUser && !userData.user_phone_verified) {
    return <VerifyPhoneNumber userData={userData} />;
  }
  if (userData && firebaseUser && userData.user_profile_setup_step == "1") {
    return <AccountDecider userData={userData} />;
  }

  //  Step two
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Student" &&
    userData.user_profile_setup_step == "2"
  ) {
    return <StudentStepTwo userData={userData} />;
  }
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Mentor" &&
    userData.user_profile_setup_step == "2"
  ) {
    return <MentorStepTwo userData={userData} />;
  }

  //  Step three
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Student" &&
    userData.user_profile_setup_step == "3"
  ) {
    return <StudentStepThree userData={userData} />;
  }
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Mentor" &&
    userData.user_profile_setup_step == "3"
  ) {
    return <MentorStepThree userData={userData} />;
  }

  //  Step four
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Student" &&
    userData.user_profile_setup_step == "4"
  ) {
    return <StudentStepFour userData={userData} />;
  }
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Mentor" &&
    userData.user_profile_setup_step == "4"
  ) {
    return <MentorStepFour userData={userData} />;
  }

  //  Step five
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Student" &&
    userData.user_profile_setup_step == "5"
  ) {
    return <StudentStepFive userData={userData} />;
  }
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Mentor" &&
    userData.user_profile_setup_step == "5"
  ) {
    return <MentorStepFive userData={userData} />;
  }

  //  Step six
  if (userData && firebaseUser && userData.user_profile_setup_step == "6") {
    return <PendingAccount userData={userData} />;
  }

  //  Step seven
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Student" &&
    userData.user_profile_setup_step == "7"
  ) {
    // return <Employability userData={userData} />;
    return <BaselineEmployability userData={userData} />;
  }

  //  Step eight
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Student" &&
    userData.user_profile_setup_step == "8"
  ) {
    return <PendingAccount userData={userData} />;
  }

  //  Step zero trashed
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Student" &&
    userData.user_profile_setup_step == "0"
  ) {
    return <PendingAccount userData={userData} />;
  }

  // //  Step nine Baseline
  // if (
  //   userData &&
  //   firebaseUser &&
  //   userData.user_type == "Student" &&
  //   userData.user_profile_setup_step == "9"
  // ) {
  //   return <EmploymentReadiness userData={userData} />;
  // }

  //  Step eleven evaluation
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Student" &&
    userData.user_profile_setup_step == "11"
  ) {
    return <StudentMentorEvaluation userData={userData} />;
  }
  if (
    userData &&
    firebaseUser &&
    userData.user_type == "Mentor" &&
    userData.user_profile_setup_step == "11"
  ) {
    return <MentorStepFour userData={userData} />;
  }

  return null;
};
