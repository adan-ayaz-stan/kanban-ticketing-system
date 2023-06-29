import { projectInfoModalAtom } from "@/atoms/projectInfoModalAtom";
import Heading from "@/components/Layout/Heading";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function ProjectInfoModal({ project }) {
  const setProjectModalAtom = useSetRecoilState(projectInfoModalAtom);

  function closeProjectModal() {
    setProjectModalAtom({
      modalOpen: false,
      project: {},
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#fefefe] bg-opacity-80  z-50"
    >
      <div className="w-[90vw] md:w-2/3 lg:w-1/2 flex flex-col gap-2 p-3 shadow-lg bg-white rounded-lg">
        <div className="flex justify-between items-center">
          <Heading className={"text-xl underline"}>Information</Heading>
          <MdClose
            size={28}
            className="p-1 rounded hover:bg-gray-300 cursor-pointer"
            onClick={closeProjectModal}
          />
        </div>

        <h1 className="text-semibold">{project.name}</h1>
        <p className="text-sm text-gray-700">{project.description}</p>
      </div>
    </motion.div>
  );
}
