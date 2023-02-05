import { Barlow } from "@next/font/google";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import Select from "react-select";

const barlow = Barlow({ subsets: ["latin"], weight: "700" });

export default function RemoveCategory({ projectData, setModalOpen }) {
  const [processing, setProcessing] = useState(false);

  const supabase = useSupabaseClient();
  const router = useRouter();

  const options = projectData.task_categories.map((ele, ind) => {
    return { label: `${ele}`.toUpperCase(), value: ele };
  });
  const [optionValue, setOptionValue] = useState(options[0]);

  async function removeCategoryFromProject() {
    setProcessing(true);

    const oldCategories: string[] = projectData.task_categories;
    const indexOfChosenCategory = oldCategories.indexOf(optionValue.value);
    oldCategories.splice(indexOfChosenCategory, 1);

    const { error } = await supabase
      .from("projects")
      .update({
        task_categories: oldCategories,
      })
      .eq("project_id", projectData.project_id);

    if (error == null) {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("status", optionValue.value)
        .eq("project_id", projectData.project_id);

      if (error == null) {
        router.reload();
      }
    } else {
      setProcessing(false);
    }
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col p-4 text-black bg-white rounded-lg"
    >
      <h1
        className="w-fit mx-auto my-2 font-bold text-xl text-gray-800 uppercase"
        style={barlow.style}
      >
        Select category to remove
      </h1>

      <Select
        defaultValue={options[0]}
        options={options}
        className="min-w-[260px] mt-1 mb-2"
        onChange={(value) => setOptionValue(value)}
      />

      <button
        onClick={removeCategoryFromProject}
        className="w-fit mx-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 my-2 disabled:bg-gray-500"
        disabled={processing}
      >
        Remove Category
      </button>
    </div>
  );
}
