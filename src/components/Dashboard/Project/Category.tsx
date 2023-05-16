import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Reorder, useDragControls } from "framer-motion";
import { TbGridDots } from "react-icons/tb/index";
import { useQuery } from "react-query";
import Task from "./Task";

interface TaskTypes {
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
}

interface Props {
  category: String;
  projectData: Object;
  tasks: TaskTypes[];
}

export default function Category({ category, projectData, tasks }: Props) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={category}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ cursor: "grab" }}
      className="min-w-[20em] w-full p-2 border-2 border-dotted border-white rounded shadow-xl backdrop-blur-lg bg-[#eeeeee55]"
    >
      <div className="flex justify-center items-center">
        <h1 className="w-fit px-2 py-1 mx-auto font-bold text-[#1A120B] uppercase bg-gray-200 rounded">
          {category}
        </h1>
        <span
          onPointerDown={(e) => controls.start(e)}
          className="cursor-pointer"
        >
          <TbGridDots />
        </span>
      </div>

      <div className="flex flex-col gap-3 py-3">
        {tasks.map((ele, ind) => {
          return (
            <Task task={ele} key={ele.task_id} projectData={projectData} />
          );
        })}

        {tasks.length == 0 ? (
          <p className="text-sm text-center text-gray-700">
            Tasks will appear here.
          </p>
        ) : (
          ""
        )}
      </div>
    </Reorder.Item>
  );
}
