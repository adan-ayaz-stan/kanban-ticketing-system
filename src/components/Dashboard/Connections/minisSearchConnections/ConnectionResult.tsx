import { User } from "@/types/types";
import { SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useState } from "react";

type ConnectionResultProps = {
  processing: boolean;
  setProcessing(arg0: boolean): boolean;
  userSearchResult: { name: string; email: string; id: string; image: string };
  user: User;
  supabase: SupabaseClient;
};

export default function ConnectionResult({
  processing,
  setProcessing,
  userSearchResult,
  user,
  supabase,
}: ConnectionResultProps) {
  const [requestExists, setRequestExists] = useState(false);

  // Send Connection request function handler
  async function sendConnectionRequest(receiverID: String, event: Object) {
    setProcessing(true);
    const checkIfRequestExists = await supabase
      .from("connections_requests")
      .select("*")
      .eq("sender_id", user.id)
      .eq("receiver_id", receiverID)
      .limit(1);
    //
    if (checkIfRequestExists.data.length == 0) {
      const { error } = await supabase.from("connections_requests").upsert({
        sender_id: user.id,
        receiver_id: receiverID,
      });
    } else {
      setRequestExists(true);
    }

    console.log(checkIfRequestExists);
    setProcessing(false);
  }

  return (
    <div className="relative col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col items-center gap-3 p-3 m-2 text-gray-800 bg-white rounded border-2 border-gray-300">
      <div className="relative h-20 w-20">
        <Image
          src={userSearchResult.image}
          alt="connection-profile"
          fill={true}
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <p className="font-bold text-center text-[12px]">
          {userSearchResult.name}
        </p>
        <p className="text-[12px] font-sans">{userSearchResult.email}</p>
      </div>

      <div className="">
        {userSearchResult.email == user.email ? (
          <p>You</p>
        ) : (
          <>
            {requestExists ? (
              <button className="px-2 py-1 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded font-mono">
                Request already exists
              </button>
            ) : (
              <button
                onClick={(e) => {
                  sendConnectionRequest(userSearchResult.id, e);
                }}
                className="px-2 py-1 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded font-mono"
                disabled={processing ? true : false}
                style={{
                  background: processing ? "gray" : "",
                }}
              >
                Add Connection
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
