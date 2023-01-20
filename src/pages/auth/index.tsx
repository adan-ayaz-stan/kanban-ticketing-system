// import LoginForm from "@/components/Login/LoginForm";
import { supabaseClient } from "@/supabase/supabase.config";
// import { GetServerSideProps } from "next";

// export default function LogIn() {
//   return (
//     <div className="min-h-screen flex justify-center items-center bg-white">
//       <div className="h-fit w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 px-4 py-12 border-2 rounded-xl shadow-lg">
//         <LoginForm />
//       </div>
//     </div>
//   );
// }

import { Auth, ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const AuthPage = ({ data }) => {
  const router = useRouter();

  const session = useSession();
  const supabase = useSupabaseClient();

  if (!session) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-pink-300 p-2">
        {!session ? (
          <div className="bg-gray-700 px-8 py-4 rounded-lg shadow-lg text-black">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
              }}
              theme="dark"
            />
          </div>
        ) : (
          <p>Account page will go here.</p>
        )}
      </div>
    );
  } else {
    router.push("/dashboard");
    return (
      <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-blue-500 to-pink-300">
        <h1 className="font-bold text-2xl text-center">Redirecting..</h1>
      </div>
    );
  }
};

export default AuthPage;
