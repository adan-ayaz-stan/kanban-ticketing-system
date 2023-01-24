import Select from "react-select";

export default function TaskCreator({ projectData }) {
  const assignOptions = projectData.members.map((ele: String) => {
    return { value: ele, label: ele };
  });
  const priortyOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  return (
    <div className="p-2 m-3 border-2 text-black bg-white">
      <h1 className="font-bold">Create new task</h1>

      <form className="flex flex-col gap-2">
        <input
          type={"text"}
          name="task_name"
          placeholder="Task Title"
          className="w-full p-2 border-2 rounded-lg"
        />

        <textarea
          rows={3}
          name="task_description"
          placeholder="Task Description"
          className="p-2 border-2 resize-y rounded-lg"
        />

        <div className="flex flex-row justify-between gap-3">
          <Select options={assignOptions} className="w-full" />

          <Select options={priortyOptions} className="w-full" />

          <input type={"date"} name="due_date" className="w-full" />
        </div>
      </form>
    </div>
  );
}
