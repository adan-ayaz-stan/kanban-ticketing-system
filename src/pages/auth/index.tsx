import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import User from "@/components/Dashboard/SidebarFlowbite/User";
import SignIn from "@/components/Auth/SignIn";
import SignUp from "@/components/Auth/SignUp";
import ForgotPassword from "@/components/Auth/ForgotPassword";
import { Rubik, Sen } from "@next/font/google";

type AuthPageProps = {
  session: {
    user: {
      email: string;
      id: string;
    };
  };
};

const rubik = Rubik({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700", "800"],
});
const sen = Sen({ subsets: ["latin"], weight: ["400", "700", "800"] });

const AuthPage = ({ session }: AuthPageProps) => {
  const router = useRouter();
  const [mode, setMode] = useState("signIn");

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] p-2">
      <div className="w-11/12 sm:w-6/12 md:w-4/12 bg-gray-900 px-8 py-4 rounded-lg shadow-lg text-black">
        {/* 
        //
        // ──────────────────────────────────────────────────────────────── I ──────────
        //   :::::: S I G N   I N   F O R M : :  :   :    :     :        :          :
        // ──────────────────────────────────────────────────────────────────────────
        //
        */}

        {mode == "signIn" && <SignIn changeMode={setMode} />}

        {/* 
        //
        // ──────────────────────────────────────────────────────────────── I ──────────
        //   :::::: S I G N   U P   F O R M : :  :   :    :     :        :          :
        // ──────────────────────────────────────────────────────────────────────────
        //
        */}
        {mode == "signUp" && <SignUp changeMode={setMode} />}

        {/* 
            //
            // ──────────────────────────────────────────────────────────────────────────────── I ──────────
            //   :::::: F O R G O T   P A S S W O R D   F O R M : :  :   :    :     :        :          :
            // ──────────────────────────────────────────────────────────────────────────────────────────
            //
          */}

        {mode == "fgtPassword" && <ForgotPassword changeMode={setMode} />}

        <div style={sen.style} className="w-full p-2 bg-gray-300 rounded">
          <h2 style={rubik.style} className="font-bold text-center">
            Dummy Creds
          </h2>
          <p className="font-medium px-6">
            <span style={rubik.style} className="font-semibold">
              Email
            </span>
            :{" "}
            <pre>
              vuhumavomoce@gotgel.org
              <br />
              conag99682@bookspre.com
              <br />
              pfeoekk376@iemail.fun
            </pre>
          </p>
          <p className="px-6">
            <span style={rubik.style} className="font-semibold">
              Password
            </span>
            : 12345678
          </p>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: any) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = await supabase
    .from("users")
    .select()
    .eq("email", session?.user.email);

  if (session && user.data[0]) {
    return {
      redirect: {
        destination: "/dashboard",
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

export default AuthPage;
