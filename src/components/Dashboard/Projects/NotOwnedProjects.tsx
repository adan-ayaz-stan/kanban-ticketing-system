import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";
import ProjectOverview from "./minis-NotOwnedProjects/ProjectOverview";

export default function NotOwnedProjects({ user }) {
  const supabase = useSupabaseClient();

  const { isLoading, data, error } = useQuery(
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
    <div className="m-2 p-2 border-2 border-blue-500 rounded-xl">
      <h1 className="p-2 mb-2 text-center rounded-t-xl rounded-b-md text-red-700 bg-white text-xl font-bold uppercase">
        Active Projects ( Not Owned )
      </h1>

      {data &&
        data.data.map((ele, ind) => {
          return (
            <ProjectOverview
              projectID={ele.project_id}
              user={user}
              key={ele.id}
            />
          );
        })}
    </div>
  );
}
