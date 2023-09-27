import Heading from "@/components/Layout/Heading";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SearchConnections() {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [connections, setConnections] = useState([]);

  async function getConnections() {
    const { data, error } = await supabase
      .from("connections")
      .select("users!user2_id(name, image)")
      .eq("user1_id", user.id);
    if (error == null) {
      console.log(data);
      setConnections(data);
    }
  }

  useEffect(() => {
    getConnections();
  }, []);

  return (
    <>
      <Heading className={"text-xl"}>My connections</Heading>

      <input
        name="search"
        autoComplete="off"
        placeholder="Search users across the connections.."
        className="w-full my-2 h-15 p-2 rounded-12 border-1-5 outline-none transition border-2 rounded-md focus:border-gray-700"
      />

      <div className="flex flex-row gap-2 p-4">
        {connections.map((ele, ind) => {
          return (
            <div
              key={ind + "conns"}
              className="p-2 px-6 bg-gray-50 border-2 border-gray-100 rounded-lg"
            >
              <Image
                src={ele.users.image}
                alt="user-profile-image"
                className="h-20 w-20 rounded-full object-cover"
                width={100}
                height={100}
              />
              <p className="mt-2 text-sm">{ele.users.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
