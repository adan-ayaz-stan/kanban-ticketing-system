import { Barlow } from "@next/font/google";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";
import Connection from "./minisMyConnections/Connection";

const barlow = Barlow({ subsets: ["latin"], weight: "700" });

export default function MyConnections({ user }) {
  const supabase = useSupabaseClient();

  const { isSuccess, data, error, refetch } = useQuery(
    "my-received-connections",
    () =>
      supabase
        .from("connections")
        .select(`*`)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`),
    {
      staleTime: 1000,
      cacheTime: 1000,
    }
  );

  return (
    <div className="px-4 py-3 text-sm">
      <h1 style={barlow.style} className="w-fit mx-auto text-3xl">
        My connections
      </h1>

      <div className="flex flex-row flex-wrap gap-3 auto-rows-auto p-3">
        {/* Sample Connection */}

        {isSuccess &&
          data.data != null &&
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

        {isSuccess && data.data != null && data.data.length == 0 ? (
          <div className="w-full text-center text-gray-600">
            It seems like you havent't made any connections yet. Search people
            now to make new connections.
          </div>
        ) : (
          ""
        )}

        {error && <p>An error has occurred while fetching the resource.</p>}
      </div>
    </div>
  );
}
