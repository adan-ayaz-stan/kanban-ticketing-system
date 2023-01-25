import Sidebar from "@/components/Dashboard/Sidebar";
import { supabaseClient } from "@/supabase/supabase.config";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

type pageProps = {
  user: Object;
};

const Dashboard: NextPage<pageProps> = ({ user }) => {
  console.log(user);

  return (
    <div className="min-h-screen bg-[#D5CEA3] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* MAIN PANEL */}
      <div className="relative sm:pl-20">
        <h2 className="w-full text-xl text-center font-bold uppercase p-4">
          Your dashboard
        </h2>

        <div className="m-4 p-4 bg-black bg-opacity-10 rounded-xl backdrop-blur-md">
          Authorized Users Dashboard.
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
