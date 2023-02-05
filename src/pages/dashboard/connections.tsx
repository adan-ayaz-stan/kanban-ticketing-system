import ConnectionRequests from "@/components/Dashboard/Connections/ConnectionRequests";
import MyConnections from "@/components/Dashboard/Connections/MyConnections";
import SearchConnections from "@/components/Dashboard/Connections/SearchConnections";
import Sidebar from "@/components/Dashboard/Sidebar";
import SidebarFlowbite from "@/components/Dashboard/SidebarFlowBite";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default function Connections({ user }) {
  return (
    <div className="min-h-screen bg-[#FFF2F2] text-black">
      <SidebarFlowbite user={user} />
      <div className="mt-20">
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
