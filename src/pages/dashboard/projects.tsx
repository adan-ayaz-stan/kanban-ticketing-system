import { NextPage } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import ProjectCreator from "@/components/Dashboard/Projects/ProjectCreator";
import { useQuery } from "react-query";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import OwnedProjects from "@/components/Dashboard/Projects/OwnedProjects";
import NotOwnedProjects from "@/components/Dashboard/Projects/NotOwnedProjects";
import Head from "next/head";
import { User } from "@/types/types";
import { useRouter } from "next/router";
import ThirdScreen from "@/components/Landing/ThirdScreen";
import { Rubik, Sen } from "@next/font/google";

type pageProps = {
  user: User;
};

const rubik = Rubik({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700", "800"],
});
const sen = Sen({ subsets: ["latin"], weight: ["400", "700", "800"] });

const Projects: NextPage<pageProps> = ({ user }) => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  // Project Owned By User
  const ownedProjects = useQuery(
    "all-projects-user-owns",
    () =>
      supabase.from("projects").select("*").filter("owner_id", "eq", user.id),
    {
      staleTime: 30000,
      cacheTime: 30000,
    }
  );

  // Projects not owned by user
  const notOwnedProjects = useQuery(
    "all-projects-user-is-part-of",
    () =>
      supabase
        .from("project_members")
        .select(
          "id, project_id, projects!inner (name, description, owner_name, owner_id)"
        )
        .eq("user_id", user.id)
        .filter("projects.owner_id", "not.eq", user.id),
    {
      staleTime: 25000,
      cacheTime: 25000,
    }
  );

  async function logOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div
      style={{
        background: "linear-gradient(to top, #eaafc8, #C9D6FF)",
        fontFamily: sen.style.fontFamily,
        fontWeight: sen.style.fontWeight,
        fontStyle: sen.style.fontStyle,
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4">
        <h1
          style={rubik.style}
          className="text-center sm:text-left text-2xl font-medium"
        >
          Kanban Ticketing System
        </h1>
        <div
          title="Logout"
          onClick={logOut}
          className="bg-gray-100 hover:bg-gray-200 transition-all duration-400 p-3 cursor-pointer z-20 rounded-md"
        >
          Logout
        </div>
      </div>

      {/* MAIN PANEL */}
      <div className="relative">
        <div className="flex flex-row justify-start flex-wrap items-center">
          <h1
            style={rubik.style}
            className="w-fit text-2xl font-medium uppercase p-4"
          >
            Projects
          </h1>

          {/* New Project Creator */}
          <ProjectCreator user={user} refetch={ownedProjects.refetch} />
        </div>

        {/* Projects */}
        <div className="grid grid-cols-1 auto-rows-auto gap-6">
          <OwnedProjects
            isLoading={ownedProjects.isLoading}
            data={ownedProjects.data}
            error={ownedProjects.error}
          />

          <NotOwnedProjects
            isLoading={notOwnedProjects.isLoading}
            isSuccess={notOwnedProjects.isSuccess}
            data={notOwnedProjects.data}
            error={notOwnedProjects.error}
          />
        </div>
      </div>

      {/* Footer */}
      <ThirdScreen />
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
