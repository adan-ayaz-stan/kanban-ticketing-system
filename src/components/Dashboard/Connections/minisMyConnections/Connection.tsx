import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useQuery } from "react-query";

export default function Connection({ connectionUserID }) {
    const supabase = useSupabaseClient();
  
    const { isSuccess, data, error } = useQuery(
      "user-data-for-my-received-connections",
      () => supabase.from("users").select("name").eq("id", connectionUserID),
      { staleTime: Infinity, cacheTime: Infinity }
    );
  
    return (
      <div className="relative min-w-[30em] flex flex-row items-center gap-3 p-3 text-white bg-[#3C2A21] rounded">
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
        <div>
          <p>{isSuccess && `${data.data[0].name}`}</p>
        </div>
  
        <div className="ml-auto">
          <button className="px-2 py-1 text-sm font-bold text-gray-800 bg-[#e5e5cb] rounded">
            Start a chat
          </button>
        </div>
      </div>
    );
  }
  