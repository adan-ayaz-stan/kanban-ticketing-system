import { NextPage } from "next";
import Sidebar from "@/components/Dashboard/Sidebar";

import { supabaseClient } from "@/supabase/supabase.config";
import Project from "@/components/Dashboard/Projects/ProjectOverview";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const sampleData = [
  {
    id: 1,
    currentStatus: "active",
    projectName: "Project 01",
    projectCreationDate: "26.01.23",
    totalMembers: 10,
  },
  {
    id: 2,
    currentStatus: "inactive",
    projectName: "Project 02",
    projectCreationDate: "12.02.23",
    totalMembers: 21,
  },
];

type pageProps = {
  user: Object;
};

const Dashboard: NextPage<pageProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* MAIN PANEL */}
      <div className="relative sm:pl-20">
        <h2 className="w-full text-xl text-center font-bold uppercase p-4">
          Projects
        </h2>

        {/* Projects */}
        <div className="border-2 mx-2 p-2 rounded-lg backdrop-blur-20">
          <h1>Your Projects</h1>

          <div className="grid grid-cols-1 auto-rows-auto gap-2">
            {sampleData.map((ele, ind) => {
              return <Project projectData={ele} key={ind * Math.random()} />;
            })}
          </div>
        </div>
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

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};


export default Dashboard;
