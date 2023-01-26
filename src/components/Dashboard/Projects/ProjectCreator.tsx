import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";

export default function ProjectCreator({ user }) {
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

      const { error } = await supabase.from("projects").insert({
        name: values.project_name,
        created_at: date,
        ownership: user.email,
        members: [`${user.email}`],
      });
      if (error == null) {
        setModalOpen(false);
        setProcessing(false);
        router.push(router.asPath, "", { scroll: false });
      } else {
        setProcessing(false);
      }
    },
  });

  return (
    <div className="flex flex-col m-2">
      {/* BUTTON TO CREATE NEW PROJECT */}
      {isModalOpen ? (
        <button
          onClick={() => setModalOpen(false)}
          className="flex flex-row gap-2 items-center p-2 ml-auto font-bold rounded-lg text-white bg-[#3C2A21]"
        >
          <span className="text-2xl">
            <AiOutlineClose />
          </span>{" "}
          Close Modal
        </button>
      ) : (
        <button
          onClick={() => setModalOpen(true)}
          className="flex flex-row gap-2 items-center p-2 ml-auto font-bold rounded-lg text-white bg-[#3C2A21]"
        >
          <span className="text-2xl">
            <AiOutlinePlus />
          </span>{" "}
          Create a new project
        </button>
      )}

      {/* MODAL OR IN VIEW?? */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-2 p-2 mt-2 border-2 text-white bg-[#3C2A21] rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                delay: 0,
                duration: 0.1,
              },
            }}
          >
            <div className="flex flex-col gap-2 items-center">
              <label className="w-fit mr-auto font-bold">Project Name</label>
              <input
                type={"text"}
                onChange={formik.handleChange}
                name="project_name"
                className=" w-full px-2 py-1 font-semibold text-sm text-gray-700 bg-white focus:bg-gray-100 border-[1px] border-cyan-500 focus:outline-none rounded"
                required
              />
            </div>

            {processing ? (
              <button
                className="w-fit px-2 py-1 mx-auto font-bold uppercase text-white bg-gray-500 rounded"
                disabled
              >
                Create
              </button>
            ) : (
              <button
                type="submit"
                className="w-fit px-2 py-1 mx-auto font-bold uppercase text-white bg-[#1A120B] rounded"
              >
                Create
              </button>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
