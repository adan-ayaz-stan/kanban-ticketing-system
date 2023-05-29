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

  function returnColor(priorty: string) {
    switch (priorty) {
      case "low":
        return "linear-gradient(to right, #56ab2f, #a8e063)";

      case "medium":
        return "linear-gradient(to right, #fdc830, #f37335)";

      case "high":
        return "linear-gradient(to right, #c31432, #240b36)";
    }
  }

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
    <div
      style={{
        background: returnColor(task.priorty),
      }}
      className="h-fit flex flex-col gap-3 px-2 py-4 bg-white bg-opacity-40 backdrop-blur-lg rounded-lg drop-shadow-lg"
    >
      {/*  */}
      {/* Task title */}
      <h1
        style={{ color: task.priorty == "high" && "white" }}
        className={"text-lg pl-4"}
      >
        {task.name}
      </h1>
      {/*  */}
      {/*  */}

      {/* Task Functions */}
      <div
        onClick={() => setDropdownOpen(true)}
        style={{ color: task.priorty == "high" && "white" }}
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
