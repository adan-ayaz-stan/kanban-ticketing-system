import Head from "next/head"; 
import { useRecoilValue } from "recoil";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Contacts from "@/components/Dashboard/Connections/Contacts";
import MainChatWindow from "@/components/Dashboard/Connections/MainChatWindow";

import { User } from "@/types/types";
import { chatWindowAtom } from "@/atoms/chatWindowAtom";
import { requestsWindowAtom } from "@/atoms/requestsWindowAtom";
import RequestsWindow from "@/components/Dashboard/Connections/RequestsWindow";

type ConnectionProps = {
  user: User;
};

export default function Connections({ user }: ConnectionProps) {
  const chatWindowState = useRecoilValue(chatWindowAtom);
  const requestsWindowState = useRecoilValue(requestsWindowAtom);

  return (
    <div className="min-h-screen max-h-screen bg-white text-black">
      <Head>
        <title>Connections</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-row px-8">
        <Contacts />

        {/* Right Main Functioning Window */}
        <div className="w-full">
          {chatWindowState != null && <MainChatWindow />}
          {requestsWindowState != null && <RequestsWindow />}

          {chatWindowState == null && requestsWindowState == null && (
            <NoChatWindowOpen />
          )}
        </div>
      </div>
    </div>
  );
}

function NoChatWindowOpen() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      No window is open
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
