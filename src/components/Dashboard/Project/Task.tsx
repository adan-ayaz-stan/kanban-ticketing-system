import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useSetRecoilState } from "recoil";
import { Database } from "@/types/supabase";
import { MdSettings } from "react-icons/md";
import { Inter } from "@next/font/google";
import { taskDetailsModalAtom } from "@/atoms/taskDetailsModalAtom";
import { taskEditorModalAtom } from "@/atoms/taskEditorModalAtom";
import { FaRegDotCircle } from "react-icons/fa";

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

const inter = Inter({ subsets: ["latin"], weight: "500" });

export default function Task({ task, projectData }: TaskTypes) {
  const [taskAssignee, setTaskAssignee] = useState({
    name: "",
    image: "",
  });
  const [isShowSettings, setShowSettings] = useState(false);

  const setTaskDetailsAtom = useSetRecoilState(taskDetailsModalAtom);
  const setTaskEditorAtom = useSetRecoilState(taskEditorModalAtom);

  const supabase = useSupabaseClient<Database>();

  async function deleteTask() {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("task_id", task.task_id);
  }

  async function getTaskAssignee() {
    const { data, error } = await supabase
      .from("users")
      .select("name, image")
      .eq("id", task.assigned_to)
      .limit(1)
      .single();

    if (error == null) {
      setTaskAssignee({ name: data.name, image: data.image });
    }
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
  function returnSolidColor(priorty: string) {
    switch (priorty) {
      case "low":
        return "#52b788";

      case "medium":
        return "#ffba08";

      case "high":
        return "#d90429";
    }
  }

  function openEditorForTask() {
    setTaskEditorAtom({
      modalOpen: true,
      task: task,
    });
  }

  useEffect(() => {
    getTaskAssignee();
  }, [task]);

  return (
    <div className="relative">
      <div
        style={{
          background: returnColor(task.priorty),
        }}
        className="h-fit flex flex-col gap-1 px-2 py-2 pt-3 bg-white bg-opacity-40 backdrop-blur-lg rounded-t-md drop-shadow-lg"
      >
        {/* Task priorty */}
        <p className="flex items-center gap-1 p-1 font-semibold text-[12px] bg-white rounded w-fit uppercase">
          <FaRegDotCircle
            size={16}
            style={{
              color: returnSolidColor(task.priorty),
            }}
          />{" "}
          {task.priorty}
        </p>
        {/* Task title */}
        <div
          onClick={() => {
            setTaskDetailsAtom({
              modalOpen: true,
              task: task,
              taskAssignee,
            });
          }}
          className="bg-white py-1 rounded-md cursor-pointer hover:scale-[1.025] transition-all duration-400"
        >
          <h1 style={inter.style} className={"text-[15px] font-bold pl-2"}>
            {task.name}
          </h1>
          <p className="max-w-[200px] text-[12px] font-semibold text-gray-600 pl-2 truncate">
            {task.description}
          </p>
        </div>
        <span className="w-fit flex items-center gap-2 px-2 py-1 text-sm rounded-lg bg-gray-100">
          {taskAssignee.image != "" && (
            <img
              src={taskAssignee.image}
              alt="assignee-profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          )}{" "}
          {taskAssignee.name}
        </span>
      </div>

      {/* Settings icon to enable functions on task */}
      <motion.div
        onClick={() => {
          setShowSettings((value) => !value);
        }}
        style={{
          color: isShowSettings ? "#000000" : "#555555",
        }}
        className="absolute top-0 right-0 flex items-center bg-white p-0.5 pr-1 ring-black hover:ring-gray-300 shadow-xl border-gray-700 rounded-bl-lg rounded-tr-md cursor-pointer transition-all duration-400"
      >
        <MdSettings size={18} /> <span className="text-[12px]">Settings</span>
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
              onClick={openEditorForTask}
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
