import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import Select from "react-select";

export default function TaskCreator({ projectData }) {
  const dateBoxRef = useRef(null);
  const priortyRef = useRef(null);

  const assignOptions = projectData.members.map((ele: String) => {
    return { value: ele, label: ele };
  });
  const priortyOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  // SETTING TODAYS DATE AS DEFAULT
  useEffect(() => {
    dateBoxRef.current.valueAsDate = new Date();
  }, []);

  // FORM HANDLING
  const formik = useFormik({
    initialValues: {
      task_name: "",
      task_description: "",
      assign_to: "",
      priorty: "",
      due_date: "",
    },

    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
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
                console.log(value);
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
                console.log(value);
              }}
              ref={priortyRef}
              required
            />
          </div>

          <div className="w-full flex flex-col">
            <label>Task Due Date: </label>
            <input
              type={"date"}
              name="due_date"
              className="px-2 py-[.4em] text-black text-center border-[1px] border-gray-300 rounded focus:outline-none"
              ref={dateBoxRef}
              onChange={formik.handleChange}
              value={formik.values.due_date}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-fit px-2 py-1 mx-auto font-bold uppercase text-blue-600 bg-white rounded"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
