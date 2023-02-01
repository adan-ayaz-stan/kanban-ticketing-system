import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import Select from "react-select";

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
      router.reload();
    } else {
      setProcessing(false);
    }
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col p-4 text-black bg-white rounded"
    >
      <h2 className="text-black" style={{ fontFamily: "Sen, sans-serif" }}>
        Select category to remove
      </h2>

      <Select
        defaultValue={options[0]}
        options={options}
        className="min-w-[260px] mt-1 mb-2"
        onChange={(value) => setOptionValue(value)}
      />

      <button
        onClick={removeCategoryFromProject}
        className="w-fit mx-auto p-2 font-bold text-white hover:text-[#1a120b] disabled:text-gray-800 bg-[#1a120b] hover:bg-[#d5cea3] disabled:bg-gray-500 rounded transition-all duration-400"
        disabled={processing}
      >
        Remove Category
      </button>
    </div>
  );
}
