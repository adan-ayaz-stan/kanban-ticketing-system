import { supabaseClient } from "@/supabase/supabase.config";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const SendForgotPasswordMail: NextPage = () => {
  const router = useRouter();

  const [processing, setProcessing] = useState(false);

  const [message, setMessage] = useState("");

  const validate = (values: any) => {
    const errors: any = {};

    // Checking if email is valid
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
      errors.email = "Invalid email address.";
    }

    // Checking if email and password fields are not empty.
    if (!values.email) {
      errors.email = "This field is required.";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validate,
    onSubmit: async (values) => {
      setProcessing(true);
      try {
        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
          `${values.email}`,
          {
            redirectTo: `/forgotPassword`,
          }
        );

        if (data) {
          setMessage(
            `A mail containing the password reset link was successfully sent to ${values.email}. You may send another request in 30 seconds if the mail fails to reach you somehow.`
          );
          setTimeout(() => {
            setProcessing(false);
          }, 30000);
        }
        if (error) {
          formik.errors.email = error.message;
          setProcessing(false);
        }
      } catch (e) {
        setProcessing(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
      <div className="w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 p-4 bg-white text-black rounded-xl">
        <form
          onSubmit={formik.handleSubmit}
          id="forgot-password-form"
          autoComplete="off"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label>Email for Password Reset Link</label>
            <input
              type="email"
              name="email"
              onChange={(e) => {
                formik.handleChange(e);
              }}
              className="p-3 bg-gray-100 border-none focus:ring-1 focus:ring-orange-500 rounded-xl"
            />
            <AnimatePresence>
              {formik.errors.email && (
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
                  {formik.errors.email}
                </motion.p>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {message !== "" && (
                <motion.p
                  className="text-gray-700 text-sm px-2"
                  initial={{ opacity: 0, height: "0px" }}
                  animate={{ opacity: 1, height: "fit-content" }}
                  exit={{ opacity: 0, height: "0px" }}
                  transition={{
                    duration: 0.4,
                    type: "keyframes",
                    ease: "easeOut",
                  }}
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>

            {processing ? (
              <button
                type="submit"
                disabled
                className="p-3 font-bold non-italic text-white bg-gray-400 rounded-xl uppercase cursor-not-allowed"
              >
                Send Link
              </button>
            ) : (
              <button
                type="submit"
                className="p-3 font-bold non-italic text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl uppercase"
              >
                Send Link
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendForgotPasswordMail;
