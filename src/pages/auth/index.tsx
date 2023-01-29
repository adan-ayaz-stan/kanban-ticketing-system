import { Auth, ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

const AuthPage = () => {
  const router = useRouter();

  const [userExists, setUserExists] = useState(false);
  const nameRef = useRef(null);

  const supabase = useSupabaseClient();

  const session = useSession();

  const formSubmitHandler = async (e) => {
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
      .eq("email", session?.user.email);

    if (data[0]) {
      router.push("/dashboard");
      setUserExists(true);
    }
  };
  checkIfUserExists();

  if (session && !userExists) {
    // router.push("/dashboard");
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E5E5CB]">
        <form
          onSubmit={formSubmitHandler}
          className="w-full md:w-6/12 p-2 m-2 flex flex-col gap-3 border-2 bg-[#D5CEA3]"
        >
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Account Name:</h1>
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
            className="p-2 font-bold text-white bg-[#1A120B] rounded"
          >
            Create Profile
          </button>
        </form>
      </div>
    );
  }

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
    props: {},
  };
};

export default AuthPage;
