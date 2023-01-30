import { useRouter } from "next/router";
import {
  AiFillGift,
  AiFillHome,
  AiOutlineLogout,
  AiFillProject,
  AiFillContacts,
} from "react-icons/ai/index";

import { Tooltip } from "react-tooltip";

import "react-tooltip/dist/react-tooltip.css";

import { supabaseClient } from "@/supabase/supabase.config";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Sidebar() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error == null) {
      router.push("/");
    }
  };

  return (
    <div className="h-fit sm:h-screen w-screen sm:w-16 fixed bottom-0 sm:top-0 left-0 flex flex-row sm:flex-col justify-center sm:justify-between items-center py-2 sm:py-0 text-white bg-[#1A120B] z-50">
      {/* Logo */}
      <div className="relative hidden sm:block h-20 w-full">Logo</div>

      {/* Routing */}
      <div className="flex flex-row sm:flex-col gap-4">
        <Link
          href={"/dashboard"}
          id="dashboard-sidebar-home"
          data-tooltip-content="Home"
          className="w-fit p-2 hover:bg-cyan-400 cursor-pointer rounded-lg transition-all duration-300"
        >
          <AiFillHome className="text-3xl" />
          <Tooltip anchorId="dashboard-sidebar-home">Home</Tooltip>
        </Link>
        <Link
          href={"/dashboard/projects"}
          id="dashboard-sidebar-projects"
          className="w-fit p-2 hover:bg-cyan-400 cursor-pointer rounded-lg transition-all duration-300"
        >
          <AiFillProject className="text-3xl" />
          <Tooltip anchorId="dashboard-sidebar-projects">Projects</Tooltip>
        </Link>
        <Link
          href={"/dashboard/connections"}
          id="dashboard-sidebar-connections"
          className="w-fit p-2 hover:bg-cyan-400 cursor-pointer rounded-lg transition-all duration-300"
        >
          <AiFillContacts className="text-3xl" />
          <Tooltip anchorId="dashboard-sidebar-connections">
            Connections
          </Tooltip>
        </Link>
        <div
          id="dashboard-sidebar-gift"
          className="w-fit p-2 hover:bg-cyan-400 cursor-pointer rounded-lg transition-all duration-300"
        >
          <AiFillGift className="text-3xl" />
          <Tooltip anchorId="dashboard-sidebar-gift">[Placeholder]</Tooltip>
        </div>
      </div>

      {/* Log Out */}
      <div
        id="dashboard-sidebar-logout"
        data-tooltip-content="Logout"
        className="w-fit sm:mb-6 p-2 hover:bg-cyan-400 cursor-pointer rounded-lg transition-all duration-300"
        onClick={logout}
      >
        <AiOutlineLogout className="text-3xl" />
        <Tooltip anchorId="dashboard-sidebar-logout">Logout</Tooltip>
      </div>
    </div>
  );
}
