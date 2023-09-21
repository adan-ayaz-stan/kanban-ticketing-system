import { Barlow, Rubik, Sen } from "@next/font/google";
import { useState } from "react";
import User from "../SidebarFlowbite/User";
import AddMemberToProject from "./AddMemberToProject";
import RemoveCategory from "./RemoveCategory";
import TaskCreator from "./TaskCreator";
import { TbInfoCircle } from "react-icons/tb";
import { FaInfoCircle } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import { projectInfoModalAtom } from "@/atoms/projectInfoModalAtom";

const rubik = Rubik({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700", "800"],
});
const sen = Sen({ subsets: ["latin"], weight: ["400", "700", "800"] });

export default function NavigationBar({ projectData, user }) {
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);
  const [isRemoveCategoryModalOpen, setRemoveCategoryModalOpen] =
    useState(false);

  const setProjectInfoModal = useSetRecoilState(projectInfoModalAtom);

  function openProjectInfo() {
    setProjectInfoModal({
      project: projectData,
      modalOpen: true,
    });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-3 mt-2 ml-2 mr-2 sm:mr-0 mb-4 text-white bg-[url('https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fgetwallpapers.com%2Fwallpaper%2Ffull%2F6%2F5%2F5%2F751756-vertical-hd-texture-backgrounds-2560x1440.jpg&f=1&nofb=1&ipt=75c3e1bf8f244e55f528ec2be332fe7891a63f307646155992f11d19ab95c9f6&ipo=images')] bg-cover bg-center rounded-l-xl rounded-r-xl sm:rounded-r-none">
      {/* Project details */}
      <h2
        className={`${rubik.className} flex items-center gap-1 font-medium text-white text-2xl`}
      >
        {projectData.name}{" "}
        <FaInfoCircle
          title="Project Information"
          onClick={openProjectInfo}
          className="hover:opacity-80 transition-all duration-400 cursor-pointer"
        />
      </h2>

      {/* Project Functions */}
      {/* Only available if user is the project admin */}
      {projectData.owner_id == user.id ? (
        <div className="flex flex-col sm:flex-row gap-3 mx-auto sm:mx-0 sm:ml-auto">
          {/*  */}
          <button
            onClick={() => setTaskModalOpen(true)}
            className="text-gray-900 bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-semibold rounded text-sm px-5 py-2.5 focus:outline-none"
          >
            Create Task
          </button>
          {/* Modal */}
          {isTaskModalOpen && (
            <div
              onClick={() => setTaskModalOpen(false)}
              className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] backdrop-blur-sm"
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
            className="text-gray-900 bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-semibold rounded text-sm px-5 py-2.5 focus:outline-none"
          >
            Add Member
          </button>

          {/* Modal */}
          {isMemberModalOpen && (
            <div
              onClick={() => setMemberModalOpen(false)}
              className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] backdrop-blur-sm"
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
            className="text-gray-900 bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-semibold rounded text-sm px-5 py-2.5 focus:outline-none"
          >
            Remove Category
          </button>
          {/* Modal */}
          {isRemoveCategoryModalOpen && (
            <div
              onClick={() => setRemoveCategoryModalOpen(false)}
              className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] backdrop-blur-sm"
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

      {projectData.owner_id != user.id ? (
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
