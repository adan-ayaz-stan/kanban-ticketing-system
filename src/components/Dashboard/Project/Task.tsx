import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import TaskEditor from "./TaskEditor";

interface TaskTypes {
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
}

export default function Task({ task }: TaskTypes) {
  const [processing, setProcessing] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();
  const supabase = useSupabaseClient();

  async function changeTaskStatus() {
    setProcessing(true);
    const { error } = await supabase
      .from("tasks")
      .update({ status: "inprogress" })
      .eq("task_id", task.task_id);
    if (error == null) {
      router.push(router.asPath, "", { scroll: false });
    } else {
      console.log(error);
      setProcessing(false);
    }
  }

  async function deleteTask() {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("task_id", task.task_id);

    if (error == null) {
      router.replace(router.asPath, "", { scroll: false });
    }
  }

  if (isEditMode) {
    return (
      <div className="h-fit flex flex-col gap-2 p-2 bg-white bg-opacity-40 backdrop-blur-lg rounded-lg drop-shadow-lg">
        <TaskEditor task={task} setEditMode={setEditMode} />
      </div>
    );
  }

  return (
    <div className="h-fit flex flex-col gap-2 p-2 bg-white bg-opacity-40 backdrop-blur-lg rounded-lg drop-shadow-lg">
      {/* Task title and description */}
      <details>
        <summary className="text-[14px] font-semibold pb-2 mb-2 border-b-2 cursor-pointer">
          {task.name}
        </summary>
        <p className="h-fit px-2 text-[12px] text-blue-500 font-bold bg-gray-200 rounded">
          <span className="uppercase text-gray-700">Description:</span>{" "}
          {task.description}
        </p>
      </details>
      {/* Task assigned to => ? */}
      <p className="h-fit px-2 py-1 text-[12px] text-black bg-gray-200 rounded">
        <span className="uppercase font-bold text-gray-700">Assigned To: </span>
        <span className="font-bold text-green-800">{task.assigned_to}</span>
      </p>
      {/* Task Due Date */}
      <p className="h-fit px-2 text-[12px] text-black rounded">
        <span className="uppercase font-bold text-gray-700">Due Date: </span>
        <span className="px-2 py-1 font-bold text-white bg-red-800 rounded-md">
          {task.due_date}
        </span>
      </p>

      {/* Task Functions */}
      <div
        onClick={() => setDropdownOpen(true)}
        className="absolute top-[5px] right-[5px] p-1 text-2xl hover:bg-gray-300 rounded-full cursor-pointer"
      >
        <BiDotsVerticalRounded />
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[5px] right-[5px] flex flex-col gap-1 text-[12px] bg-gray-100 rounded cursor-pointer"
          >
            <p
              onClick={() => setDropdownOpen(false)}
              className="px-3 pt-1 ml-auto text-xl hover:text-gray-500"
            >
              <AiOutlineCloseCircle />
            </p>
            <p className="px-4 py-1 bg-gray-100 hover:brightness-[90%]">
              Delete Task
            </p>
            <p
              onClick={() => {
                setEditMode(true);
                setDropdownOpen(false);
              }}
              className="px-4 py-1 bg-gray-100 hover:brightness-[90%]"
            >
              Edit
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {/*  */}

      {/* Task Labels */}
      <div className="flex flex-row gap-2 pt-2 border-t-2">
        {task.labels.map((ele, ind) => {
          return (
            <span
              className="h-fit px-2 text-[12px] text-blue-500 font-bold bg-gray-200 border-blue-400 border-2 rounded"
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
