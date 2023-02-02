import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import Select from "react-select";

type TaskEditor = {
  task: {
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
  };
  setEditMode: any;
  projectData: Object;
};

export default function TaskEditor({
  task,
  setEditMode,
  projectData,
  refetchTasks,
  refetchUserForTask,
  category,
}: TaskEditor) {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const { isLoading, isSuccess, data, error, refetch } = useQuery(
    `assign-options-for-tasks-project-${projectData.project_id}`,
    () =>
      supabase
        .from("project_members")
        .select()
        .eq("project_id", projectData.project_id),
    {
      cacheTime: 6000,
      staleTime: 6000,
    }
  );

  const assignOptions = isSuccess
    ? data.data.map((ele, ind) => {
        return { label: ele.user_name, value: ele.user_id };
      })
    : [];

  const statusOptions = projectData.task_categories.map((ele, ind) => {
    return { value: ele, label: `${ele}`.toUpperCase() };
  });

  const priortyOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  const [assignTo, setAssignTo] = useState(assignOptions[0]);
  const [statusTo, setStatusTo] = useState(statusOptions[0]);
  const [priortyTo, setPriortyTo] = useState(priortyOptions[0]);

  const [processing, setProcessing] = useState(false);

  const validate = (values) => {
    const errors = {};

    if (values.name.length == 0) {
      errors.name = "Task name cannot be empty.";
    }
    if (values.name.length > 16) {
      errors.name = "Task name cannot exceed 16 characters.";
    }

    if (values.description.length == 0) {
      errors.description == "Task description cannot be blank.";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: task.name,
      description: task.description,
    },
    validate,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setProcessing(true);
      const { error } = await supabase
        .from("tasks")
        .update({
          name: values.name,
          description: values.description,
          assigned_to: assignTo != undefined ? assignTo.value : null,
          status: statusTo.value,
          priorty: priortyTo.value,
        })
        .eq("task_id", task.task_id);

      if (error == null) {
        if (category == statusTo.value) {
          refetchTasks();
          refetchUserForTask();
        } else {
          router.reload();
        }
        setEditMode(false);
      }
      setProcessing(false);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-2 text-sm"
    >
      <div>
        <label className="block font-semibold">Task Name</label>
        <input
          name="name"
          type={"text"}
          className="w-full px-2 py-1 rounded"
          defaultValue={task.name}
          onChange={formik.handleChange}
        />
        {formik.errors.name && (
          <p className="px-2 py-1 text-[12px] text-red-600">
            {formik.errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block font-semibold">Task Description</label>
        <textarea
          name="description"
          rows={2}
          className="w-full px-2 py-1 rounded resize-y"
          defaultValue={task.description}
          onChange={formik.handleChange}
        />
        {formik.errors.description && (
          <p className="px-2 py-1 text-[12px] text-red-600">
            {formik.errors.description}
          </p>
        )}
      </div>

      <div>
        <label className="block font-semibold">Assign To</label>
        <Select
          options={assignOptions}
          defaultValue={assignOptions[0]}
          onChange={(value) => setAssignTo(value)}
        />
      </div>

      <div>
        <label className="block font-semibold">Change Status To</label>
        <Select
          options={statusOptions}
          defaultValue={statusOptions[0]}
          onChange={(value) => setStatusTo(value)}
        />
      </div>

      <div>
        <label className="block font-semibold">Change Priorty To</label>
        <Select
          options={priortyOptions}
          defaultValue={priortyOptions[0]}
          onChange={(value) => setPriortyTo(value)}
        />
      </div>

      <div className="flex flex-row gap-3 justify-end">
        <button
          onClick={() => setEditMode(false)}
          className="px-2 py-1 font-bold text-white bg-red-700 disabled:bg-gray-600 rounded"
          disabled={processing}
        >
          Discard
        </button>
        <button
          type="submit"
          className="px-2 py-1 font-bold text-white bg-green-700 disabled:bg-gray-600 rounded"
          disabled={processing}
        >
          Save
        </button>
      </div>
    </form>
  );
}
