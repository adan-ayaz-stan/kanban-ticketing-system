import { useFormik } from "formik";
import { AnimatePresence, Reorder } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";

import Category from "@/components/Dashboard/Project/Category";
import NavigationBar from "@/components/Dashboard/Project/NavigationBar";
import Sidebar from "@/components/Dashboard/Sidebar";
import TaskDetailsModal from "@/components/Dashboard/Project/TaskDetailsModal";

import { taskDetailsModalAtom } from "../../../atoms/taskDetailsModalAtom";
import { taskEditorModalAtom } from "@/atoms/taskEditorModalAtom";

import { Project, User } from "@/types/types";
import { BiCoinStack } from "react-icons/bi";
import { useRecoilValue } from "recoil";
import TaskEditor from "@/components/Dashboard/Project/TaskEditor";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { projectInfoModalAtom } from "@/atoms/projectInfoModalAtom";
import ProjectInfoModal from "@/components/Dashboard/Project/ProjectInfoModal";
import { Rubik, Sen } from "@next/font/google";

type pageProps = {
  project: Project;
  user: User;
};

const rubik = Rubik({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700", "800"],
});
const sen = Sen({ subsets: ["latin"], weight: ["400", "700", "800"] });

export default function IndvidualProject({ project, user }: pageProps) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const projectInfoAtom = useRecoilValue(projectInfoModalAtom);
  const taskDetailsAtom = useRecoilValue(taskDetailsModalAtom);
  const taskEditorAtom = useRecoilValue(taskEditorModalAtom);

  const [items, setItems] = useState(project.task_categories);
  const [tasks, setTasks] = useState([]);

  const [processing, setProcessing] = useState(false);
  const [isCreateCategoryModalOpen, setCreateCategoryModalOpen] =
    useState(false);

  // Validation for form below
  const validate = (values: { category_name: string }) => {
    const errors: { category_name: any } = { category_name: null };

    if (!/^(\w+\s)*\w+$/.test(values.category_name)) {
      errors.category_name =
        "Name must be alphanumeric. Only a single space is allowed.";
    }

    return errors;
  };

  // Form for creating category
  const formik = useFormik({
    initialValues: {
      category_name: "",
    },
    // validate,
    // validateOnBlur: false,
    onSubmit: async (values) => {
      setProcessing(true);

      const newCategory = `${values.category_name}`.toLowerCase();

      const newCategories = [...project["task_categories"], newCategory];

      const { error } = await supabase
        .from("projects")
        .update({
          task_categories: newCategories,
        })
        .eq("project_id", project.project_id);

      if (error == null) {
        setCreateCategoryModalOpen(false);
        router.reload();
      }

      console.log(error);
      setProcessing(false);
    },
  });

  // Get tasks function
  async function getTasksForProjects() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*, users!tasks_assigned_to_fkey(name)")
      .eq("project_id", project.project_id);

    if (error == null) {
      setTasks(data);
    }
  }

  useEffect(() => {
    getTasksForProjects();
  }, []);

  useEffect(() => {
    // Setting up the subscription
    const channel = supabase
      .channel("realtime tasks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${project.project_id}`,
        },
        (payload) => {
          // Adding the task to the existing array of tasks

          // If incase task editing occurs, we will remove that respective task from the array and add the new payload to the array
          console.log(payload);

          if (payload.eventType == "DELETE") {
            setTasks((tasksPrev) => {
              const filteredArray = tasksPrev.filter(
                (ele) => ele.task_id != payload.old.task_id
              );

              return filteredArray;
            });
          }

          if (payload.eventType == "UPDATE") {
            setTasks((tasksPrev) => {
              //
              const filteredArray = tasksPrev.filter(
                (ele, ind) => ele.task_id != payload.new.task_id
              );

              const newObject = {
                ...payload.new,
                users: {
                  name: user.user_metadata.name,
                },
              };

              return [newObject, ...filteredArray];
            });
          }

          if (payload.eventType == "INSERT") {
            setTasks((tasksPrev) => {
              return [payload.new, ...tasksPrev];
            });
          }
        }
      )
      .subscribe((status, err) => {
        console.log(status, err);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, project.project_id]);

  return (
    <div style={sen.style} className="min-h-screen h-fit pb-24 bg-white">
      <Head>
        <title>{project.name}</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AnimatePresence>
        {projectInfoAtom.modalOpen && (
          <ProjectInfoModal project={projectInfoAtom.project} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {taskDetailsAtom.modalOpen && (
          <TaskDetailsModal
            task={taskDetailsAtom.task}
            taskAssignee={taskDetailsAtom.taskAssignee}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {taskEditorAtom.modalOpen && (
          <TaskEditor task={taskEditorAtom.task} projectData={project} />
        )}
      </AnimatePresence>

      <Sidebar />
      <div className="relative sm:ml-16">
        <NavigationBar projectData={project} user={user} />

        {/* TASKS DIVISION WHERE THEY ARE DIVIDED INTO CATEGORIES According To types of tasks */}

        <Reorder.Group
          axis="x"
          values={items}
          onReorder={setItems}
          className="min-h-[80vh] flex flex-row gap-3 px-6 py-4 pb-20 overflow-x overflow-scroll"
        >
          {items.map((item, ind) => {
            const tasksForCategory = tasks.filter(
              (ele) => `${ele.status}`.toLowerCase() == item.toLowerCase()
            );

            return (
              <Category
                category={item}
                tasks={tasksForCategory}
                projectData={project}
                key={item}
              />
            );
          })}

          <div
            onClick={() => setCreateCategoryModalOpen(true)}
            className="min-w-[250px] w-full p-2 border-2 border-dotted border-gray-400 rounded shadow-xl backdrop-blur-lg bg-[#white] hover:bg-gray-200 cursor-pointer"
          >
            <h1 className="w-fit px-2 py-1 mx-auto font-bold text-gray-500">
              Add Category
            </h1>
          </div>
        </Reorder.Group>
      </div>

      {/* Create Category Modal */}

      {isCreateCategoryModalOpen && (
        <div
          onClick={() => setCreateCategoryModalOpen(false)}
          className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center z-[9999] bg-black bg-opacity-60"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={formik.handleSubmit}
            className="w-11/12 md:w-8/12 lg:w-6/12 xl:w-4/12 p-4 flex flex-col gap-3 text-gray-800 bg-white rounded"
          >
            <div>
              <label className="block font-semibold">
                Name of the category to add
              </label>
              <input
                name="category_name"
                type={"text"}
                minLength={2}
                maxLength={16}
                onChange={formik.handleChange}
                className="w-full p-2 bg-gray-200 rounded outline-none"
                required
              />
              {formik.errors.category_name && (
                <p className="text-sm pt-2 text-red-600">
                  <BiCoinStack className="inline" />{" "}
                  {formik.errors.category_name}
                </p>
              )}
            </div>

            <button
              onClick={() => console.log("click")}
              type="submit"
              className="p-2 font-bold text-white bg-[#0a0704] disabled:bg-gray-600 rounded"
            >
              Create Column
            </button>

            <p className="text-[12px]">
              Previously, I had validations all over the place including the
              category creator. Considering that it just gets annoying just to
              satisfy the conditions, I have removed validation. Therefore, it
              is requested to be lenient with entering category names. Try to
              keep em short, thanks!
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context: any) {
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
  return { props: { project: project.data[0], user: session.user } };
}
