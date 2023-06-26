import { taskDetailsModalAtom } from "@/atoms/taskDetailsModalAtom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiDotsVerticalRounded, BiEdit, BiTrash } from "react-icons/bi";
import { useSetRecoilState } from "recoil";
import TaskEditor from "./TaskEditor";
import { Database } from "@/types/supabase";
import { MdSettings } from "react-icons/md";

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
  const [isShowSettings, setShowSettings] = useState(false);

  const setTaskAtom = useSetRecoilState(taskDetailsModalAtom);

  const supabase = useSupabaseClient<Database>();

  async function deleteTask() {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("task_id", task.task_id);
  }

  console.log(task);

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
    <div className="relative">
      <div
        style={{
          background: returnColor(task.priorty),
        }}
        className="h-fit flex flex-col gap-1 px-2 py-2 pt-7 bg-white bg-opacity-40 backdrop-blur-lg rounded-t-md drop-shadow-lg"
      >
        {/*  */}
        {/* Task title */}
        <div
          onClick={() => {
            setTaskAtom({
              modalOpen: true,
              task: task,
            });
          }}
          className="bg-white py-1 rounded-md cursor-pointer"
        >
          <h1 className={"text-[15px] font-bold pl-2"}>{task.name}</h1>
          <p className="text-[14px] pl-2 truncate">{task.description}</p>
        </div>
        <span className="w-fit px-2 py-1 text-sm rounded-lg bg-gray-100">
          {task.users?.name == undefined ? "Not assigned" : task.users.name}
        </span>
      </div>

      {/* Settings icon to enable functions on task */}
      <motion.div
        onClick={() => {
          setShowSettings((value) => !value);
        }}
        animate={{
          scale: isShowSettings ? 1.1 : 1,
        }}
        className="absolute top-0 right-0 text-gray-700 bg-white p-0.5 ring-black hover:ring-gray-300 shadow-xl border-gray-700 rounded-bl-lg rounded-tr-md cursor-pointer"
      >
        <MdSettings size={18} />
      </motion.div>

      {/* Functions on task */}
      {isShowSettings && (
        <AnimatePresence>
          <motion.div
            initial={{
              top: "90%",
              opacity: 0,
            }}
            animate={{ top: "100%", opacity: 1 }}
            exit={{
              top: "90%",
              opacity: 0,
            }}
            className="absolute top-full right-0 w-full flex justify-between items-center"
          >
            {/* Task editor */}
            <div
              onClick={() => {
                setEditMode(true);
              }}
              className="w-fit group flex gap-1 items-center bg-blue-500 pl-1.5 p-0.5 text-gray-100 cursor-pointer rounded-b-md hover:px-1.5"
            >
              <BiEdit size={18} />
              <span className="max-w-[0px] max-h-[15px] text-[10px] overflow-hidden group-hover:max-w-[100px] font-bold transition-all duration-700 ease-out">
                Edit task
              </span>
            </div>
            {/* Task deletor */}
            <div
              onClick={(e) => {
                deleteTask();
              }}
              className="w-fit group flex gap-1 items-center bg-red-500 pl-1.5 p-0.5 text-gray-100 cursor-pointer rounded-b-md hover:px-1.5"
            >
              <BiTrash size={18} />
              <span className="max-w-[0px] max-h-[15px] text-[10px] overflow-hidden group-hover:max-w-[100px] font-bold transition-all duration-700 ease-out">
                Delete task
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
