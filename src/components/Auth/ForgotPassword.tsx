import { useSupabaseClient } from "@supabase/auth-helpers-react";
import router from "next/router";
import { useState } from "react";

export default function ForgotPassword({ changeMode }) {
  const supabase = useSupabaseClient();
  const [isFgtLinkSent, setFgtLinkSent] = useState(false);

  /********************************
   * USER FORGOT PASSWORD HANDLER *
   ********************************/

  async function forgotPasswordHandler(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      `${email}`,
      {
        redirectTo:
          "https://kanban-ticketing-system.vercel.app/auth/changePassword",
      }
    );

    if (error == null) {
      setFgtLinkSent(true);
      setTimeout(() => {
        router.push("/");
      }, 5000);
    }
  }

  return (
    <form
      onSubmit={forgotPasswordHandler}
      className="flex flex-col gap-4 text-white py-4"
    >
      <div className="flex flex-col gap-1">
        <label className="text-gray-400">Your email</label>
        <input
          type={"email"}
          name="email"
          placeholder="Your email address"
          className="p-3 px-4 border-2 outline-none border-[#2e2e2e] bg-[#1e1e1e] focus:border-[#3e3e3e] rounded-md"
        />
      </div>

      {isFgtLinkSent ? (
        <p className="text-sm">
          An email with a password reset link has been sent to the above
          mentioned email address.
        </p>
      ) : (
        <button
          type="submit"
          className="w-full text-center mt-2 p-3 text-black bg-[#fff2f2] rounded-md hover:opacity-90 disabled:cursor-not-allowed"
        >
          Forgot Password
        </button>
      )}

      <div className="flex flex-col gap-1 py-4 text-sm text-center underline">
        <a onClick={() => changeMode("signIn")} className="cursor-pointer">
          Have an account already? Sign in
        </a>
      </div>
    </form>
  );
}
