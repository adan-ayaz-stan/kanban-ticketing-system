import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";

export default function ConnectionRequests({ user }) {
  console.log(user);

  const supabase = useSupabaseClient();

  const { isLoading, data, error } = useQuery("connection-requests", () =>
    supabase.from("users").select("*").eq("email", user.email)
  );

  console.log(data, error);

  return (
    <div className="my-5">
      <h1 className="w-fit mx-auto text-4xl border-b-2 border-gray-800">
        Connection Requests
      </h1>
    </div>
  );
}
