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

  return (
    <>
      {isSuccess && data.data[0] != null && (
        <Link
          href={`/dashboard/project/${data.data[0].project_id}`}
          className="flex flex-col gap-3 text-white p-4 bg-[#7286d3] rounded-lg"
        >
          {/* Project heading */}
          <div className="flex flex-row justify-between items-center">
            <h1 style={barlow.style} className="text-xl font-bold text-white">
              {data.data[0].name}
            </h1>
            <p className="h-fit px-2 text-sm text-[#1A120B] font-bold bg-gray-200 rounded">
              {/* {data[0].created_at} */}
            </p>
          </div>
        </Link>
      )}

      {isSuccess && data.data.length == 0 ? (
        <p className="text-center text-gray-700">
          Projects others have added you to will appear here.
        </p>
      ) : (
        ""
      )}
    </>
  );
}
