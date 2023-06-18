import { taskDetailsModalAtom } from "@/atoms/taskDetailsModalAtom";
import { motion } from "framer-motion";
import { useSetRecoilState } from "recoil";

export default function TaskDetailsModal({ task }) {
  const setTaskAtom = useSetRecoilState(taskDetailsModalAtom);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#fefefe] bg-opacity-80  z-50"
    >
      {/* Close Icon */}
      <button
        onClick={() => setTaskAtom({ modalOpen: false, task: {} })}
        className="absolute top-[20px] right-[20px] p-2 border-2 border-solid border-gray-800 transition duration-300 ease-in-out bg-transparent text-white font-bold text-lg hover:bg-black hover:text-white cursor-pointer z-10 rounded bg-gray-800"
      >
        Close details
      </button>

      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center md:pt-20 md:pl-32 overflow-y-scroll bg-black bg-opacity-10 p-6 rounded-lg shadow-lg">
        {/*  */}
        <div className="container flex flex-col w-full max-w-lg p-6 mx-auto divide-y rounded-md divide-gray-700 bg-white">
          <div className="flex justify-between p-4">
            <div className="flex space-x-4">
              <div>
                <h4 className="font-bold">{task.name}</h4>
                <span className="text-xs dark:text-gray-400">
                  {task.created_at}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-2 text-sm dark:text-gray-400">
            <p>
              <span className="font-bold">Task Description: </span>{" "}
              {task.description}
            </p>
            <p>
              <span className="font-bold">Task status: </span>{" "}
              <span>{task.status}</span>
            </p>
            <p>
              <span className="font-bold">Task Assigned To: </span>{" "}
              <span>{task.users?.name}</span>
            </p>
            <p>
              <span className="font-bold">Task priorty: </span>{" "}
              <span>{task.priority}</span>
            </p>
            <p>
              <span className="font-bold">Task Due Date: </span>{" "}
              <span>{task.due_date}</span>
            </p>
            <p>
              <span className="font-bold">Task report: </span>{" "}
              <span>{task.report}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
