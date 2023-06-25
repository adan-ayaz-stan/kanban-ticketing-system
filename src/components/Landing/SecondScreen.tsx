import { Rubik } from "@next/font/google";
import { AiOutlineFolder } from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { TbCloudDataConnection, TbFriends } from "react-icons/tb";
import { MdOutlineWeb } from "react-icons/md";
import { motion } from "framer-motion";

const rubik = Rubik({ subsets: ["latin"], weight: "500" });

const features = [
  {
    title: "Project Creation",
    desc: "Effortlessly create new projects to organize your tasks and workflow",
    icon: <AiOutlineFolder size={48} />,
  },
  {
    title: "Cloud Connections",
    desc: "Connect and collaborate with other users on the cloud, fostering teamwork",
    icon: <TbCloudDataConnection size={48} />,
  },
  {
    title: "Real-time Chat",
    desc: "Stay connected and communicate seamlessly with project collaborators",
    icon: <BiMessage size={48} />,
  },
  {
    title: "User Collaboration",
    desc: "Add users to your projects, enabling efficient teamwork and shared progress",
    icon: <TbFriends size={48} />,
  },
  {
    title: "Interactive UI",
    desc: "Enjoy a visually appealing and user-friendly interface for an intuitive experience",
    icon: <MdOutlineWeb size={48} />,
  },
];

export default function SecondScreen() {
  return (
    <div className="min-h-screen h-fit relative flex items-end justify-center py-12 bg-gradient-to-tr from-[#d1c8e4] to-[#ca97d4]">
      <motion.h1
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: 1,
          transition: {
            delay: 0.4,
          },
        }}
        viewport={{ once: true }}
        style={rubik.style}
        className="absolute top-1/4 -translate-y-1/2 text-center text-gray-900 opacity-70 text-[10em] truncate uppercase font-bold"
      >
        What it does
      </motion.h1>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{
          y: 0,
          opacity: 1,
          transition: {
            delay: 0.5,
            duration: 0.5,
            type: "keyframes",
            ease: "easeOut",
          },
        }}
        viewport={{ once: true }}
        className="grid grid-cols-3 auto-rows-fr gap-12 z-10"
      >
        {features.map((ele, ind) => {
          return (
            <div
              key={"feature-index-" + ind}
              className="flex flex-col items-center p-3 py-5 bg-white bg-opacity-40 rounded-lg"
            >
              <span className="text-gray-900">{ele.icon}</span>
              <p className="font-semibold text-lg">{ele.title}</p>
              <p className="w-[250px] text-gray-800 text-center text-sm">
                {ele.desc}
              </p>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
