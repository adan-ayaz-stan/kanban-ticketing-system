import { NextPage } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Sidebar from "@/components/Dashboard/Sidebar";
import Project from "@/components/Dashboard/Projects/ProjectOverview";
import ProjectCreator from "@/components/Dashboard/Projects/ProjectCreator";

type pageProps = {
  user: Object;
  projectsData: [];
};

const Dashboard: NextPage<pageProps> = ({ user, projectsData }) => {
  return (
    <div className="min-h-screen bg-[#D5CEA3] text-black">
      {/* Sidebar */}
      <Sidebar />

      {/* MAIN PANEL */}
      <div className="relative sm:ml-20">
        <h2 className="w-full text-xl text-center font-bold uppercase p-4">
          Projects
        </h2>

        {/* New Project Creator */}
        <ProjectCreator user={user} />

        {/* Projects */}
        <div className="border-[1px] mx-2 p-2 border-cyan-500 rounded-xl shadow-xl backdrop-blur-lg bg-[#ffffff55]">
          <h1 className="p-2 mb-2 text-center rounded-t-xl rounded-b-md text-green-500 bg-white text-xl font-bold uppercase">
            Active Projects
          </h1>

          <div className="grid grid-cols-1 auto-rows-auto gap-2">
            {projectsData.map((ele, ind) => {
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

  // If we have a session

  // We get the user email
  const userEmail = session.user.email;
  // And fetch products that are owned by this email
  const projectsData = await supabase
    .from("projects")
    .select()
    .eq("ownership", userEmail);

  return {
    props: {
      initialSession: session,
      user: session.user,
      projectsData: projectsData.data,
    },
  };
};

export default Dashboard;
