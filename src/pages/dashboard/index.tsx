import Account from "@/components/Dashboard/Account";
import Sidebar from "@/components/Dashboard/Sidebar";
import SidebarFlowbite from "@/components/Dashboard/SidebarFlowBite";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";

type pageProps = {
  user: Object;
};

const Dashboard: NextPage<pageProps> = ({ user, initialSession }) => {
  console.log(user);

  return (
    <div className="min-h-screen bg-[#FFF2F2F] text-black">
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
