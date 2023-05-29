import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useQuery } from "react-query";

type componentProp = {
  projectData: {
    project_id: number;
    created_at: String;
    name: String;
    ownership: String;
  };
};

export default function ProjectOverview({ projectData }: componentProp) {
  const supabase = useSupabaseClient();

  const { isLoading, data, error, refetch } = useQuery(
    `project-overview-${projectData.project_id}`,
    () =>
      supabase
        .from("project_members")
        .select("user_id")
        .eq("project_id", projectData.project_id),
    {
      staleTime: 12000,
      cacheTime: 12000,
    }
  );

  return (
    <Link
      href={`/dashboard/project/${projectData.project_id}`}
      className="flex flex-col gap-3 text-white p-4 border-gray-300 border-2 border-l-gray-900 border-l-4 rounded-lg bg-white"
    >
      {/* Project heading */}
      <div className="flex flex-row gap-2 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 truncate">
          {projectData.name}
        </h1>
        <p className="h-fit px-2 text-sm text-[#1A120B] font-bold bg-gray-200 rounded">
          {projectData.created_at}
        </p>
      </div>
      {/* Project Main Information */}
      <div className="flex flex-col gap-3">
        <p className="text-sm">
          <span className="text-gray-700">Total Participants:</span>{" "}
          <span className="h-fit px-2 text-sm text-[#1A120B] font-bold bg-gray-200 rounded">
            {data && data.data.length}
          </span>
        </p>
      </div>
    </Link>
  );
}
