import Heading from "@/components/Layout/Heading";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function IncomingRequests() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [requests, setRequests] = useState([]);

  async function getConnectionRequests() {
    const { data, error } = await supabase
      .from("connections_requests")
      .select("id, users!sender_id(id, name, image)")
      .eq("receiver_id", user.id);

    if (error == null) {
      setRequests(data);
    } else {
      console.log(error);
      window.alert("Error fetching connections");
    }
  }
  useEffect(() => {
    getConnectionRequests();
  }, []);

  async function acceptRequest(request_id: string, sender_id: string) {
    const { error } = await supabase.from("connections").upsert([
      {
        user1_id: sender_id,
        user2_id: user.id,
      },
      {
        user1_id: user.id,
        user2_id: sender_id,
      },
    ]);

    if (error == null) {
      const { error } = await supabase
        .from("connections_requests")
        .delete()
        .eq("id", request_id);

      if (error == null) {
        setRequests((value) => value.filter((e) => e.id != request_id));
      } else {
        window.alert("error while updating");
      }
    } else {
      console.log(error);
      window.alert("error while updating");
    }
  }
  async function rejectRequest(request_id: string) {
    const { error } = await supabase
      .from("connections_requests")
      .delete()
      .eq("id", request_id);

    if (error == null) {
      setRequests((value) => value.filter((e) => e.id != request_id));
    } else {
      window.alert("error while updating");
    }
  }

  return (
    <div>
      <Heading className={"text-xl"}>Connection Requests</Heading>

      <div className="flex flex-row gap-4">
        {requests.map((ele, ind) => {
          return (
            <div
              className="min-w-[200px] flex flex-col items-center p-2 border-2 border-gray-200 bg-gray-50 rounded-lg"
              key={ind + "conn-req"}
            >
              <Image
                src={ele.users.image}
                alt="user-image"
                width={100}
                height={100}
                className="h-20 w-20 rounded-full object-cover"
              />

              <p>{ele.users.name}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    acceptRequest(ele.id, ele.users.id);
                  }}
                  className="p-2 text-sm bg-green-300 hover:bg-green-400 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    rejectRequest(ele.id);
                  }}
                  className="p-2 text-sm bg-red-300 hover:bg-red-400 rounded"
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
