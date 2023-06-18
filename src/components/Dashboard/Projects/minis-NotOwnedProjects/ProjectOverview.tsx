import { Barlow } from "@next/font/google";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useQuery } from "react-query";

const barlow = Barlow({ subsets: ["latin"], weight: "600" });

export default function ProjectOverview({ projectID, user }) {
  const supabase = useSupabaseClient();

  const { isLoading, data, error, isSuccess } = useQuery(
    `${projectID}-not-owned-overview`,
    () =>
      supabase
        .from("projects")
        .select("project_id, name, ownership")
        .eq("project_id", `${projectID}`)
        .neq("ownership", user.id),
    {
      staleTime: 12000,
      cacheTime: 12000,
    }
  );

  console.log(data);

  return (
    <>
      {isSuccess && data.data[0] != null && (
        <Link
          href={`/dashboard/project/${data.data[0].project_id}`}
          className="flex flex-col gap-3 text-black p-4 border-gray-300 border-2 border-l-blue-500 border-l-4 rounded-lg"
        >
          {/* Project heading */}
          <div className="flex flex-row justify-between items-center">
            <h1 style={barlow.style} className="text-xl font-bold text-black">
              {data.data[0].name}
            </h1>
            <p className="h-fit px-2 text-sm text-[#1A120B] font-bold bg-gray-200 rounded">
              {/* {data[0].created_at} */}
            </p>
          </div>
        </Link>
      )}
    </>
  );
}
