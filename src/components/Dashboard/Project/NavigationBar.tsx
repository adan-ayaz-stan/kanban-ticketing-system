import { Barlow } from "@next/font/google";
import { useState } from "react";
import User from "../SidebarFlowbite/User";
import AddMemberToProject from "./AddMemberToProject";
import RemoveCategory from "./RemoveCategory";
import TaskCreator from "./TaskCreator";

const barlow = Barlow({ subsets: ["latin"], weight: "700" });

export default function NavigationBar({ projectData, user }) {
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);
  const [isRemoveCategoryModalOpen, setRemoveCategoryModalOpen] =
    useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-3 mt-2 ml-2 mr-2 sm:mr-0 mb-4 text-white bg-gray-900 rounded-l-xl rounded-r-xl sm:rounded-r-none">
      {/* Project details */}
      <h2 className={`${barlow.className} text-white text-2xl`}>
        {projectData.name}
      </h2>

      {/* Project Functions */}
      {/* Only available if user is the project admin */}
      {projectData.ownership == user.id ? (
        <div className="flex flex-row gap-3 mx-auto sm:mx-0 sm:ml-auto">
          {/*  */}
          <button
            onClick={() => setTaskModalOpen(true)}
            className="text-gray-900 bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 focus:outline-none"
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
            className="text-gray-900 bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 focus:outline-none"
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
            className="text-gray-900 bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 focus:outline-none"
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
      ) : (
        ""
      )}

      {projectData.ownership != user.id ? (
        <div className="flex flex-row gap-3 mx-auto sm:mx-0 sm:ml-auto">
          {/*  */}
          <button
            onClick={() => setTaskModalOpen(true)}
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
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
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
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
      ) : (
        ""
      )}

      <div className="relative sm:ml-auto">
        <User user={user} />
      </div>
    </div>
  );
}
