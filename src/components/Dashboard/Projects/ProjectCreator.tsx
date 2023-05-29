import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";

export default function ProjectCreator({ user, refetch }) {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const supabase = useSupabaseClient();

  const validate = () => {
    const errors = {};
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      project_name: "",
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
          ownership: user.id,
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
        className="text-gray-900 bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-2.5 py-2.5 mr-2 mb-2 focus:outline-none"
      >
        <span className="text-2xl">
          <AiOutlinePlus />
        </span>
      </button>

      {/* MODAL OR IN VIEW?? */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black z-50 bg-opacity-50">
            <motion.form
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
              <div
                onClick={() => setModalOpen(false)}
                className="absolute top-[15px] right-[20px] text-2xl cursor-pointer px-1.5 rounded hover:bg-gray-300"
              >
                ✕
              </div>

              {/*  */}

              <div className="flex flex-col gap-2 items-center">
                <label className="w-fit mx-auto my-2 font-bold text-xl text-gray-800 uppercase">
                  Project Name
                </label>
                <input
                  type={"text"}
                  onChange={formik.handleChange}
                  name="project_name"
                  className="w-full px-5 py-3 font-bold text-2xl text-gray-900 bg-white outline-none rounded border-[1px] border-gray-300 focus:border-black transition-all duration-400"
                  required
                />
              </div>

              {processing ? (
                <button
                  className="text-gray-900 bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none filter grayscale"
                  disabled
                >
                  Creating project...
                </button>
              ) : (
                <button
                  type="submit"
                  className="text-gray-900 bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
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
