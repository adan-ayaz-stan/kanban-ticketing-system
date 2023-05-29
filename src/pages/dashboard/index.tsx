import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import Head from "next/head";
import Account from "@/components/Dashboard/Account";
import { User } from "@/types/types";
import {
  AiOutlineLogout,
  AiOutlineMessage,
  AiOutlineProject,
} from "react-icons/ai";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

type pageProps = {
  user: User;
  initialSession: Object;
};

const Dashboard: NextPage<pageProps> = ({ user, initialSession }) => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  async function logOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-white text-black py-8">
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        title="Logout"
        onClick={logOut}
        className="absolute top-[25px] right-[25px] bg-gray-100 hover:bg-gray-200 transition-all duration-400 p-3 cursor-pointer z-20 rounded-md"
      >
        <AiOutlineLogout size={36} />
      </div>
      {/* MAIN PANEL */}
      <div className="relative">
        <h2 className="w-full text-xl text-center font-bold uppercase">
          Kanban Ticketing System
        </h2>
        <p className="text-sm text-center">Adan Ayaz</p>

        <div className="m-4 mt-8 p-4 bg-black bg-opacity-10 rounded-xl backdrop-blur-md">
          <Account user={user} />
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
