import { Montserrat } from "@next/font/google";
import Image from "next/image";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "800"] });

export default function SecondScreen() {
  return (
    <div className="min-h-screen h-fit flex flex-col md:flex-row py-12 bg-gradient-to-b from-black via-black to-gray-700 bg-opacity-60">
      <div className="w-full flex flex-col items-center justify-center gap-4 px-12 text-white ">
        <h2 className={`text-[3em] font-bold ${montserrat.className}`}>
          About
        </h2>
        <p className={`text-center leading-loose ${montserrat.className}`}>
          Kanban Task Management System is a cloud-based task management system
          that helps teams manage the flow of work across their teams. The
          platform enables users to manage project-related tasks, including
          schedules, meetings and more. It also uses an issue board system where
          teams can form project specific issues, assign tickets and specify the
          owner. Teams can connect with other users on the platform and start a
          chat session with them for better communication within their
          organizations or between organizations.
        </p>
      </div>
      <div className="w-full p-20">
        <div className="min-h-[300px] h-full bg-[url('https://images.pexels.com/photos/13583358/pexels-photo-13583358.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&dpr=1')] bg-contain bg-no-repeat"></div>
      </div>
    </div>
  );
}
