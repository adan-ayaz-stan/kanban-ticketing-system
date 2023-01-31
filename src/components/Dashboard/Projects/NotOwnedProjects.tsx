import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";

export default function NotOwnedProjects({ user }) {
  const supabase = useSupabaseClient();

  const { isLoading, data, error, refetch } = useQuery(
    "projects-non-owned",
    () => supabase.from("projects").select().contains("members", user.id)
  );

  return (
    <div className="m-2 border-2 border-blue-500">
      <h1 className="p-2 mb-2 text-center rounded-t-xl rounded-b-md text-red-700 bg-white text-xl font-bold uppercase">
        Active Projects ( Not Owned )
      </h1>
    </div>
  );
}
