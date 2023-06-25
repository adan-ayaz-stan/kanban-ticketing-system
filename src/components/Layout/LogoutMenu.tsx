import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineEllipsis } from "react-icons/ai";

export default function LogoutMenu() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [isMenuOpen, setMenuOpen] = useState(false);

  async function logOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function toggleMenu() {
    setMenuOpen((value) => !value);
  }

  return (
    <div
      onClick={logOut}
      className="relative p-2 px-3 hover:bg-gray-100 rounded-lg cursor-pointer"
    >
      Logout
    </div>
  );
}
