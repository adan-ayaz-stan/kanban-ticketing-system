import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";
import ProjectOverview from "./minis-NotOwnedProjects/ProjectOverview";

export default function NotOwnedProjects({ user }) {
  const supabase = useSupabaseClient();

  const { isLoading, data, error, isSuccess } = useQuery(
    "all-projects-user-is-part-of",
    () =>
      supabase
        .from("project_members")
        .select("id, project_id, projects!inner (ownership)")
        .eq("user_id", user.id)
        .filter("projects.ownership", "not.eq", user.id),
    {
      staleTime: 5000,
      cacheTime: 5000,
    }
  );

  return (
    <div className="m-2 p-2 rounded-xl shadow-xl backdrop-blur-lg bg-[#ffffff55]">
      <h1 className="p-2 mb-2 text-center rounded-t-xl rounded-b-md text-red-700 bg-white text-xl font-bold uppercase">
        Projects You're a Member of
      </h1>

      {isSuccess && data.data != null && (
        <div className="grid grid-cols-1 auto-rows-auto gap-3">
          {data.data.map((ele, ind) => {
            return (
              <ProjectOverview
                projectID={ele.project_id}
                user={user}
                key={ele.id}
              />
            );
          })}
        </div>
      )}

      {isSuccess && data.data.length == 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 p-4 text-center text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="42"
            viewBox="0 0 15 16"
          >
            <path
              fill-rule="evenodd"
              d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z"
              fill="currentColor"
            />
          </svg>

          <p>Projects others have added you to will appear here.</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
