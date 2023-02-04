import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Reorder, useDragControls } from "framer-motion";
import { TbGridDots } from "react-icons/tb/index";
import { useQuery } from "react-query";
import Task from "./Task";

interface Props {
  category: String;
  projectData: Object;
}

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

export default function Category({ category, projectData }: Props) {
  const controls = useDragControls();
  const supabase = useSupabaseClient();

  const { isLoading, data, error, refetch, isSuccess } = useQuery(
    `tasks-for-${category}`,
    () =>
      supabase
        .from("tasks")
        .select()
        .filter("project_id", "eq", projectData.project_id)
        .filter("status", "eq", category),
    {
      cacheTime: 5000,
      staleTime: 5000,
    }
  );

  return (
    <Reorder.Item
      value={category}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ cursor: "grab" }}
      className="w-full p-2 border-2 border-dotted border-white rounded shadow-xl backdrop-blur-lg bg-[#ffffff55]"
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
        {isSuccess &&
          data.data.map((ele, ind) => {
            return (
              <Task
                task={ele}
                key={ele.task_id}
                projectData={projectData}
                category={category}
                refetchTasks={refetch}
              />
            );
          })}
      </div>
    </Reorder.Item>
  );
}
