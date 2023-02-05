import Link from "next/link";
import Image from "next/image";

import { Rubik, Sen } from "@next/font/google";

import DoodleImage from "@/assets/images/doodle-main-page.png";

const sen = Sen({ weight: "700", subsets: ["latin"] });
const rubik = Rubik({ subsets: ["hebrew"], weight: "700" });

export default function FirstScreen() {
  return (
    <div className="min-h-screen pb-12 bg-[url('https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&dpr=1')] bg-norepeat bg-cover bg-fixed text-white">
      {/* Navbar */}
      <div className="flex flex-row justify-between items-center px-12 py-4">
        <div>Logo</div>

        <div className="flex flex-row gap-4">
          <Link
            href={"/auth"}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none dark:focus:ring-blue-800"
          >
            Login
          </Link>
          <Link
            href={"/auth"}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none dark:focus:ring-blue-800"
          >
            Sign up
          </Link>
        </div>
      </div>
      {/* Navbar Closed */}

      <div
        className={`h-full grid grid-cols-1 sm:grid-cols-2 auto-rows-auto px-4 sm:px-12`}
      >
        <div className="py-8 sm:h-[500px] flex flex-col justify-center gap-2 text-center sm:text-left pl-0 lg:pl-16 md:pl-8 sm:pl-0">
          <h2
            className={`font-bold text-[3em] sm:text-[2.5em] leading-tight ${rubik.className}`}
          >
            Kanban Task Management System
          </h2>
          <p className={`text-lg text-blue-300 font-sen ${sen.className}`}>
            A task management platform which helps you organize your team and
            team members by assigning tasks to them.
          </p>
        </div>

        <div className="flex items-end justify-center">
          <Image
            src={DoodleImage}
            alt="doodle"
            height={400}
            width={400}
            className="brightness-[200%]"
          />
        </div>
      </div>
    </div>
  );
}
