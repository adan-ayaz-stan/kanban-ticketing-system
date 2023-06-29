import { Database } from "@/types/supabase";
import { Barlow } from "@next/font/google";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const barlow = Barlow({ subsets: ["latin"], weight: "500" });

export default function Connection({
  user,
}: {
  user: { id: string; name: string; image: string };
}) {
  const supabase = useSupabaseClient<Database>();

  return (
    <div className="relative flex flex-row items-center gap-3 p-3 text-gray-800 bg-white rounded-xl border-gray-300 border-2">
      <div className="relative h-14 w-16 sm:h-20 sm:w-20">
        <Image
          src={user.image}
          alt="connection-profile"
          fill={true}
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <p style={barlow.style} className=" sm:text-lg">
          {user.name}
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
