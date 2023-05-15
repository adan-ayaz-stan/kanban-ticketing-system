import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import User from "@/components/Dashboard/SidebarFlowbite/User";

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

  /*******************
   * COMPONENT STATES *
   *******************/

  const [isSignUpMode, setSignUpMode] = useState(false);
  const [isSignInMode, setSignInMode] = useState(true);
  const [isFgtPasswordMode, setFgtPasswordMode] = useState(false);

  const [isSignUpSuccessful, setSignUpSuccessful] = useState(false);
  const [isFgtLinkSent, setFgtLinkSent] = useState(false);

  const supabase = useSupabaseClient();

  /*****************************************************************
   * FUNTION TO SIGN UP A USER, SIGN IN A USER AND FORGOT PASSWORD *
   *****************************************************************/

  /************************
   * USER SIGN UP HANDLER *
   ************************/
  async function signUpUser(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error == null) {
      const insertUsernameInDatabase = await supabase.from("users").insert([
        {
          id: data.user.id,
          name: name,
          email: email,
        },
      ]);
      if (insertUsernameInDatabase.error == null) {
        setSignUpSuccessful(true);
      }
    }
  }

  /************************
   * USER SIGN IN HANDLER *
   ************************/
  async function signInUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error == null) {
      router.push("/dashboard");
    }
  }

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

  /**************************************************************
   * vv MODE CHANGING FUNCTION TO SIGN UP, SIGN IN OR FGT PASSWORD vv *
   **************************************************************/

  function changeModeToSignIn() {
    setSignInMode(true);
    setSignUpMode(false);
    setFgtPasswordMode(false);
  }
  function changeModeToSignUp() {
    setSignInMode(false);
    setSignUpMode(true);
    setFgtPasswordMode(false);
  }
  function changeModeToFgtPassword() {
    setSignInMode(false);
    setSignUpMode(false);
    setFgtPasswordMode(true);
  }

  if (isSignUpSuccessful) {
    setTimeout(() => {
      router.push("/");
    }, 4000);

    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] p-2">
        <div className="w-11/12 sm:w-6/12 md:w-4/12 bg-gray-900 px-8 py-4 rounded-lg shadow-lg text-white">
          <p>Check your email for password reset link.</p>
        </div>
      </div>
    );
  }

  if (isSignUpSuccessful) {
    setTimeout(() => {
      router.push("/");
    }, 4000);

    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] p-2">
        <div className="w-11/12 sm:w-6/12 md:w-4/12 bg-gray-900 px-8 py-4 rounded-lg shadow-lg text-white">
          <p>Check your email for confirmation link.</p>
        </div>
      </div>
    );
  }

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

        {isSignInMode && (
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values) => {
              const errors = {};

              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }

              if (!values.password) {
                errors.password = "Required";
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              signInUser(values.email, values.password);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4 text-white py-4">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400">Your email</label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Your name"
                    className="p-3 px-4 border-2 outline-none border-[#2e2e2e] bg-[#1e1e1e] focus:border-[#3e3e3e] rounded-md"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-sm text-red-500 px-2"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400">Your password</label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Your name"
                    className="p-3 px-4 border-2 outline-none border-[#2e2e2e] bg-[#1e1e1e] focus:border-[#3e3e3e] rounded-md"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-500 px-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-center mt-2 p-3 text-black bg-[#fff2f2] rounded-md hover:opacity-90 disabled:cursor-not-allowed"
                >
                  Sign in
                </button>

                <div className="flex flex-col gap-1 py-4 text-sm text-center underline text-white">
                  <a onClick={changeModeToSignUp} className="cursor-pointer">
                    Don't have an account? Sign up
                  </a>
                  <a
                    onClick={changeModeToFgtPassword}
                    className="cursor-pointer"
                  >
                    Forgot your password
                  </a>
                </div>
              </Form>
            )}
          </Formik>
        )}

        {/* 
        //
        // ──────────────────────────────────────────────────────────────── I ──────────
        //   :::::: S I G N   U P   F O R M : :  :   :    :     :        :          :
        // ──────────────────────────────────────────────────────────────────────────
        //
        */}
        {isSignUpMode && (
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validate={(values) => {
              const errors = {};

              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }

              if (!values.password) {
                errors.password = "Required";
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              signUpUser(values.name, values.email, values.password);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4 text-white py-4">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400">Your name</label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="p-3 px-4 border-2 outline-none border-[#2e2e2e] bg-[#1e1e1e] focus:border-[#3e3e3e] rounded-md"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-sm text-red-500 px-2"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400">Your email</label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Your email"
                    className="p-3 px-4 border-2 outline-none border-[#2e2e2e] bg-[#1e1e1e] focus:border-[#3e3e3e] rounded-md"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-sm text-red-500 px-2"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400">Your password</label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Your name"
                    className="p-3 px-4 border-2 outline-none border-[#2e2e2e] bg-[#1e1e1e] focus:border-[#3e3e3e] rounded-md"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-500 px-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-center mt-2 p-3 text-black bg-[#fff2f2] rounded-md hover:opacity-90"
                >
                  Sign up
                </button>

                <div className="flex flex-col gap-1 py-4 text-white text-sm text-center underline">
                  <a onClick={changeModeToSignIn} className="cursor-pointer">
                    Have an account already? Sign in
                  </a>
                  <a
                    onClick={changeModeToFgtPassword}
                    className="cursor-pointer"
                  >
                    Forgot your password
                  </a>
                </div>
              </Form>
            )}
          </Formik>
        )}

        {/* 
            //
            // ──────────────────────────────────────────────────────────────────────────────── I ──────────
            //   :::::: F O R G O T   P A S S W O R D   F O R M : :  :   :    :     :        :          :
            // ──────────────────────────────────────────────────────────────────────────────────────────
            //
          */}

        {isFgtPasswordMode && (
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
              <a onClick={changeModeToSignIn} className="cursor-pointer">
                Have an account already? Sign in
              </a>
            </div>
          </form>
        )}

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
