import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useQuery } from "react-query";
import MyReceivedConnections from "./minisMyConnections/myReceivedConnections";
import MySentConnections from "./minisMyConnections/mySentConnections";

export default function MyConnections({ user }) {
  return (
    <div className="px-4 py-3 text-sm">
      <h1 className="w-fit mx-auto text-4xl uppercase border-b-2 border-gray-700">
        My connections
      </h1>

      <div className="grid grid-cols-9 auto-rows-auto p-3">
        {/* Sample Connection */}
        <MyReceivedConnections user={user} />
        <MySentConnections user={user} />
      </div>
    </div>
  );
}
