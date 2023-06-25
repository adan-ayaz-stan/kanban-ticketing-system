import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function Account({ user }) {
  const username = user.user_metadata.name;
  const supabase = useSupabaseClient();

  const [imageLink, setImageLink] = useState("");

  async function getProfileImage() {
    const { data, error } = await supabase
      .from("users")
      .select("image")
      .eq("id", user.id);

    if (error == null) {
      console.log("got link", data[0].image);
      setImageLink(data[0].image);
    }
  }

  useEffect(() => {
    getProfileImage();
  }, []);

  return (
    <>
      <div className="w-fit px-12 bg-gray-900 rounded-lg shadow">
        <div className="flex flex-col items-center py-10">
          {imageLink == "" ? (
            <div
              className={`h-28 w-28 rounded-full border-2 bg-[url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.0pVwpLhb1hwpINZ07iODeQHaFj%26pid%3DApi&f=1&ipt=611caa4d3daebe0f8ab5144b4dbe210bd3c9492a2c67c1bee98e8acc46215778&ipo=images')] bg-cover bg-center`}
            />
          ) : (
            <img
              src={imageLink}
              alt="profile-image"
              width={200}
              height={200}
              style={{
                width: "125px",
                height: "125px",
              }}
              className="flex rounded-full object-cover"
            />
          )}

          <h5 className="mb-1 text-xl font-medium text-gray-100">{username}</h5>
          <div className="flex mt-4 space-x-3 md:mt-6">
            <Link
              href="/dashboard/projects"
              className="text-gray-900 bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
            >
              To Projects
            </Link>
            <Link
              href="/dashboard/connections"
              className="text-gray-900 bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
            >
              To Connections
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
