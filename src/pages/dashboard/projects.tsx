import { NextPage } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Sidebar from "@/components/Dashboard/Sidebar";
import ProjectCreator from "@/components/Dashboard/Projects/ProjectCreator";
import { useQuery } from "react-query";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import OwnedProjects from "@/components/Dashboard/Projects/OwnedProjects";
import NotOwnedProjects from "@/components/Dashboard/Projects/NotOwnedProjects";
import SidebarFlowbite from "@/components/Dashboard/SidebarFlowBite";
import Head from "next/head";
import { User } from "@/types/types";

type pageProps = {
  user: User;
};

const Projects: NextPage<pageProps> = ({ user }) => {
  const supabase = useSupabaseClient();

  // Project Owned By Users
  const { isLoading, data, error, refetch } = useQuery(
    "projects-data",
    () => supabase.from("projects").select().filter("ownership", "eq", user.id),
    {
      staleTime: 30000,
      cacheTime: 30000,
    }
  );

  return (
    <div className="min-h-screen bg-[#FFF2F2] text-black text-sm">
      <Head>
        <title>Projects</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar */}
      <SidebarFlowbite user={user} />

      {/* MAIN PANEL */}
      <div className="relative mt-20">
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

export const getServerSideProps = async (ctx: any) => {
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

export default Projects;
