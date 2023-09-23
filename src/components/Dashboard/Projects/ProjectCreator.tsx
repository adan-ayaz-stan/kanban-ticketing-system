import { Barlow } from "@next/font/google";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { UserIdentity } from "@supabase/supabase-js";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Image from "next/image";

const barlow = Barlow({ subsets: ["latin"], weight: "500" });

export default function ProjectCreator({ user, refetch }) {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const supabase = useSupabaseClient();

  const validate = (values) => {
    const errors = {};

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      project_name: "",
      project_description: "",
    },
    validate,
    onSubmit: async (values) => {
      setProcessing(true);

      const date = `${new Date().getFullYear()}-${
        new Date().getUTCMonth() + 1
      }-${new Date().getDate()}`;

      const userData = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id);

      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: values.project_name,
          created_at: date,
          description: values.project_description,
          owner_id: user.id,
          owner_name: user.user_metadata.name,
        })
        .select();
      if (error == null) {
        const { error } = await supabase.from("project_members").insert({
          project_id: data[0].project_id,
          user_id: user.id,
          user_name: userData.data[0].name,
        });

        refetch();
        setModalOpen(false);
        setProcessing(false);
      } else {
        setProcessing(false);
      }
    },
  });

  return (
    <div className="flex m-2">
      {/* BUTTON TO CREATE NEW PROJECT */}
      <button
        onClick={() => setModalOpen(true)}
        className="text-gray-900 bg-gradient-to-br from-[#c7affd] to-[#f9f9f9] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-2.5 py-2.5 mr-2 mb-2 focus:outline-none"
      >
        <span className="text-2xl">
          <AiOutlinePlus />
        </span>
      </button>

      {/* MODAL OR IN VIEW?? */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
          onClick={() => setModalOpen(false)}
          className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black z-50 bg-opacity-50 backdrop-blur-sm">
            <motion.form
              onClick={(e) => e.stopPropagation()}
              onSubmit={formik.handleSubmit}
              className="relative w-11/12 sm:w-9/12 md:w-6/12 lg:w-4/12 p-3 flex flex-col gap-2 text-black bg-[#FFF2F2] rounded-lg"
              initial={{ opacity: 0, maxHeight: "0px" }}
              animate={{ opacity: 1, maxHeight: "500px" }}
              exit={{
                opacity: 0,
                transition: {
                  delay: 0,
                  duration: 0.1,
                },
              }}
            >
              {/* Close icon */}
              {!processing && (
                <div
                  onClick={() => setModalOpen(false)}
                  className="ml-auto text-2xl cursor-pointer px-1.5 rounded hover:bg-gray-300"
                >
                  ✕
                </div>
              )}

              {/*  */}

              <div className="flex flex-col gap-2">
                <input
                  type={"text"}
                  onChange={formik.handleChange}
                  autoComplete="off"
                  name="project_name"
                  placeholder="Project Name"
                  className="w-full px-5 py-3 font-bold text-xl text-gray-900 bg-white outline-none rounded border-[1px] border-gray-300 focus:border-black transition-all duration-400"
                  required
                />
                <textarea
                  rows={6}
                  onChange={formik.handleChange}
                  autoComplete="off"
                  name="project_description"
                  placeholder="This is the project description."
                  style={barlow.style}
                  className="w-full px-3 py-3 text-lg text-gray-900 bg-white outline-none rounded border-[1px] border-gray-300 focus:border-black transition-all duration-400"
                  required
                />
              </div>

              {processing ? (
                <button
                  className="flex gap-1 items-center justify-center text-gray-900 font-medium rounded text-sm px-5 py-2.5 focus:outline-none"
                  disabled
                >
                  Creating project...{" "}
                  <Image
                    src={
                      "https://api.iconify.design/svg-spinners:dot-revolve.svg"
                    }
                    alt="something"
                    height={25}
                    width={25}
                  />
                </button>
              ) : (
                <button
                  type="submit"
                  className="text-gray-900 bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-semibold rounded text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                >
                  Create Project
                </button>
              )}
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
