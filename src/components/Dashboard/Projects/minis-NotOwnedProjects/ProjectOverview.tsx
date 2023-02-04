import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useQuery } from "react-query";

export default function ProjectOverview({ projectID, user }) {
  const supabase = useSupabaseClient();

  const { isLoading, data, error, isSuccess } = useQuery(
    `${projectID}-not-owned-overview`,
    () =>
      supabase
        .from("projects")
        .select("name, created_at, project_id")
        .filter(`project_id.eq.${projectID}, ownership.neq.${user.id}`),
    {
      staleTime: 5000,
      cacheTime: 5000,
    }
  );

  console.log(data);

  return (
    <>
      {isSuccess && data.data != null && (
        <Link
          href={`/dashboard/project/${data.data[0].project_id}`}
          className="flex flex-col gap-3 text-white p-4 bg-[#3C2A21] rounded-lg"
        >
          {/* Project heading */}
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              {data.data[0].name}
            </h1>
            <p className="h-fit px-2 text-sm text-[#1A120B] font-bold bg-gray-200 rounded">
              {/* {data[0].created_at} */}
            </p>
          </div>
          {/* Project Main Information */}
          {/* <div className="flex flex-col gap-3">
            <p className="text-sm">
              <span>Total Participants:</span>{" "}
              <span className="h-fit px-2 text-sm text-[#1A120B] font-bold bg-gray-200 rounded">
                {data && data.data.length}
              </span>
            </p>
          </div> */}
        </Link>
      )}
    </>
  );
}
