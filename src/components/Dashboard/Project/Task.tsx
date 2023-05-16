import { taskDetailsModalAtom } from "@/atoms/taskDetailsModalAtom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import TaskDetailsModal from "./TaskDetailsModal";
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
  projectData: Object;
}

export default function Task({ task, projectData }: TaskTypes) {
  const [isEditMode, setEditMode] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const setTaskAtom = useSetRecoilState(taskDetailsModalAtom);

  const supabase = useSupabaseClient();

  const [taskAssignedTo, setTaskAssignedTo] = useState("");

  async function deleteTask() {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("task_id", task.task_id);
  }

  const getTaskPriorityStyle = (priority) => {
    let className =
      "w-fit px-3 pt-2 text-[14px] font-semibold pb-2 mb-2 border-b-2 cursor-pointer rounded";
    switch (priority) {
      case "low":
        className += " text-gray-900 bg-gray-300";
        break;
      case "medium":
        className += " text-white bg-orange-500";
        break;
      case "high":
        className += " text-white bg-red-500";
        break;
      default:
        break;
    }
    return className;
  };

  if (isEditMode) {
    return (
      <div className="h-fit flex flex-col gap-2 p-2 bg-white bg-opacity-40 backdrop-blur-lg rounded-lg drop-shadow-lg">
        <TaskEditor
          task={task}
          setEditMode={setEditMode}
          projectData={projectData}
        />
      </div>
    );
  }

  return (
    <div className="h-fit flex flex-col gap-3 px-2 py-4 bg-white bg-opacity-40 backdrop-blur-lg rounded-lg drop-shadow-lg">
      {/*  */}
      {/* Task title */}
      <h1 className={getTaskPriorityStyle(task.priorty)}>{task.name}</h1>
      {/*  */}
      {/* Task description */}
      <p className="h-fit p-2 text-[12px] text-blue-500 font-bold bg-gray-100 rounded">
        <span className="uppercase text-gray-700">Description:</span>{" "}
        {task.description}
      </p>
      {/*  */}
      {/* Task assigned to => ? */}
      <p className="h-fit px-2 py-1 text-[12px] text-black bg-gray-100 rounded">
        <span className="uppercase font-bold text-gray-700">Assigned To: </span>
        <span className="font-bold text-green-800">
          {task.users != null ? task.users.name : ""}
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
            <p
              onClick={() => {
                deleteTask();
                setDropdownOpen(false);
              }}
              className="px-4 py-1 bg-gray-100 hover:brightness-[90%]"
            >
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
            <p
              onClick={() => {
                setTaskAtom({
                  modalOpen: true,
                  task: task,
                });
                setDropdownOpen(false);
              }}
              className="px-4 py-1 bg-gray-100 hover:brightness-[90%]"
            >
              View details
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {/*  */}
      {/* Task labels were removed as they seemed unneccessary */}
    </div>
  );
}
