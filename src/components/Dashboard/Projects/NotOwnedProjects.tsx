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
        .select("id, project_id")
        .eq("user_id", user.id),
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

      {isSuccess &&
        data.data.map((ele, ind) => {
          return (
            <ProjectOverview
              projectID={ele.project_id}
              user={user}
              key={ele.id}
            />
          );
        })}

      {isSuccess && data.data.length == 0 ? (
        <p className="text-center text-gray-700">
          Projects others have added you to will appear here.
        </p>
      ) : (
        ""
      )}
    </div>
  );
}
