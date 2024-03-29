import Link from "next/link";

import { Rubik, Sen } from "@next/font/google";

const sen = Sen({ weight: "700", subsets: ["latin"] });
const rubik = Rubik({ subsets: ["hebrew"], weight: "400" });

export default function FirstScreen() {
  return (
    <div className="relative min-h-screen pb-12 text-white bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4]">
      {/* Navbar */}
      <div className="flex flex-row justify-between items-center px-6 sm:px-12 py-4">
        <div className="text-lg font-mono text-black">Adan Ayaz</div>

        <div style={sen.style} className="flex flex-row gap-4">
          <Link
            href={"/auth"}
            className="text-white bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
          >
            Login
          </Link>
          <Link
            href={"/auth"}
            className="text-white bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
          >
            Sign up
          </Link>
        </div>
      </div>
      {/* Navbar Closed */}

      <div className={`h-[80vh] flex flex-col`}>
        <div className="flex flex-col px-6 py-2 mt-auto">
          <h1
            className="py-4 text-[3em] text-center sm:text-left leading-tight text-black"
            style={rubik.style}
          >
            Kanban Ticketing System
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex flex-row gap-4">
              <Link
                href={"/auth"}
                style={sen.style}
                className="text-white bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
              >
                Login
              </Link>
              <p className="text-sm text-black">
                The project planning platform <br /> for forward tech teams.
              </p>
            </div>

            <div
              className="text-sm text-black text-center sm:text-right"
              style={sen.style}
            >
              <p>Whats new? Project is now live!</p>
              <a href="#" className="underline">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
