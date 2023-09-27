import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Settings() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  async function logOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={logOut}
        className="p-2 border-2 border-gray-100 bg-gray-100 hover:bg-gray-200"
      >
        Log out
      </button>
    </div>
  );
}
