import { NextPage } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Sidebar from "@/components/Dashboard/Sidebar";
import Project from "@/components/Dashboard/Projects/ProjectOverview";
import ProjectCreator from "@/components/Dashboard/Projects/ProjectCreator";
import { useQuery } from "react-query";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AiOutlineLoading, AiOutlineLoading3Quarters } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";

type pageProps = {
  user: Object;
};

const Dashboard: NextPage<pageProps> = ({ user }) => {
  const supabase = useSupabaseClient();

  const projectsData: {}[] = [];

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
        <div className="border-[1px] mx-2 p-2 border-cyan-500 rounded-xl shadow-xl backdrop-blur-lg bg-[#ffffff55]">
          <h1 className="p-2 mb-2 text-center rounded-t-xl rounded-b-md text-green-700 bg-white text-xl font-bold uppercase">
            Active Projects
          </h1>

          <AnimatePresence>
            {isLoading && (
              <motion.p
                initial={{ rotateZ: 0, opacity: 0 }}
                animate={{
                  rotateZ: 360,
                  opacity: 1,
                  transition: {
                    type: "keyframes",
                    ease: "linear",
                    duration: 3,
                    repeat: Infinity,
                  },
                }}
                exit={{
                  rotateZ: 0,
                  opacity: 0,
                  transition: {
                    duration: 0.01,
                  },
                }}
                className="w-fit py-3 mx-auto text-4xl"
              >
                <AiOutlineLoading3Quarters />
              </motion.p>
            )}
          </AnimatePresence>
          {error && <p>An error has occurred.</p>}
          {data && (
            <div className="grid grid-cols-1 auto-rows-auto gap-2">
              {data.data.map((ele, ind) => {
                return <Project projectData={ele} key={ind * Math.random()} />;
              })}
            </div>
          )}
          {data && data.data.length == 0 && (
            <div className="text-center">No projects to show.</div>
          )}
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

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};

export default Dashboard;
