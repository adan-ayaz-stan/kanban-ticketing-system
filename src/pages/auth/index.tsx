import { Auth, ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const AuthPage = () => {
  const supabase = useSupabaseClient();

  <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-pink-300 p-2">
    <div className="bg-gray-700 px-8 py-4 rounded-lg shadow-lg text-black">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
        }}
        theme="dark"
      />
    </div>
  </div>;
};

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
};

export default AuthPage;
