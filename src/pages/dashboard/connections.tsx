import Head from "next/head";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import ConnectionRequests from "@/components/Dashboard/Connections/ConnectionRequests";
import MyConnections from "@/components/Dashboard/Connections/MyConnections";
import SearchConnections from "@/components/Dashboard/Connections/SearchConnections";
import SidebarFlowbite from "@/components/Dashboard/SidebarFlowBite";
import { User } from "@/types/types";

type ConnectionProps = {
  user: User;
};

export default function Connections({ user }: ConnectionProps) {
  return (
    <div className="min-h-screen bg-[#FFF2F2] text-black">
      <Head>
        <title>Connections</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SidebarFlowbite user={user} />
      <div className="mt-28 sm:mt-20">
        {/* Search Connections */}
        <SearchConnections user={user} />

        {/* My connections */}
        <MyConnections user={user} />

        {/* Connection Requests */}
        <ConnectionRequests user={user} />
      </div>
    </div>
  );
}

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
