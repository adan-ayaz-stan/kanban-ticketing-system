import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import Select from "react-select";
import { DateTime } from "luxon";

import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function TaskCreator({ projectData }) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const supabase = useSupabaseClient();

  const dateBoxRef = useRef(null);

  // Options
  const assignOptions = projectData.members.map((ele: String) => {
    return { value: ele, label: ele };
  });
  const priortyOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  // SETTING VALUES IN STATE TILL WORKAROUND WITH FORMIK IS POSSIBLE
  const [assignTo, setAssignTo] = useState(assignOptions[0].value);
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
          assigned_to: assignTo,
          status: "pending",
          priorty: priortyState,
          due_date: values.due_date,
          project_id: projectData.tasks_id,
          labels: [],
        });
        router.push(router.asPath, "", { scroll: "false" });
        setProcessing(false);
      }
    },
  });

  return (
    <div className="p-2 m-3 border-[1px] text-white bg-blue-800 rounded-lg">
      <h1 className="w-fit mx-auto my-2 font-bold text-xl uppercase">
        Create new task
      </h1>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
        <input
          type={"text"}
          name="task_name"
          placeholder="Task Title"
          onChange={formik.handleChange}
          value={formik.values.task_name}
          className="w-full text-black p-2 border-2 rounded-lg focus:outline-none"
          required
        />

        <textarea
          rows={3}
          name="task_description"
          placeholder="Task Description"
          onChange={formik.handleChange}
          value={formik.values.task_description}
          className="p-2 text-black border-2 resize-y rounded-lg focus:outline-none"
          required
        />

        <div className="flex flex-col md:flex-row justify-between gap-3">
          <div className="w-full flex flex-col">
            <label>Assign To: </label>
            <Select
              name="assign_to"
              options={assignOptions}
              className="text-black rounded-lg"
              defaultValue={assignOptions[0]}
              onChange={(value) => {
                setAssignTo(value.value);
              }}
              required
            />
          </div>

          <div className="w-full flex flex-col">
            <label>Task Priorty: </label>
            <Select
              name="priorty"
              options={priortyOptions}
              className="text-black rounded-lg"
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
              className="px-2 py-[.4em] text-black text-center border-[1px] border-gray-300 rounded focus:outline-none"
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
            className="w-fit px-2 py-1 mx-auto font-bold uppercase text-blue-600 bg-gray-500 rounded"
            disabled
          >
            Create Task
          </button>
        ) : (
          <button
            type="submit"
            className="w-fit px-2 py-1 mx-auto font-bold uppercase text-blue-600 bg-white rounded"
          >
            Create Task
          </button>
        )}
      </form>
    </div>
  );
}
