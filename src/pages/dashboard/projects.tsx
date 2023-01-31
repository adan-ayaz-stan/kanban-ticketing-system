import { NextPage } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Sidebar from "@/components/Dashboard/Sidebar";
import ProjectCreator from "@/components/Dashboard/Projects/ProjectCreator";
import { useQuery } from "react-query";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import OwnedProjects from "@/components/Dashboard/Projects/OwnedProjects";
import NotOwnedProjects from "@/components/Dashboard/Projects/NotOwnedProjects";

type pageProps = {
  user: Object;
};

const Dashboard: NextPage<pageProps> = ({ user }) => {
  const supabase = useSupabaseClient();

  const { isLoading, data, error, refetch } = useQuery(
    "projects-data",
    () => supabase.from("projects").select().eq("ownership", user.id),
    {
      staleTime: 30000,
      cacheTime: 30000,
    }
  );

  return (
    <div className="min-h-screen bg-[#E5E5CB] text-black text-sm">
      {/* Sidebar */}
      <Sidebar />

      {/* MAIN PANEL */}
      <div className="relative sm:ml-20">
        <h1 className="w-full text-2xl font-bold uppercase p-4">Projects</h1>

        {/* New Project Creator */}
        <ProjectCreator user={user} refetch={refetch} />

        {/* Projects */}
        <OwnedProjects isLoading={isLoading} data={data} error={error} />

        <NotOwnedProjects user={user} />
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  // If we have a session

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};

export default Dashboard;
