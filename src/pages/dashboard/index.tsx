import Sidebar from "@/components/Dashboard/Sidebar";
import { supabaseClient } from "@/supabase/supabase.config";
import { useSession } from "@supabase/auth-helpers-react";
import { GetServerSideProps, NextPage } from "next";

type pageProps = {
  data: Object;
};

const Dashboard: NextPage<pageProps> = ({ data }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = req.cookies;
  const { data, error } = await supabaseClient.auth.setSession({
    access_token: cookies["my-access-token"],
    refresh_token: cookies["my-refresh-token"],
  });

  if (error == null) {
    return {
      props: {
        data,
      },
    };
  }

  return {
    redirect: {
      destination: "/",
    },
  };
};

export default Dashboard;
