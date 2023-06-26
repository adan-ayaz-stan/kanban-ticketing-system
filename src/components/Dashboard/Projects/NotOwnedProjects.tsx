import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MultiClamp from "react-multi-clamp";
import { Barlow } from "@next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function NotOwnedProjects({
  isLoading,
  isSuccess,
  data,
  error,
}) {
  return (
    <div className="m-2 p-2 rounded-xl">
      <h1 className="p-2 mb-2 text-center rounded-t-xl rounded-b-md text-red-700 bg-white text-xl font-bold uppercase">
        Projects You're a Member of
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
      {isSuccess && data?.data != null && (
        <div className="flex flex-row flex-wrap gap-3">
          {data.data.map((ele, ind) => {
            return <ProjectOverview data={ele} key={ele.id} />;
          })}
        </div>
      )}

      {isSuccess && data.data.length == 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 p-4 text-center text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="42"
            viewBox="0 0 15 16"
          >
            <path
              fillRule="evenodd"
              d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z"
              fill="currentColor"
            />
          </svg>

          <p>Projects others have added you to will appear here.</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

const barlow = Barlow({ subsets: ["latin"], weight: "600" });

function ProjectOverview({ data }) {
  const supabase = useSupabaseClient();
  const [members, setMembers] = useState([]);
  const [imageLink, setImageLink] = useState("");

  async function getProjectMembers() {
    const projectMembers = await supabase
      .from("project_members")
      .select("*, users!inner(image)")
      .eq("project_id", data.project_id);

    if (projectMembers.error == null) {
      setMembers(projectMembers.data);
    } else {
      console.log(projectMembers.error);
    }
  }

  async function getProfileImage() {
    const image = await supabase
      .from("users")
      .select("image")
      .eq("id", data.projects.owner_id);

    if (image.error == null) {
      setImageLink(image.data[0].image);
    }
  }

  useEffect(() => {
    getProjectMembers();
    getProfileImage();
  }, []);

  return (
    <>
      <Link
        href={`/dashboard/project/${data.project_id}`}
        className="relative flex flex-col gap-3 text-black p-4 border-gray-300 bg-white border-2 border-l-blue-500 border-l-4 rounded-lg"
      >
        {/* Project heading */}
        <div className="max-w-[400px] flex flex-col gap-2">
          {/* Project title */}
          <h1 style={barlow.style} className="text-xl font-bold text-black">
            {data.projects.name}
          </h1>
          {/* Project descripiton */}
          <div title={data.projects.description} className="text-gray-600">
            <MultiClamp ellipsis="..." clamp={3}>
              {data.projects.description}
            </MultiClamp>
          </div>
          {/* Project author */}
          <p className="h-fit flex items-center gap-2 text-sm">
            Authored by:{" "}
            <span className="flex gap-2 items-center px-2 py-1 text-[#1A120B] font-bold bg-gray-200 rounded">
              {imageLink == "" ? (
                <Image
                  src={
                    "https://img.freepik.com/free-photo/psychedelic-paper-shapes-with-copy-space_23-2149378246.jpg?w=996&t=st=1687450417~exp=1687451017~hmac=668cf406dd6bcfa588c9b38f7bf60d1c75a84570902555c93f829506e32c84a4"
                  }
                  alt="author-image"
                  height={50}
                  width={50}
                  style={{ width: "35px", height: "35px" }}
                  className="relative min-w-[35px] flex justify-center items-center rounded-full object-cover"
                />
              ) : (
                <img
                  src={imageLink}
                  alt="author-image"
                  height={50}
                  width={50}
                  style={{ width: "35px", height: "35px" }}
                  className="relative min-w-[35px] flex justify-center items-center rounded-full object-cover"
                />
              )}{" "}
              {data.projects.owner_name}
            </span>
          </p>

          {/* Project Members */}
          <div className="flex items-center gap-3">
            Members:
            <div className="flex pl-6">
              {members.map((ele, ind) => {
                if (ind > 4) {
                  return;
                }

                return (
                  <Member
                    memberData={ele}
                    key={"project-members-not-owned-" + ind}
                  />
                );
              })}
              {/* If number of members greater than 5 */}
              {members.length > 5 && (
                <p
                  style={barlow.style}
                  className="h-[35px] w-[35px] flex items-center justify-center text-lg text-black font-bold ml-[-10px] bg-gray-200 rounded-full z-10"
                >
                  +{members.length - 5}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

function Member({ memberData }) {
  const [imageLink] = useState(memberData.users.image);

  return (
    <>
      {imageLink == "" ? (
        <Image
          src={
            "https://img.freepik.com/free-photo/psychedelic-paper-shapes-with-copy-space_23-2149378246.jpg?w=996&t=st=1687450417~exp=1687451017~hmac=668cf406dd6bcfa588c9b38f7bf60d1c75a84570902555c93f829506e32c84a4"
          }
          alt="member-image"
          height={50}
          width={50}
          style={{ width: "35px", height: "35px" }}
          className="relative min-w-[35px] flex ml-[-10px] justify-center items-center rounded-full object-cover"
        />
      ) : (
        <img
          src={imageLink}
          alt="member-image"
          height={50}
          width={50}
          style={{ width: "35px", height: "35px" }}
          className="relative min-w-[35px] flex ml-[-10px] justify-center items-center rounded-full object-cover"
        />
      )}
    </>
  );
}
