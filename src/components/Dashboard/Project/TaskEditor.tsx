import Select from "react-select";

type TaskEditor = {
  task: {
    task_id: string;
    created_at: string;
    name: string;
    description: string;
    assigned_to: string;
    status: string;
    priorty: string;
    due_date: string;
    labels: any[];
    report: string;
    project_id: string;
  };
  setEditMode: any;
};

export default function TaskEditor({ task, setEditMode }: TaskEditor) {
  return (
    <form className="flex flex-col gap-2 text-sm">
      <div>
        <label className="block">Task Name</label>
        <input type={"text"} className="w-full" />
      </div>

      <div>
        <label className="block">Task Description</label>
        <textarea rows={2} className="w-full resize-y" />
      </div>

      <div>
        <label>Assign To</label>
        <Select />
      </div>

      <div>
        <label>Change Status To</label>
        <Select />
      </div>

      <div>
        <label>Task Labels</label>
        <div className="grid grid-cols-3 flex flex-row gap-3">
          <input type={"text"} />
          <input type={"text"} />
          <input type={"text"} />
        </div>
      </div>

      <div className="flex flex-row gap-3 justify-end">
        <button
          onClick={() => setEditMode(false)}
          className="px-2 py-1 font-bold text-white bg-red-700 rounded"
        >
          Discard
        </button>
        <button className="px-2 py-1 font-bold text-white bg-green-700 rounded">
          Save
        </button>
      </div>
    </form>
  );
}
