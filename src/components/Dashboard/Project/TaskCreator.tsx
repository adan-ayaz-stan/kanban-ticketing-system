import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import Select from "react-select";
import { DateTime } from "luxon";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Barlow } from "@next/font/google";

const barlow = Barlow({ subsets: ["latin"], weight: "700" });

export default function TaskCreator({ projectData, setModalOpen }) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const supabase = useSupabaseClient();

  // Options

  // Options for assigning tasks to people
  const priortyOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  // Options for assigning task categories
  const categoryOptions = projectData.task_categories.map((ele, ind) => {
    return { label: `${ele}`.toUpperCase(), value: ele };
  });

  // SETTING VALUES IN STATE TILL WORKAROUND WITH FORMIK IS POSSIBLE
  const [priortyState, setPriortyState] = useState(priortyOptions[0].value);
  const [categoryState, setCategoryState] = useState(categoryOptions[0].value);

  // FORM HANDLING
  const validate = (values) => {
    const errors = {};

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      task_name: "",
      task_description: "",
    },
    validate,
    onSubmit: async (values) => {
      setProcessing(true);

      const { error } = await supabase.from("tasks").insert({
        name: values.task_name,
        description: values.task_description,
        assigned_to: "",
        status: categoryState,
        priorty: priortyState,
        project_id: projectData.project_id,
      });
      if (error == null) {
        router.reload();
      }
      setModalOpen(false);
      setProcessing(false);
    },
  });

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="w-10/12 md:w-8/12 lg:w-6/12 p-2 m-3 border-[1px] text-black bg-[#FFF2F2] rounded-lg"
    >
      <h2
        className="w-fit mx-auto my-2 font-bold text-xl text-gray-800 uppercase"
        style={barlow.style}
      >
        Create new task
      </h2>

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-2 px-4 py-2 "
      >
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="task_name"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            onChange={formik.handleChange}
            value={formik.values.task_name}
            required
          />
          <label
            htmlFor="task_name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Task Title
          </label>
        </div>

        <div>
          <label
            htmlFor="task_description"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Your message
          </label>
          <textarea
            rows={2}
            name="task_description"
            placeholder="Task Description"
            onChange={formik.handleChange}
            value={formik.values.task_description}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-3">
          <div className="w-full flex flex-col">
            <label className="block mb-1 text-sm font-medium text-gray-900">
              Task Priorty:{" "}
            </label>
            <Select
              name="priorty"
              options={priortyOptions}
              className="text-sm text-black rounded-lg"
              defaultValue={priortyOptions[0]}
              onChange={(value) => {
                setPriortyState(value?.value);
              }}
              required
            />
          </div>

          <div className="w-full flex flex-col">
            <label className="block mb-1 text-sm font-medium text-gray-900">
              Task Category:{" "}
            </label>
            <Select
              name="category"
              options={categoryOptions}
              className="text-sm text-black rounded-lg"
              defaultValue={categoryOptions[0]}
              onChange={(value) => {
                setCategoryState(value?.value);
              }}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-fit mx-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 my-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          disabled={processing}
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
