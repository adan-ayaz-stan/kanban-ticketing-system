import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { useQuery } from "react-query";

export default function User({ user }) {
  const router = useRouter();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const supabase = useSupabaseClient();

  const { isLoading, data, error, isSuccess } = useQuery(
    "user-data-for-dashboard",
    () => supabase.from("users").select("name").eq("id", user.id),
    {
      staleTime: 6000,
      cacheTime: 6000,
    }
  );

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error == null) {
      router.push("/");
    }
  }

  return (
    <>
      <button
        className="text-black bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-2.5 text-center inline-flex items-center"
        type="button"
        onClick={() => setDropdownOpen((value) => !value)}
      >
        <AiOutlineUser />
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-[125%] right-[0%] z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
          >
            {isSuccess && (
              <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div>{data.data[0].name}</div>
                <div className="font-medium truncate">{user.email}</div>
              </div>
            )}
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownInformationButton"
            >
              <li>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Settings
                </a>
              </li>
            </ul>
            <div className="py-2">
              <button
                onClick={logout}
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
