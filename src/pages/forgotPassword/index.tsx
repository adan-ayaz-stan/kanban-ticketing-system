import { supabaseClient } from "@/supabase/supabase.config";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

const ForgotPassword: NextPage = () => {
  const [processing, setProcessing] = useState(false);

  const validate = (values: any) => {
    const errors: any = {};

    if (!values.password) {
      errors.password = "This field cannot be empty.";
    } else if (`${values.password}`.length < 8) {
      errors.password = "Password must be a minimum length of 8";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validate,
    onSubmit: async (values) => {
      const { data, error } = await supabaseClient.auth.updateUser({
        password: values.password,
      });

      if (data) alert("Password updated successfully!");
      if (error) alert("There was an error updating your password.");
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
      <div className="w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 p-4 bg-white text-black rounded-xl">
        <form
          onSubmit={formik.handleSubmit}
          id="login-form"
          autoComplete="off"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label>New Password</label>
            <input
              type="text"
              name="password"
              onChange={(e) => {
                formik.handleChange(e);
              }}
              className="p-3 bg-gray-100 border-none focus:ring-1 focus:ring-orange-500 rounded-xl"
            />
            <AnimatePresence>
              {formik.errors.password && (
                <motion.p
                  className="text-red-700"
                  initial={{ opacity: 0, height: "0px" }}
                  animate={{ opacity: 1, height: "fit-content" }}
                  exit={{ opacity: 0, height: "0px" }}
                  transition={{
                    duration: 0.4,
                    type: "keyframes",
                    ease: "easeOut",
                  }}
                >
                  {formik.errors.password}
                </motion.p>
              )}
            </AnimatePresence>

            {processing ? (
              <button
                type="submit"
                disabled
                className="p-3 font-bold non-italic text-white bg-gray-400 rounded-xl uppercase cursor-not-allowed"
              >
                Set New Password
              </button>
            ) : (
              <button
                type="submit"
                className="p-3 font-bold non-italic text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl uppercase"
              >
                Set New PassWord
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const cookies = context.req.cookies;
  const { data, error } = await supabaseClient.auth.setSession({
    access_token: cookies["my-access-token"],
    refresh_token: cookies["my-refresh-token"],
  });

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event == "PASSWORD_RECOVERY") {
      console.log("Its running");
    }
  });

  if (error == null) {
    return {
      props: {
        data,
      },
    };
  }

  return {
    redirect: {
      destination: "/",
    },
  };
};

export default ForgotPassword;
