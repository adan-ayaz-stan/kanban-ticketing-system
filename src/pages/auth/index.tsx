import { Auth, ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const AuthPage = () => {
  const supabase = useSupabaseClient();

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#1A120B] p-2">
      <div className="bg-[#D5CEA3] px-8 py-4 rounded-lg shadow-lg text-black">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#1A120B",
                  brandAccent: "#3C2A21",
                  brandButtonText: "white",
                  inputLabelText: "black",
                  anchorTextColor: "#1A120B",
                  anchorTextHoverColor: "#3C2A21",
                },
              },
            },
          }}
          theme="dark"
        />
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default AuthPage;
