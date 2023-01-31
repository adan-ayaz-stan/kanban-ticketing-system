import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import Select from "react-select";
import { DateTime } from "luxon";

import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function TaskCreator({ projectData, setModalOpen }) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const supabase = useSupabaseClient();

  const dateBoxRef = useRef(null);

  // Options

  // Options for assigning tasks to people
  const priortyOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  // SETTING VALUES IN STATE TILL WORKAROUND WITH FORMIK IS POSSIBLE
  const [priortyState, setPriortyState] = useState(priortyOptions[0].value);

  // SETTING TODAYS DATE AS DEFAULT
  useEffect(() => {
    dateBoxRef.current.valueAsDate = new Date();
  }, []);

  // FORM HANDLING
  const validate = (values) => {
    const errors = {};

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      task_name: "",
      task_description: "",
      due_date: "",
    },
    validate,
    onSubmit: async (values) => {
      setProcessing(true);
      // Handling Date
      const dateX = DateTime.fromSQL(values.due_date);
      const daysDifference = DateTime.now().diff(dateX, "hours").values.hours;
      console.log(daysDifference);
      if (daysDifference > 0) {
        formik.errors.due_date = "Date must be valid";
        setProcessing(false);
      } else {
        const { error } = await supabase.from("tasks").insert({
          created_at: `${new Date().getUTCFullYear()}-${
            new Date().getUTCMonth() + 1
          }-${new Date().getUTCDay()}`,
          name: values.task_name,
          description: values.task_description,
          assigned_to: "",
          status: "pending",
          priorty: priortyState,
          due_date: values.due_date,
          project_id: projectData.project_id,
          labels: [],
        });
        setModalOpen(false);
        router.push(router.asPath, "", { scroll: false });
        setProcessing(false);
      }
    },
  });

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="md:w-8/12 lg:w-6/12 p-2 m-3 border-[1px] text-black bg-gray-200 rounded-lg"
    >
      <h1 className="w-fit mx-auto my-2 font-bold text-xl text-gray-800 uppercase">
        Create new task
      </h1>

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-2 px-4 py-2 "
      >
        <input
          type={"text"}
          name="task_name"
          placeholder="Task Title"
          onChange={formik.handleChange}
          value={formik.values.task_name}
          className="w-full text-sm text-black p-2 border-2 rounded-lg focus:outline-none"
          required
        />

        <textarea
          rows={2}
          name="task_description"
          placeholder="Task Description"
          onChange={formik.handleChange}
          value={formik.values.task_description}
          className="p-2 text-sm text-black border-2 resize-y rounded-lg focus:outline-none"
          required
        />

        <div className="flex flex-col md:flex-row justify-between gap-3">
          <div className="w-full flex flex-col">
            <label>Task Priorty: </label>
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
            <label>Task Due Date: </label>
            <input
              type={"date"}
              name="due_date"
              className="px-2 py-[.6em] text-sm text-black text-center border-[1px] border-gray-300 rounded focus:outline-none cursor-pointer"
              style={{ border: formik.errors.due_date ? "red 2px solid" : "" }}
              ref={dateBoxRef}
              onChange={formik.handleChange}
              value={formik.values.due_date}
              required
            />
            <p>{formik.errors.due_date}</p>
          </div>
        </div>

        {processing ? (
          <button
            type="submit"
            className="w-fit px-2 py-1 mx-auto mt-2 font-bold uppercase text-[#3C2A21] bg-gray-500 rounded"
            disabled
          >
            Create Task
          </button>
        ) : (
          <button
            type="submit"
            className="w-fit px-2 py-1 mx-auto mt-2 font-bold uppercase text-[#3C2A21] bg-white rounded"
          >
            Create Task
          </button>
        )}
      </form>
    </div>
  );
}
