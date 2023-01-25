import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";

type componentProp = {
  pendingTask: {
    task_id: String;
    created_at: String;
    name: String;
    description: String;
    assigned_to: String;
    status: String;
    priorty: String;
    due_date: String;
    labels: [];
    report: String;
    project_id: String;
  };
};

export default function PendingTasks({ pendingTask }: componentProp) {
  const [processing, setProcessing] = useState(false);

  const router = useRouter();
  const supabase = useSupabaseClient();

  async function setTaskToInprogress() {
    setProcessing(true);
    const { error } = await supabase
      .from("tasks")
      .update({ status: "inprogress" })
      .eq("task_id", pendingTask.task_id);
    if (error == null) {
      router.push(router.asPath, "", { scroll: false });
    } else {
      console.log(error);
      setProcessing(false);
    }
  }

  return (
    <div className="relative h-fit flex flex-col gap-2 p-2 bg-white bg-opacity-40 backdrop-blur-lg rounded-lg drop-shadow-lg">
      {/* Task title and description */}
      <details>
        <summary className="text-lg font-semibold pb-2 mb-2 border-b-2 cursor-pointer">
          {pendingTask.name}
        </summary>
        <p className="h-fit px-2 py-1 text-sm text-blue-500 font-bold bg-gray-200 rounded">
          <span className="uppercase text-gray-700">Description:</span>{" "}
          {pendingTask.description}
        </p>
      </details>
      {/* Task assigned to => ? */}
      <p className="h-fit px-2 py-1 text-sm text-black bg-gray-200 rounded">
        <span className="uppercase font-bold text-gray-700">Assigned To: </span>
        <span className="font-bold text-green-800">
          {pendingTask.assigned_to}
        </span>
      </p>
      {/* Task Due Date */}
      <p className="h-fit px-2 py-1 text-sm text-black rounded">
        <span className="uppercase font-bold text-gray-700">Due Date: </span>
        <span className="px-2 py-1 font-bold text-white bg-red-800 rounded-md">
          {pendingTask.due_date}
        </span>
      </p>
      {/* Task Priorty */}
      <p className="absolute top-[10px] right-[10px] uppercase">
        {pendingTask.priorty}
      </p>
      {/* Task Functions */}
      <div className="flex flex-row text-sm px-2 py-1">
        {processing ? (
          <button className="px-2 py-1 font-semibold uppercase text-white bg-gray-700 rounded-md">
            Set task to inprogress
          </button>
        ) : (
          <button
            className="px-2 py-1 font-semibold uppercase text-white bg-green-700 rounded-md"
            onClick={setTaskToInprogress}
          >
            Set task to inprogress
          </button>
        )}
      </div>
      {/* Task Labels */}
      <div className="flex flex-row gap-2 pt-2 border-t-2">
        {pendingTask.labels.map((ele, ind) => {
          return (
            <span
              className="h-fit px-2 text-sm text-blue-500 font-bold bg-gray-200 rounded"
              key={ind * Math.random() + 12}
            >
              {ele}
            </span>
          );
        })}
      </div>
    </div>
  );
}
