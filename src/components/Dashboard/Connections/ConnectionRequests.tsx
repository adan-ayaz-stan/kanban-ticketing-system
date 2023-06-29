import Image from "next/image";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from "framer-motion";
import { Barlow } from "@next/font/google";

const barlow = Barlow({ subsets: ["latin"], weight: "700" });

export default function ConnectionRequests({ user }) {
  const [processing, setProcessing] = useState(false);

  const supabase = useSupabaseClient();

  const { isLoading, data, error, refetch, isSuccess } = useQuery(
    "connection-requests",
    () =>
      supabase
        .from("connections_requests")
        .select("*, users!sender_id(name, image)")
        .eq("receiver_id", user.id),
    {
      staleTime: 30000,
    }
  );

  async function acceptConnectionRequest(requestID: String, senderID: String) {
    setProcessing(true);

    const connectUserToOther = await supabase.from("connections").insert({
      user1_id: user.id,
      user2_id: senderID,
    });

    const connectOtherToUser = await supabase.from("connections").insert({
      user1_id: senderID,
      user2_id: user.id,
    });

    if (connectUserToOther.error == null && connectOtherToUser.error == null) {
      const { data, error } = await supabase
        .from("connections_requests")
        .delete({ count: "estimated" })
        .eq("id", requestID)
        .select();

      if (error == null) {
        console.log(data);
        console.log("Request successfully accepted.");
        refetch();
      }
    } else {
      console.log(error);
    }
    setProcessing(false);
  }

  async function rejectConnectionRequest(requestID: String) {
    setProcessing(true);
    const { error } = await supabase
      .from("connections_requests")
      .delete()
      .eq("id", requestID);

    if (error == null) {
      console.log("Successfully deleted request.");
    } else {
      console.log(error);
    }
    setProcessing(false);
  }

  return (
    <div className="my-5">
      <h1 style={barlow.style} className="w-fit mx-auto text-3xl">
        Connection Requests
      </h1>

      {isLoading && (
        <motion.p
          initial={{ rotateZ: 0, opacity: 1 }}
          animate={{
            rotateZ: 360,
            opacity: 1,
            transition: {
              type: "keyframes",
              ease: "linear",
              duration: 3,
              repeat: Infinity,
            },
          }}
          exit={{
            rotateZ: 0,
            opacity: 0,
            transition: {
              duration: 0.01,
            },
          }}
          className="w-fit py-3 mx-auto text-4xl"
        >
          <AiOutlineLoading3Quarters />
        </motion.p>
      )}

      <div className="grid grid-cols-12 auto-rows-auto p-3">
        {isSuccess &&
          data.data.map((ele, ind) => {
            return (
              <div
                key={ind * Math.random()}
                className="relative flex flex-row items-center gap-3 p-3 text-gray-800 bg-white rounded-xl border-gray-300 border-2"
              >
                <div className="relative h-20 w-20">
                  <Image
                    src={ele.users.image}
                    alt="connection-profile"
                    fill={true}
                    className="rounded-full object-cover"
                  />
                </div>
                {/*  */}
                <div>
                  <p>{ele.users.name}</p>
                </div>
                {/*  */}
                <div className="ml-auto flex flex-row gap-3">
                  <button
                    onClick={() => {
                      acceptConnectionRequest(ele.id, ele.sender_id);
                    }}
                    disabled={processing}
                    className="px-2 py-1 text-sm font-bold text-gray-800 bg-[#e5e5cb] rounded hover:brightness-[80%] disabled:bg-gray-500"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      rejectConnectionRequest(ele.id);
                    }}
                    disabled={processing}
                    className="px-2 py-1 text-sm font-bold text-gray-800 bg-[#e5e5cb] rounded hover:brightness-[80%] disabled:bg-gray-500"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}

        {isSuccess && data.data.length == 0 ? (
          <div className="col-span-12">
            <p className="w-full text-center text-sm text-gray-600">
              Any connection requests people send to you will appear here.
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
