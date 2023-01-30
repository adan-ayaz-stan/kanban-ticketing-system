import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useQuery } from "react-query";
import Connection from "./minisMyConnections/Connection";

export default function MyConnections({ user }) {
  const supabase = useSupabaseClient();

  const { isSuccess, data, error, refetch } = useQuery(
    "my-received-connections",
    () =>
      supabase
        .from("connections")
        .select()
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`),
    {
      staleTime: 12000,
      cacheTime: 12000,
    }
  );

  return (
    <div className="px-4 py-3 text-sm">
      <h1 className="w-fit mx-auto text-4xl uppercase border-b-2 border-gray-700">
        My connections
      </h1>

      <div className="flex flex-row flex-wrap gap-3 auto-rows-auto p-3">
        {/* Sample Connection */}

        {isSuccess &&
          data.data.map((ele, ind) => {
            if (ele.user1_id == user.id) {
              return (
                <Connection
                  connectionUserID={ele.user2_id}
                  key={ind * Math.random() + 124}
                />
              );
            } else if (ele.user2_id == user.id) {
              return (
                <Connection
                  connectionUserID={ele.user1_id}
                  key={ind * Math.random() + 124}
                />
              );
            }
          })}
      </div>
    </div>
  );
}
