import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";

type componentProp = {
  fulfilledTask: {
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

export default function FulfilledTask({ fulfilledTask }: componentProp) {
  const [processing, setProcessing] = useState(false);

  const router = useRouter();
  const supabase = useSupabaseClient();

  async function deleteTask() {
    setProcessing(true);
    // Code for delete task
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("task_id", fulfilledTask.task_id);
    if (error == null) {
      router.push(router.asPath, undefined, { scroll: false });
    } else {
      setProcessing(false);
    }
    console.log(error);
  }

  return (
    <div className="relative h-fit flex flex-col gap-2 p-2 bg-white bg-opacity-40 backdrop-blur-lg rounded-lg drop-shadow-lg">
      {/* Task title and description */}
      <details>
        <summary className="text-lg font-semibold pb-2 mb-2 border-b-2 cursor-pointer">
          {fulfilledTask.name}
        </summary>
        <p className="h-fit px-2 py-1 text-sm text-blue-500 font-bold bg-gray-200 rounded">
          <span className="uppercase text-gray-700">Description:</span>{" "}
          {fulfilledTask.description}
        </p>
      </details>
      {/* Task assigned to => ? */}
      <p className="h-fit px-2 py-1 text-sm text-black bg-gray-200 rounded">
        <span className="uppercase font-bold text-gray-700">Assigned To: </span>
        <span className="font-bold text-green-800">
          {fulfilledTask.assigned_to}
        </span>
      </p>
      {/* Task Due Date */}
      <p className="h-fit px-2 py-1 text-sm text-black rounded">
        <span className="uppercase font-bold text-gray-700">Due Date: </span>
        <span className="px-2 py-1 font-bold text-white bg-red-800 rounded-md">
          {fulfilledTask.due_date}
        </span>
      </p>
      {/* Task Priorty */}
      <p className="absolute top-[10px] right-[10px] uppercase">
        {fulfilledTask.priorty}
      </p>
      {/* Task Functions */}
      <div className="flex flex-row text-sm px-2 py-1">
        {processing ? (
          <button className="px-2 py-1 font-semibold uppercase text-white bg-gray-700 rounded-md">
            Delete Task
          </button>
        ) : (
          <button
            className="px-2 py-1 font-semibold uppercase text-white bg-green-700 rounded-md"
            onClick={deleteTask}
          >
            Delete Task
          </button>
        )}
      </div>
      {/* Task Labels */}
      <div className="flex flex-row gap-2 pt-2 border-t-2">
        {fulfilledTask.labels.map((ele, ind) => {
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
