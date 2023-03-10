import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

type AuthPageProps = {
  session: {
    user: {
      email: string;
      id: string;
    };
  };
};

const AuthPage = ({ session }: AuthPageProps) => {
  const router = useRouter();

  const [userExists, setUserExists] = useState(false);
  const [isRedirecting, setRedirecting] = useState(false);
  const nameRef = useRef(null);

  const supabase = useSupabaseClient();

  const sessionClientSide = useSession();

  const formSubmitHandler = async (e: HTMLFormElement) => {
    e.preventDefault();

    const { error } = await supabase.from("users").upsert({
      id: session.user.id,
      name: nameRef.current.value,
      email: session?.user.email,
    });

    if (error == null) {
      router.push("/dashboard");
    }

    console.log(error);
  };

  const checkIfUserExists = async () => {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("email", sessionClientSide?.user.email);

    if (data[0]) {
      setRedirecting(true);
      setUserExists(true);
      router.push("/dashboard");
    }

    console.log(data);
  };

  useEffect(() => {
    checkIfUserExists();
  }, [sessionClientSide]);

  if (sessionClientSide && userExists) {
    router.push("/dashboard");
    return (
      <div className="min-h-screen bg-[#131209]">
        <h1 className="text-white text-center py-4">Redirecting...</h1>
      </div>
    );
  }

  if (sessionClientSide && !userExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4]">
        <form
          onSubmit={formSubmitHandler}
          className="w-full md:w-6/12 p-4 m-2 flex flex-col gap-3 bg-[#131209] rounded"
        >
          <div className="flex flex-col">
            <h1 className="text-lg text-white font-semibold">Account Name:</h1>
            <input
              name="name"
              type={"text"}
              className="p-2 text-sm rounded focus:outline-none"
              ref={nameRef}
              required
            />
          </div>

          <button
            type="submit"
            className="w-fit mx-auto p-2 font-bold bg-[#FFF2F2] rounded"
          >
            Create Profile
          </button>

          <p className="text-white text-sm">
            After creating a profile name, you will be able to use the
            application.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] p-2">
      <div className="w-11/12 sm:w-6/12 md:w-4/12 bg-gray-900 px-8 py-4 rounded-lg shadow-lg text-black">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              dark: {
                colors: {
                  brand: "#FFF2F2",
                  brandAccent: "white",
                  brandButtonText: "black",
                  defaultButtonBackgroundHover: "#E5E0FF",
                  anchorTextColor: "#fff2f2",
                  anchorTextHoverColor: "#E5E0FF",
                },
              },
            },
          }}
          theme="dark"
        />

        <div className="w-full p-2 bg-gray-300 rounded">
          <h2 className="font-bold text-center">Dummy Creds</h2>
          <p className="px-6">Email: sicego@finews.biz</p>
          <p className="px-6">Password: 12345678</p>
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
  console.log(user);

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
