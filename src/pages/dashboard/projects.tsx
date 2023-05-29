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
import { AiOutlineLogout } from "react-icons/ai";
import { useRouter } from "next/router";

type pageProps = {
  user: User;
};

const Projects: NextPage<pageProps> = ({ user }) => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  // Project Owned By Users
  const { isLoading, data, error, refetch } = useQuery(
    "projects-data",
    () => supabase.from("projects").select().filter("ownership", "eq", user.id),
    {
      staleTime: 30000,
      cacheTime: 30000,
    }
  );

  async function logOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div
      style={{
        background:
          "linear-gradient(to top, #eaafc8, #C9D6FF)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
      }}
      className="min-h-screen text-black text-sm"
    >
      <Head>
        <title>Projects</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar */}
      <div className="flex justify-between items-center px-4">
        <p>Adan Ayaz</p>
        <h1 className="text-2xl font-bold">Kanban Ticketing System</h1>
        <div
          title="Logout"
          onClick={logOut}
          className="bg-gray-100 hover:bg-gray-200 transition-all duration-400 p-3 cursor-pointer z-20 rounded-md"
        >
          <AiOutlineLogout size={36} />
        </div>
      </div>

      {/* MAIN PANEL */}
      <div className="relative mt-20">
        <div className="flex flex-row justify-start flex-wrap items-center">
          <h1 className="w-fit text-2xl font-bold uppercase p-4">Projects</h1>

          {/* New Project Creator */}
          <ProjectCreator user={user} refetch={refetch} />
        </div>

        {/* Projects */}
        <div className="grid grid-cols-2 auto-rows-auto gap-6">
          <OwnedProjects isLoading={isLoading} data={data} error={error} />

          <NotOwnedProjects user={user} />
        </div>
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
