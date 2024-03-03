import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import Head from "next/head";
import Account from "@/components/Dashboard/Account";
import { User } from "@/types/types";
import ThirdScreen from "@/components/Landing/ThirdScreen";
import Heading from "@/components/Layout/Heading";
import LogoutMenu from "@/components/Layout/LogoutMenu";
import { MdSettings } from "react-icons/md";
import { useState } from "react";
import Settings from "@/components/Dashboard/Settings";
import { AnimatePresence } from "framer-motion";
import { Rubik, Sen } from "@next/font/google";

type pageProps = {
  user: User;
  initialSession: Object;
};

const rubik = Rubik({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700", "800"],
});
const sen = Sen({ subsets: ["latin"], weight: ["400", "700", "800"] });

const Dashboard: NextPage<pageProps> = ({ user, initialSession }) => {
  const [isOpenSettings, setOpenSettings] = useState(false);

  return (
    <div
      style={sen.style}
      className="flex flex-col min-h-screen py-4 text-black bg-white"
    >
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Account Settings */}
      <AnimatePresence>
        {isOpenSettings && <Settings closeSettings={setOpenSettings} />}
      </AnimatePresence>
      {/*  */}
      <div className="flex flex-col items-center justify-between px-8 sm:flex-row">
        <Heading
          className={
            "w-fit pt-3 text-xl text-center font-medium uppercase mb-4"
          }
        >
          Kanban Ticketing System{" "}
          <span className="text-gray-300">| Dashboard </span>
        </Heading>

        <div className="flex items-center gap-2">
          <div
            onClick={() => setOpenSettings(true)}
            className="flex items-center gap-1 text-gray-500 cursor-pointer hover:text-gray-800"
          >
            <MdSettings size={28} /> Account Settings
          </div>
          <LogoutMenu />
        </div>
      </div>
      {/* MAIN PANEL */}
      <div className="relative flex-1 px-3 py-12 md:px-8">
        <Account user={user} />
      </div>

      <ThirdScreen />
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
