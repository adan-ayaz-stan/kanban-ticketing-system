import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ProjectOverview from "./ProjectOverview";

export default function OwnedProjects({ isLoading, data, error }) {
  return (
    <div className="mx-2 p-2 rounded-xl shadow-xl backdrop-blur-lg bg-[#ffffff55]">
      <h1 className="p-2 mb-2 text-center rounded-t-xl rounded-b-md text-green-700 bg-white text-xl font-bold uppercase">
        Projects you have created
      </h1>

      <AnimatePresence>
        {isLoading && (
          <motion.p
            initial={{ rotateZ: 0, opacity: 0 }}
            animate={{
              rotateZ: 360,
              opacity: 1,
              transition: {
                type: "keyframes",
                ease: "linear",
                duration: 3,
                repeat: Infinity,
              },
            }}
            exit={{
              rotateZ: 0,
              opacity: 0,
              transition: {
                duration: 0.01,
              },
            }}
            className="w-fit py-3 mx-auto text-4xl"
          >
            <AiOutlineLoading3Quarters />
          </motion.p>
        )}
      </AnimatePresence>
      {error && <p>An error has occurred.</p>}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-3">
          {data.data.map((ele, ind) => {
            return (
              <ProjectOverview projectData={ele} key={ind * Math.random()} />
            );
          })}
        </div>
      )}
      {data && data.data.length == 0 && (
        <div className="text-center text-gray-700">
          Projects you've created will appear here.
        </div>
      )}
    </div>
  );
}
