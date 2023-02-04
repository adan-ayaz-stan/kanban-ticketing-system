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
      supabase.from("connections_requests").select().eq("receiver_id", user.id),
    {
      staleTime: 30000,
    }
  );

  async function acceptConnectionRequest(
    requestID: String,
    senderID: String,
    senderName: String
  ) {
    setProcessing(true);

    const user1DataFromUsers = await supabase
      .from("users")
      .select("name")
      .eq("id", user.id);
    const user2DataFromUsers = await supabase
      .from("users")
      .select("name")
      .eq("id", senderID);

    const { error } = await supabase.from("connections").insert({
      user1_id: user.id,
      user2_id: senderID,
      user1_name: user1DataFromUsers.data[0].name,
      user2_name: user2DataFromUsers.data[0].name,
    });

    if (error == null) {
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
      <h1
        style={barlow.style}
        className="w-fit mx-auto text-3xl"
      >
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
                className="relative min-w-[20em] col-span-12 sm:col-span-9 md:col-span-6 lg:col-span-4 flex flex-row items-center gap-3 p-3 text-sm text-white bg-[#3C2A21] rounded"
              >
                <div className="relative h-20 w-20">
                  <Image
                    src={
                      "https://images.pexels.com/photos/14208349/pexels-photo-14208349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    }
                    alt="connection-profile"
                    fill={true}
                    className="rounded-full object-cover"
                  />
                </div>
                {/*  */}
                <div>
                  <p>{ele.sender_name}</p>
                </div>
                {/*  */}
                <div className="ml-auto flex flex-row gap-3">
                  <button
                    onClick={() => {
                      acceptConnectionRequest(
                        ele.id,
                        ele.sender_id,
                        ele.sender_name
                      );
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
      </div>
    </div>
  );
}
