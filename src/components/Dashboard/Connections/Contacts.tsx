import Heading from "@/components/Layout/Heading";

import { VscBellDot } from "react-icons/vsc";
import { BsPersonFillAdd } from "react-icons/bs";
import { BiSolidChat } from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";
import { HiGlobe } from "react-icons/hi";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Contacts() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [contacts, setContacts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function getContacts() {
    const { data, error } = await supabase
      .from("connections")
      .select("*, users!user1_id(name, image)")
      .eq("user2_id", user.id);

    if (error == null) {
      setLoading(false);
      setContacts(data);
    }
  }

  useEffect(() => {
    getContacts();
  }, []);

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

      {/* Navigation */}
      <div className="flex flex-row justify-evenly items-center py-3">
        <BiSolidChat
          size={50}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
        />
        <HiGlobe
          size={50}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
        />
        <BsPersonFillAdd
          size={50}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
        />
        <IoIosSettings
          size={50}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
        />
      </div>

      {/* Search Bar */}
      <div className="flex flex-row">
        <input
          placeholder="Search the chat..."
          type="text"
          name="text"
          className="w-full mx-5 my-2 h-15 p-2 rounded-12 border-1-5 outline-none transition border-2 rounded-md focus:border-gray-700"
        />
      </div>

      {/* The contacts box */}
      <div className="h-full overflow-y-auto">
        {isLoading && (
          <div className="w-fit mx-auto text-gray-400 rotate-180">
            <SvgSpinner />
          </div>
        )}

        {isLoading ||
          contacts.map((ele, ind) => {
            return (
              <div
                key={ele.id}
                className="flex p-2 gap-2 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                <Image
                  src={ele.users.image}
                  width={100}
                  height={100}
                  alt="profile-image"
                  className="border-2 h-14 w-14 rounded-lg"
                />

                <div className="flex flex-col justify-center">
                  <p className="text-sm">{ele.users.name}</p>
                </div>
              </div>
            );
          })}
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
