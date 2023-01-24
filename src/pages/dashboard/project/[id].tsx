import FulfilledTasks from "@/components/Dashboard/Project/FulfilledTasks";
import InProgressTask from "@/components/Dashboard/Project/InProgressTasks";
import InProgressTasks from "@/components/Dashboard/Project/InProgressTasks";
import PendingTasks from "@/components/Dashboard/Project/PendingTasks";
import TaskCreator from "@/components/Dashboard/Project/TaskCreator";
import UnassignedTasks from "@/components/Dashboard/Project/UnassignedTasks";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

type pageProps = {
  data: {
    project: {
      name: String;
      created_at: String;
      ownership: String;
    };
    pendingTasks: [
      {
        task_id: String;
        created_at: String;
        name: String;
        description: String;
        assigned_to: String;
        status: String;
        priorty: String;
        due_date: String;
        labels: [];
        report: String;
        project_id: String;
      }
    ];

    inProgressTasks: [
      {
        task_id: String;
        created_at: String;
        name: String;
        description: String;
        assigned_to: String;
        status: String;
        priorty: String;
        due_date: String;
        labels: [];
        report: String;
        project_id: String;
      }
    ];
    fulfilledTasks: [];
  };
};

export default function IndvidualProject({ data }: pageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-pink-500">
      <div className="text-center p-4">
        <h1 className="py-4 text-2xl font-bold text-center">
          {data.project.name}
        </h1>
        <p>
          <span className="font-bold">Creation Date: </span>
          <span className="h-fit px-2 text-sm text-blue-500 font-bold bg-gray-200 rounded">
            {data.project.created_at}
          </span>
        </p>
        <p>
          <span className="font-bold">Ownership: </span>
          <span className="h-fit px-2 text-sm text-blue-500 font-bold bg-gray-200 rounded">
            {data.project.ownership}
          </span>
        </p>
      </div>

      {/* TASK CREATOR */}
      <TaskCreator projectData={data.project} />

      {/* TASKS DIVISION WHERE THEY ARE DIVIDED INTO 3 CATEGORIES */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 auto-rows-auto gap-3 px-3">
        {/* Unassigned Category */}
        {/* <UnassignedTasks />  */}
        {/* Pending Category */}
        <div className="p-2 border-2 border-white rounded-xl shadow-xl backdrop-blur-lg bg-[#ffffff55]">
          <h1 className="w-fit px-2 py-1 mx-auto font-bold text-blue-500 bg-gray-300 rounded-lg">
            Pending Tasks
          </h1>

          <div className="flex flex-col gap-3 p-2 text-blue-900">
            {data.pendingTasks.length == 0 && (
              <p className="text-center font-mono">
                There are no pending tasks.
              </p>
            )}
            {data.pendingTasks.map((ele, ind) => {
              return (
                <PendingTasks
                  pendingTask={ele}
                  key={Math.random() * ind + 15}
                />
              );
            })}
          </div>
        </div>
        {/* InProgress Category */}
        <div className="p-2 border-2 border-white rounded-xl shadow-xl backdrop-blur-lg bg-[#ffffff55]">
          <h1 className="w-fit px-2 py-1 mx-auto font-bold text-blue-500 bg-gray-300 rounded-lg">
            InProgress Tasks
          </h1>

          <div className="flex flex-col gap-3 p-2 text-blue-900">
            {data.inProgressTasks.length == 0 && (
              <p className="text-center font-mono">
                There are no inprogress tasks.
              </p>
            )}
            {data.inProgressTasks.map((ele, ind) => {
              return (
                <InProgressTask
                  inprogressTask={ele}
                  key={Math.random() * ind + 15}
                />
              );
            })}
          </div>
        </div>
        {/* Fulfilled Category */}
        <div className="p-2 border-2 border-white rounded-xl shadow-xl backdrop-blur-lg bg-[#ffffff55]">
          <h1 className="w-fit px-2 py-1 mx-auto font-bold text-blue-500 bg-gray-300 rounded-lg">
            Fulfilled Tasks
          </h1>

          <div className="flex flex-col gap-3 p-2 text-blue-900">
            {data.fulfilledTasks.length == 0 && (
              <p className="text-center font-mono">
                No history of fulfilled tasks present.
              </p>
            )}
            {data.fulfilledTasks.map((ele, ind) => {
              return (
                <FulfilledTasks
                  fulfilledTask={ele}
                  key={Math.random() * ind + 15}
                />
              );
            })}
          </div>
        </div>
        {/*  */}
      </div>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context: { params: { id: number } }) {
  const params = context.params.id;

  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(context);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  // If we have a session

  const project = await supabase
    .from("projects")
    .select()
    .eq("id", params)
    .limit(1);

  if (project.error !== null) {
    return {
      props: {
        data: {
          error: "An issue has occured while fetching the product.",
        },
      },
    };
  }
  // Fetching Tasks
  const pendingTasks = await supabase
    .from("tasks")
    .select()
    .eq("project_id", project.data[0].tasks_id)
    .eq("status", "pending");
  const inProgressTasks = await supabase
    .from("tasks")
    .select()
    .eq("project_id", project.data[0].tasks_id)
    .eq("status", "inprogress");
  const fulfilledTasks = await supabase
    .from("tasks")
    .select()
    .eq("project_id", project.data[0].tasks_id)
    .eq("status", "fulfilled");

  // Pass data to the page via props
  const data = {
    project: project.data[0],
    pendingTasks: pendingTasks.data,
    inProgressTasks: inProgressTasks.data,
    fulfilledTasks: fulfilledTasks.data,
  };

  return { props: { data } };
}
