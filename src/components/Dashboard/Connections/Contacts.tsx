import { useState } from "react";

import Heading from "@/components/Layout/Heading";
import PersonalChats from "./Contacts__Children/PersonalChats";

import { VscBellDot } from "react-icons/vsc";
import { BsPersonFillAdd } from "react-icons/bs";
import { BiSolidChat } from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";
import { HiGlobe } from "react-icons/hi";
import GroupChats from "./Contacts__Children/GroupChats";
import Requests from "./Contacts__Children/Requests";
import Settings from "./Contacts__Children/Settings";
import Link from "next/link";

export default function Contacts() {
  // 4 categories : 'personal', 'groups', 'requests', 'settings'
  const [categoryOpen, setCategoryOpen] = useState("personal");

  return (
    <div className="min-w-[250px] w-[35%] flex flex-col bg-white pr-6">
      {/* Content in flex-col */}
      <div className="flex justify-between items-center">
        <Heading
          className={
            "w-fit pt-3 text-xl text-center font-medium uppercase mb-4"
          }
        >
          CHATBOX{" "}
        </Heading>

        <VscBellDot
          size={42}
          className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
        />
      </div>

      <Link href={"/dashboard"} className="text-center underline mb-4">
        Go to dashboard
      </Link>

      <div className="px-2 py-1 text-center font-semibold uppercase tracking-[5px] bg-gray-200 rounded">
        {categoryOpen}
      </div>
      {/* Navigation */}
      <div className="flex flex-row justify-evenly items-center py-3">
        <BiSolidChat
          onClick={() => setCategoryOpen("personal")}
          size={50}
          style={categoryOpen == "personal" && { background: "#ca97d4" }}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all"
        />
        <HiGlobe
          onClick={() => setCategoryOpen("groups")}
          size={50}
          style={categoryOpen == "groups" && { background: "#ca97d4" }}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all"
        />
        <BsPersonFillAdd
          onClick={() => setCategoryOpen("requests")}
          size={50}
          style={categoryOpen == "requests" && { background: "#ca97d4" }}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all"
        />
        <IoIosSettings
          onClick={() => setCategoryOpen("settings")}
          size={50}
          style={categoryOpen == "settings" && { background: "#ca97d4" }}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all"
        />
      </div>

      {/* The contacts box */}
      <div className="h-full overflow-y-auto">
        {categoryOpen == "personal" && <PersonalChats />}
        {categoryOpen == "groups" && <GroupChats />}
        {categoryOpen == "requests" && <Requests />}
        {categoryOpen == "settings" && <Settings />}
      </div>
    </div>
  );
}

function SvgSpinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
    >
      <ellipse cx="12" cy="5" fill="currentColor" rx="4" ry="4">
        <animate
          id="svgSpinnersBouncingBall0"
          fill="freeze"
          attributeName="cy"
          begin="0;svgSpinnersBouncingBall2.end"
          calcMode="spline"
          dur="0.375s"
          keySplines=".33,0,.66,.33"
          values="5;20"
        />
        <animate
          attributeName="rx"
          begin="svgSpinnersBouncingBall0.end"
          calcMode="spline"
          dur="0.05s"
          keySplines=".33,0,.66,.33;.33,.66,.66,1"
          values="4;4.8;4"
        />
        <animate
          attributeName="ry"
          begin="svgSpinnersBouncingBall0.end"
          calcMode="spline"
          dur="0.05s"
          keySplines=".33,0,.66,.33;.33,.66,.66,1"
          values="4;3;4"
        />
        <animate
          id="svgSpinnersBouncingBall1"
          attributeName="cy"
          begin="svgSpinnersBouncingBall0.end"
          calcMode="spline"
          dur="0.025s"
          keySplines=".33,0,.66,.33"
          values="20;20.5"
        />
        <animate
          id="svgSpinnersBouncingBall2"
          attributeName="cy"
          begin="svgSpinnersBouncingBall1.end"
          calcMode="spline"
          dur="0.4s"
          keySplines=".33,.66,.66,1"
          values="20.5;5"
        />
      </ellipse>
    </svg>
  );
}
