import Link from "next/link";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  AiFillHome,
  AiOutlineLogout,
  AiFillProject,
  AiFillContacts,
} from "react-icons/ai/index";
import { Tooltip } from "react-tooltip";

import "react-tooltip/dist/react-tooltip.css";

import { Barlow } from "@next/font/google";

import logoSvg from "../../assets/images/logo.svg";
import Image from "next/image";

const barlow = Barlow({ subsets: ["latin"], weight: "700" });

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
    <div className="h-fit sm:h-screen w-screen sm:w-16 fixed bottom-0 sm:top-0 left-0 flex flex-row sm:flex-col justify-center sm:justify-between items-center py-2 sm:py-0 text-white bg-[url('https://i.ibb.co/NZ7skxR/image.png')] bg-cover bg-center z-30">
      {/* Logo */}
      <div className="relative flex items-center justify-center sm:block w-full p-2">
        <Image
          src={logoSvg}
          alt="logo"
          height={40}
          width={40}
          style={{
            height: "40px",
            width: "40px",
          }}
          className="mx-auto rounded-full object-cover invert"
        />
      </div>

      {/* Routing */}
      <div className="flex flex-row sm:flex-col gap-4">
        <Link
          href={"/dashboard"}
          id="dashboard-sidebar-home"
          data-tooltip-content="Home"
          className="w-fit p-2 flex flex-col items-center hover:bg-gray-700 cursor-pointer rounded-lg transition-all duration-300"
        >
          <AiFillHome className="text-3xl" />
          <Tooltip anchorId="dashboard-sidebar-home">Home</Tooltip>
          <p style={barlow.style} className="sm:hidden text-sm">
            Home
          </p>
        </Link>
        <Link
          href={"/dashboard/projects"}
          id="dashboard-sidebar-projects"
          className="w-fit p-2 flex flex-col items-center hover:bg-gray-700 cursor-pointer rounded-lg transition-all duration-300"
        >
          <AiFillProject className="text-3xl" />
          <Tooltip anchorId="dashboard-sidebar-projects">Projects</Tooltip>
          <p style={barlow.style} className="sm:hidden text-sm">
            Projects
          </p>
        </Link>
        <Link
          href={"/dashboard/connections"}
          id="dashboard-sidebar-connections"
          className="w-fit p-2 flex flex-col items-center hover:bg-gray-700 cursor-pointer rounded-lg transition-all duration-300"
        >
          <AiFillContacts className="text-3xl" />
          <Tooltip anchorId="dashboard-sidebar-connections">
            Connections
          </Tooltip>
          <p style={barlow.style} className="sm:hidden text-sm">
            Connections
          </p>
        </Link>
      </div>

      {/* Log Out */}
      <div
        id="dashboard-sidebar-logout"
        data-tooltip-content="Logout"
        className="w-fit sm:mb-6 p-2 mx-2 flex flex-col items-center hover:bg-gray-700 cursor-pointer rounded-lg transition-all duration-300"
        onClick={logout}
      >
        <AiOutlineLogout className="text-3xl" />
        <Tooltip anchorId="dashboard-sidebar-logout">Logout</Tooltip>
        <p style={barlow.style} className="sm:hidden text-sm">
          Logout
        </p>
      </div>
    </div>
  );
}
