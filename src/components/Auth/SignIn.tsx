import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import router from "next/router";

export default function SignIn({ changeMode }) {
  const supabase = useSupabaseClient();
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

  return (
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
              placeholder="Your password"
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
            <a onClick={() => changeMode("signUp")} className="cursor-pointer">
              Don't have an account? Sign up
            </a>
            <a
              onClick={() => changeMode("fgtPassword")}
              className="cursor-pointer"
            >
              Forgot your password
            </a>
          </div>
        </Form>
      )}
    </Formik>
  );
}
