import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "react-query";

export default function Account({ user }) {
  const username = user.user_metadata.name;

  return (
    <>
      <div className="w-full bg-gray-900 rounded-lg shadow">
        {
          <div className="flex flex-col items-center py-10">
            <Image
              className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover"
              src={
                "https://images.pexels.com/photos/91224/pexels-photo-91224.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
              alt="Bonnie image"
              height={200}
              width={200}
            />
            <h5 className="mb-1 text-xl font-medium text-gray-100">
              {username}
            </h5>
            <span className="max-w-[10em] text-sm text-gray-900 dark:text-gray-400 truncate">
              {`${user.id}`.replace("-", "27as248d").replace("-", "7sc6wcv")}
            </span>
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
        }
      </div>
    </>
  );
}
