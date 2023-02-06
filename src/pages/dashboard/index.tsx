import Account from "@/components/Dashboard/Account";
import Sidebar from "@/components/Dashboard/Sidebar";
import SidebarFlowbite from "@/components/Dashboard/SidebarFlowBite";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import Head from "next/head";

type pageProps = {
  user: Object;
};

const Dashboard: NextPage<pageProps> = ({ user, initialSession }) => {
  return (
    <div className="min-h-screen bg-[#FFF2F2F] text-black">
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar */}
      {/* <Sidebar /> */}
      <SidebarFlowbite user={user} />

      {/* MAIN PANEL */}
      <div className="relative">
        <h2 className="w-full text-xl text-center font-bold uppercase p-4">
          Your dashboard
        </h2>

        <div className="m-4 mt-8 p-4 bg-black bg-opacity-10 rounded-xl backdrop-blur-md">
          <Account session={initialSession} />
        </div>

        <div>
          <p className="px-4 py-2 m-4 text-sm bg-gray-100 rounded-lg">
            <span className="text-2xl">✎</span> In the Connections section, you
            will be able to find and make connections, and start a chat feature
            that is coming soon.
            <br /> <span className="text-2xl">✎</span> In the Projects section,
            you can create new projects, add users to them, and manage tasks
            within the project, including creating, editing, and deleting tasks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

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
