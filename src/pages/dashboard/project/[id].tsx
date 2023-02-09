import { useFormik } from "formik";
import { Reorder } from "framer-motion";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import Category from "@/components/Dashboard/Project/Category";
import NavigationBar from "@/components/Dashboard/Project/NavigationBar";
import Sidebar from "@/components/Dashboard/Sidebar";

import { Project, User } from "@/types/types";
import { BiCoinStack } from "react-icons/bi";

type pageProps = {
  project: Project;
  user: User;
};

export default function IndvidualProject({ project, user }: pageProps) {
  console.log(project);
  const router = useRouter();
  const supabase = useSupabaseClient();

  const [items, setItems] = useState(project.task_categories);

  const [processing, setProcessing] = useState(false);
  const [isCreateCategoryModalOpen, setCreateCategoryModalOpen] =
    useState(false);

  const validate = (values: { category_name: string }) => {
    const errors: { category_name: any } = { category_name: null };

    if (!/^(\w+\s)*\w+$/.test(values.category_name)) {
      errors.category_name =
        "Name must be alphanumeric. Only a single space is allowed.";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      category_name: "",
    },
    validate,
    validateOnBlur: false,
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
      setProcessing(false);
    },
  });

  return (
    <div className="min-h-screen h-fit pb-24 bg-[#FFF2F2]">
      <Head>
        <title>{project.name}</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
      <div className="relative sm:ml-16">
        <NavigationBar projectData={project} user={user} />

        {/* TASKS DIVISION WHERE THEY ARE DIVIDED INTO CATEGORIES According To types of tasks */}

        <Reorder.Group
          axis="x"
          values={items}
          onReorder={setItems}
          className="min-h-[50vh] flex flex-row gap-3 px-6 py-4 overflow-x overflow-scroll"
        >
          {items.map((item, ind) => {
            return (
              <Category category={item} projectData={project} key={item} />
            );
          })}

          <div
            onClick={() => setCreateCategoryModalOpen(true)}
            className="w-full p-2 border-2 border-dotted border-gray-400 rounded shadow-xl backdrop-blur-lg bg-[#white] hover:bg-gray-200 cursor-pointer"
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
                className="w-full p-2 bg-gray-200 rounded"
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
              type="submit"
              className="p-2 font-bold text-white bg-[#0a0704] disabled:bg-gray-600 rounded"
              disabled={processing}
            >
              Create Column
            </button>
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
