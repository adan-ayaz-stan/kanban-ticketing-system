import { useState } from "react";
import AddMemberToProject from "./AddMemberToProject";
import RemoveCategory from "./RemoveCategory";
import TaskCreator from "./TaskCreator";

export default function NavigationBar({ projectData }) {
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);
  const [isRemoveCategoryModalOpen, setRemoveCategoryModalOpen] =
    useState(false);

  return (
    <div className="flex flex-row gap-3 p-3 mb-4 text-white bg-[#1a120b]">
      {/* Project details */}
      <h1 className="text-white text-2xl">{projectData.name}</h1>

      {/* Project Functions */}

      <div className="flex flex-row gap-3 ml-auto">
        {/*  */}
        <button
          onClick={() => setTaskModalOpen(true)}
          className="px-2 py-1 font-semibold rounded text-gray-800 bg-[#d5cea3] hover:brightness-[80%]"
        >
          Create Task
        </button>
        {/* Modal */}
        {isTaskModalOpen && (
          <div
            onClick={() => setTaskModalOpen(false)}
            className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-60 z-[9999]"
          >
            <TaskCreator
              projectData={projectData}
              setModalOpen={setTaskModalOpen}
            />
          </div>
        )}

        {/* Add member to project */}
        <button
          onClick={() => setMemberModalOpen(true)}
          className="px-2 py-1 font-semibold rounded text-gray-800 bg-[#d5cea3] hover:brightness-[80%]"
        >
          Add Member
        </button>
        {/* Modal */}
        {isMemberModalOpen && (
          <div
            onClick={() => setMemberModalOpen(false)}
            className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-60 z-[9999]"
          >
            <AddMemberToProject
              projectData={projectData}
              setModalOpen={setMemberModalOpen}
            />
          </div>
        )}

        {/* Remove a category from project */}
        <button
          onClick={() => setRemoveCategoryModalOpen(true)}
          className="px-2 py-1 font-semibold rounded text-gray-800 bg-[#d5cea3] hover:brightness-[80%]"
        >
          Remove Category
        </button>
         {/* Modal */}
         {isRemoveCategoryModalOpen && (
          <div
            onClick={() => setRemoveCategoryModalOpen(false)}
            className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-60 z-[9999]"
          >
            <RemoveCategory
            projectData={projectData}
            setModalOpen={setRemoveCategoryModalOpen}
             />
          </div>
        )}
      </div>
    </div>
  );
}
