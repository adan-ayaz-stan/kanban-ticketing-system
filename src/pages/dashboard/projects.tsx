import { NextPage } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Heading from "@/components/Layout/Heading";
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
import Link from "next/link";

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
        fontFamily: sen.style.fontFamily,
        fontWeight: sen.style.fontWeight,
        fontStyle: sen.style.fontStyle,
      }}
      className="flex flex-col min-h-screen text-sm text-black"
    >
      <Head>
        <title>Projects</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar */}
      <div className="flex flex-col items-center justify-between gap-3 p-4 sm:flex-row">
        <Heading
          className={
            "w-fit pt-3 text-xl text-center font-medium uppercase mb-4"
          }
        >
          Kanban Ticketing System{" "}
          <span className="text-gray-300">| Projects </span>
        </Heading>

        <div className="flex flex-row gap-2">
          <Link
            href={"/dashboard"}
            className="px-4 py-3 bg-white rounded text-md hover:bg-gray-100 hover:underline"
          >
            Dashboard
          </Link>
          <Link
            href={"/dashboard/connections"}
            className="px-4 py-3 bg-white rounded text-md hover:bg-gray-100 hover:underline"
          >
            Connections
          </Link>
        </div>

        <div
          title="Logout"
          onClick={logOut}
          className="z-20 p-3 transition-all bg-white rounded-md cursor-pointer hover:bg-gray-100 duration-400"
        >
          Logout
        </div>
      </div>

      {/* MAIN PANEL */}
      <div className="relative flex-1">
        <div className="flex flex-row flex-wrap items-center justify-end">
          <h1
            style={rubik.style}
            className="p-4 text-xl font-medium uppercase w-fit"
          >
            Create a new project
          </h1>

          {/* New Project Creator */}
          <ProjectCreator user={user} refetch={ownedProjects.refetch} />
        </div>

        {/* Projects */}
        <div className="grid grid-cols-1 gap-6 auto-rows-auto">
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
