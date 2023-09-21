import Head from "next/head";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import ConnectionRequests from "@/components/Dashboard/Connections/ConnectionRequests";
import MyConnections from "@/components/Dashboard/Connections/MyConnections";
import SearchConnections from "@/components/Dashboard/Connections/SearchConnections";
import { User } from "@/types/types";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

type ConnectionProps = {
  user: User;
};

export default function Connections({ user }: ConnectionProps) {
  const supabase = useSupabaseClient();
  const router = useRouter();

  async function logOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#FFF2F2] text-black">
      <Head>
        <title>Connections</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-white flex justify-center items-center bg-gray-900 py-5 px-12">
        <Link href={"/dashboard"} className="font-bold">
          Home
        </Link>
        <h1 className="mx-auto text-white font-bold text-center text-3xl">
          Kanban Ticketing System
        </h1>
        <div onClick={logOut} className="font-bold cursor-pointer">
          Log out
        </div>
      </div>

      <div>
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

export const getServerSideProps = async (ctx: any) => {
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
