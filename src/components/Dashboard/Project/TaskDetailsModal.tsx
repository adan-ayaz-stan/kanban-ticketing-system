import { taskDetailsModalAtom } from "@/atoms/taskDetailsModalAtom";
import { Inter } from "@next/font/google";
import { motion } from "framer-motion";
import { useSetRecoilState } from "recoil";

import { FaRegDotCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function TaskDetailsModal({ task, taskAssignee }) {
  const setTaskAtom = useSetRecoilState(taskDetailsModalAtom);

  const [taskDate, setTaskDate] = useState("");

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

  function closeTaskModal() {
    setTaskAtom({ modalOpen: false, task: {}, taskAssignee: {} })
  }

  useEffect(() => {
    const dateString = task.created_at;
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const simpleDateTime = date.toLocaleString(undefined, options);
    setTaskDate(simpleDateTime);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm"
    >
      {/* Close Icon */}
      <button
        onClick={() => closeTaskModal()}
        className="absolute top-[20px] right-[20px] p-2 border-2 border-solid border-gray-800 transition duration-300 ease-in-out text-black font-bold text-lg hover:bg-black hover:text-white cursor-pointer z-10 rounded bg-gray-200"
      >
        Close details
      </button>

      <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center md:pt-20 md:pl-32 overflow-y-scroll bg-black bg-opacity-10 p-6 rounded-lg shadow-lg">
        {/*  */}
        <div className="container flex flex-col w-full max-w-lg p-6 mx-auto divide-y rounded-md divide-gray-700 bg-white">
          <div className="flex justify-between p-4">
            <div>
              <h4 className="leading-[1em] font-medium">{task.name}</h4>
              <span className="text-xs dark:text-gray-400">{taskDate}</span>
            </div>

            <div>
              <p
                style={{
                  borderColor: returnSolidColor(task.priorty),
                }}
                className="flex items-center gap-1 p-1 font-semibold text-[12px] bg-white rounded w-fit uppercase border-2"
              >
                <FaRegDotCircle
                  size={16}
                  style={{
                    color: returnSolidColor(task.priorty),
                  }}
                />{" "}
                {task.priorty} {"PRIORTY"}
              </p>
            </div>
          </div>
          <div className="p-4 space-y-2 text-sm dark:text-gray-400">
            <p className="flex flex-col ring-1 ring-gray-600 rounded">
              <span className="text-[14px] text-gray-800 lowercase font-mono border-b-[1px] border-gray-800 rounded-t px-2 pt-1">
                Task Description:{" "}
              </span>{" "}
              <pre
                style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                className="p-2 pb-5 overflow-auto text-black"
              >
                {task.description}
              </pre>
            </p>
            <p className="flex flex-col ring-1 ring-gray-600 rounded">
              <span className="text-[14px] text-gray-800 lowercase font-mono border-b-[1px] border-gray-800 rounded-t px-2 pt-1">
                Task Assigned To:{" "}
              </span>{" "}
              <span className="w-fit flex items-center gap-2 px-2 py-1 my-2 mx-2 text-sm rounded-lg text-black bg-gray-100">
                {taskAssignee.image != "" && (
                  <img
                    src={taskAssignee.image}
                    alt="assignee-profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}{" "}
                {taskAssignee.name}
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
