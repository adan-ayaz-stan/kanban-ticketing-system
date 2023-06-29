import { Barlow } from "@next/font/google";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";
import Connection from "./minisMyConnections/Connection";
import { User } from "@/types/types";
import { Database } from "@/types/supabase";

const barlow = Barlow({ subsets: ["latin"], weight: "700" });

export default function MyConnections({ user }: { user: User }) {
  const supabase = useSupabaseClient<Database>();

  const { isSuccess, data, error, refetch } = useQuery(
    "my-received-connections",
    () =>
      supabase
        .from("connections")
        .select("*, users!user2_id(name, image)")
        .eq(`user1_id`, user.id),
    {
      staleTime: 60000,
      cacheTime: 60000,
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
            const user = {
              id: ele.user2_id,
              name: ele.users.name,
              image: ele.users.image,
            };
            return <Connection user={user} key={ind * Math.random() + 124} />;
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
