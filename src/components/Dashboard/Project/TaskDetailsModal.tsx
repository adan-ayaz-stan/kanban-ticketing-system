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
        className="absolute top-[20px] right-[20px] p-2 border-2 border-solid border-gray-800 transition duration-300 ease-in-out bg-transparent text-gray-800 font-bold text-lg hover:bg-black hover:text-white cursor-pointer z-10 rounded"
      >
        Close details
      </button>

      <div className="absolute top-0 left-0 w-full h-full pt-20 pl-32 overflow-y-scroll bg-gray-100 p-6 rounded-lg shadow-lg">
        {/*  */}
        <h2 className="text-2xl font-bold mb-4">Task Details</h2>
        <ul className="list-disc pl-6">
          <li className="mb-2">
            <strong className="text-gray-700">Created At:</strong>{" "}
            {task.created_at}
          </li>
          <li className="mb-2">
            <strong className="text-gray-700">Name:</strong> {task.name}
          </li>
          <li className="mb-2">
            <strong className="text-gray-700">Description:</strong>{" "}
            {task.description}
          </li>
          <li className="mb-2">
            <strong className="text-gray-700">Assigned To:</strong>{" "}
            {task.assigned_to}
          </li>
          <li className="mb-2">
            <strong className="text-gray-700">Status:</strong> {task.status}
          </li>
          <li className="mb-2">
            <strong className="text-gray-700">Priority:</strong> {task.priority}
          </li>
          <li className="mb-2">
            <strong className="text-gray-700">Due Date:</strong> {task.due_date}
          </li>
          <li>
            <strong className="text-gray-700">Report:</strong> {task.report}
          </li>
        </ul>
        This page needs work. I'm busy with something else rn.
      </div>
    </motion.div>
  );
}
