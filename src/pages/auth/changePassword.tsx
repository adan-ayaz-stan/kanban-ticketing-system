import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ChangePassword({ session }) {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const [error, setError] = useState("");

  async function changePasswordHandler(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const passwordOne = formData.get("password");
    const passwordTwo = formData.get("password-confirm");

    if (passwordOne != passwordTwo) {
      return setError("Passwords must match each other.");
    }

    const { data, error } = await supabase.auth.updateUser({
      email: session.user.email,
      password: `${passwordOne}`,
    });

    if (error == null) {
      console.log("Password changed successfully.");
      router.push("/dashboard");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center pb-12 text-white bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4]">
      <div className="w-11/12 sm:w-6/12 md:w-4/12 bg-gray-900 px-8 py-4 rounded-lg shadow-lg text-black">
        <form
          onSubmit={changePasswordHandler}
          className="flex flex-col gap-4 text-white py-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-gray-400">New Password</label>
            <input
              type={"password"}
              name="password"
              required
              placeholder="Your new password"
              onClick={() => setError("")}
              minLength={8}
              className="p-3 px-4 border-2 outline-none border-[#2e2e2e] bg-[#1e1e1e] focus:border-[#3e3e3e] rounded-md"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-400">Confirm Password</label>
            <input
              type={"password"}
              name="password-confirm"
              required
              placeholder="Confirm your password"
              onClick={() => setError("")}
              minLength={8}
              className="p-3 px-4 border-2 outline-none border-[#2e2e2e] bg-[#1e1e1e] focus:border-[#3e3e3e] rounded-md"
            />
          </div>

          <AnimatePresence>
            {error != "" ? (
              <motion.p
                initial={{ opacity: 0, maxHeight: "0px" }}
                animate={{
                  opacity: 1,
                  maxHeight: "100px",
                  transition: {
                    type: "keyframes",
                    ease: "easeOut",
                    duration: 0.7,
                  },
                }}
                exit={{
                  opacity: 0,
                  maxHeight: "0px",
                  transition: {
                    type: "keyframes",
                    ease: "easeOut",
                    duration: 0.1,
                  },
                }}
                className="text-red-500 tracking-tighter leading-tight"
              >
                {error}
              </motion.p>
            ) : (
              ""
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full text-center mt-2 p-3 text-black bg-[#fff2f2] rounded-md hover:opacity-90"
          >
            Change Password
          </button>

          <div className="flex flex-col gap-1 py-4 text-sm text-center underline">
            <Link href={"/auth"} className="cursor-pointer">
              Have an account already? Sign in
            </Link>
          </div>
        </form>
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

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};
