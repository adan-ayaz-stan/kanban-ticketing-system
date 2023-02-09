import { Barlow } from "@next/font/google";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useQuery } from "react-query";

const barlow = Barlow({ subsets: ["latin"], weight: "500" });

export default function Connection({
  connectionUserID,
}: {
  connectionUserID: string;
}) {
  const supabase = useSupabaseClient();

  const {
    isSuccess,
    data,
    error,
  }: { data: { data: [] }; isSuccess: boolean; error: object } = useQuery(
    `user-data-for-${connectionUserID}-my-connections`,
    () => supabase.from("users").select("name").eq("id", connectionUserID),
    { staleTime: Infinity, cacheTime: Infinity }
  );

  return (
    <div className="relative flex flex-row items-center gap-3 p-3 text-gray-800 bg-white rounded-xl border-gray-300 border-2">
      <div className="relative h-14 w-16 sm:h-20 sm:w-20">
        <Image
          src={
            "https://images.pexels.com/photos/14208349/pexels-photo-14208349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          }
          alt="connection-profile"
          fill={true}
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <p style={barlow.style} className=" sm:text-lg">
          {isSuccess && `${data.data[0].name}`}
        </p>
      </div>

      <div className="ml-auto">
        <button className="px-2 py-1 text-sm font-bold text-gray-800 bg-[#FFF2F2] rounded">
          Start a chat
        </button>
      </div>
    </div>
  );
}
