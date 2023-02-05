import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "react-query";

export default function Account({ session }) {
  const supabase = useSupabaseClient();

  const { isLoading, data, error, isSuccess } = useQuery(
    "user-data-for-dashboard",
    () =>
      supabase.from("users").select("email, name").eq("id", session.user.id),
    {
      staleTime: 6000,
      cacheTime: 6000,
    }
  );

  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        {isSuccess && (
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
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {data.data[0].name}
            </h5>
            <span className="max-w-[10em] text-sm text-gray-500 dark:text-gray-400 truncate">
              {`${session.user.id}`
                .replace("-", "27as248d")
                .replace("-", "7sc6wcv")}
            </span>
            <div className="flex mt-4 space-x-3 md:mt-6">
              <Link
                href="/dashboard/projects"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                To Projects
              </Link>
              <Link
                href="/dashboard/connections"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
              >
                To Connections
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
