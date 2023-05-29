import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignUp({ changeMode }) {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [isSignUpSuccessful, setSignUpSuccessful] = useState(false);

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
    } else {
      return {
        error: true,
        message: error.message,
      };
    }
  }

  if (isSignUpSuccessful) {
    setTimeout(() => {
      router.push("/dashboard");
    }, 4000);

    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] p-2">
        <div className="w-11/12 sm:w-6/12 md:w-4/12 bg-gray-900 px-8 py-4 rounded-lg shadow-lg text-white">
          <p>Please don't hesitate to provide feedback.</p>
        </div>
      </div>
    );
  }

  return (
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
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        const su = await signUpUser(values.name, values.email, values.password);
        if (su.error) {
          setErrors({ email: su.message });
        }
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
            className="w-full text-center mt-2 p-3 text-black bg-[#fff2f2] rounded-md hover:opacity-90"
          >
            Sign up
          </button>

          <div className="flex flex-col gap-1 py-4 text-white text-sm text-center underline">
            <a onClick={() => changeMode("signIn")} className="cursor-pointer">
              Have an account already? Sign in
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
