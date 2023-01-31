import Category from "@/components/Dashboard/Project/Category";
import NavigationBar from "@/components/Dashboard/Project/NavigationBar";
import Sidebar from "@/components/Dashboard/Sidebar";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  AnimatePresence,
  motion,
  Reorder,
  useDragControls,
} from "framer-motion";
import { useState } from "react";

type pageProps = {
  project: {
    project_id: String;
    name: String;
    created_at: String;
    ownership: String;
    task_categories: String[];
  };
};

export default function IndvidualProject({ project }: pageProps) {
  const [items, setItems] = useState(project.task_categories);

  return (
    <div className="min-h-screen bg-[#D5CEA3]">
      <Sidebar />
      <div className="relative sm:ml-16">
        <NavigationBar projectData={project} />

        {/* TASKS DIVISION WHERE THEY ARE DIVIDED INTO CATEGORIES According To types of tasks */}

        <Reorder.Group
          axis="x"
          values={items}
          onReorder={setItems}
          className="flex flex-row gap-3"
        >
          {items.map((item, ind) => {
            return <Category data={item} key={item} />;
          })}

          <div className="w-full p-2 border-2 border-dotted border-white rounded shadow-xl backdrop-blur-lg bg-[#ffffff55] cursor-pointer ">
            <h1 className="w-fit px-2 py-1 mx-auto font-bold text-[#1A120B]">
              Add Category
            </h1>
          </div>
        </Reorder.Group>
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

  // Fetching project
  const project = await supabase
    .from("projects")
    .select()
    .eq("project_id", params)
    .limit(1);

  if (project.data?.length == 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { project: project.data[0] } };
}
