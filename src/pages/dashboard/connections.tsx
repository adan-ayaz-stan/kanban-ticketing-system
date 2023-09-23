import Head from "next/head";
import { useRouter } from "next/router";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import Contacts from "@/components/Dashboard/Connections/Contacts";
import MainChatWindow from "@/components/Dashboard/Connections/MainChatWindow";

import { User } from "@/types/types";

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
    <div className="min-h-screen bg-white text-black">
      <Head>
        <title>Connections</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-row px-8">
        <Contacts />

        {/* Right Main Functioning Window */}
        <div className="w-full border-2">
          <MainChatWindow />
        </div>
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
