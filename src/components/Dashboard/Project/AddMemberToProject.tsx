import { Barlow } from "@next/font/google";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Select from "react-select";

const barlow = Barlow({ subsets: ["latin"], weight: "700" });

export default function AddMemberToProject({ projectData, setModalOpen }) {
  const router = useRouter();

  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const [options, setOptions] = useState([]);
  const [memberToAdd, setMemberToAdd] = useState({
    label: "",
    value: "",
  });

  const supabase = useSupabaseClient();

  const session = useSession();

  async function fetchConnections() {
    const { data, error } = await supabase
      .from("connections")
      .select()
      .or(`user1_id.eq.${session?.user.id},user2_id.eq.${session?.user.id}`);

    const processedData = data?.map((ele, ind) => {
      if (session?.user.id == ele.user1_id) {
        return { label: ele.user2_name, value: ele.user2_id };
      } else if (session?.user.id == ele.user2_id) {
        return { label: ele.user1_name, value: ele.user1_id };
      }
    });

    setOptions(processedData);
  }

  useEffect(() => {
    return () => {
      fetchConnections();
    };
  }, []);

  async function addMemberToProject() {
    setProcessing(true);
    // Check if a user is selected
    if (memberToAdd.value == "") {
      setMessage("Select a connection to add first.");
      return setProcessing(false);
    }
    // Add member to project
    const { data, error } = await supabase
      .from("project_members")
      .select("user_id")
      .filter("project_id", "eq", projectData.project_id)
      .filter("user_id", "eq", memberToAdd.value);

    if (data[0] == undefined) {
      // Means that the user has not been added to the project.
      const { error } = await supabase.from("project_members").insert({
        project_id: projectData.project_id,
        user_id: memberToAdd.value,
        user_name: memberToAdd.label,
      });

      if (error == null) {
        console.log("User has been added to the project.");
        setModalOpen(false);
      }
    } else {
      // Mean the user is already in the project
      setMessage("This user already exists in this project.");
    }

    setProcessing(false);
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-11/12 sm:w-9/12 md:w-6/12 lg:w-4/12 p-3 flex flex-col gap-2 text-black bg-[#FFF2F2] rounded-lg"
    >
      <h1
        className="w-fit mx-auto my-2 font-bold text-xl text-gray-800 uppercase"
        style={barlow.style}
      >
        Add member to project
      </h1>

      {/* Render the list of connections and add them to the project based on selection */}

      <div>
        <label className="text-sm text-gray-700">
          Only people you are connected to can be added to your project
        </label>
        <Select
          options={options}
          onChange={(value) => setMemberToAdd(value)}
          onMenuOpen={() => setMessage("")}
        />
      </div>

      {memberToAdd.value !== "" && (
        <label className="text-sm text-gray-600">
          <span className="text-black font-semibold">{memberToAdd.label}</span>{" "}
          will be added to the project as a member.
        </label>
      )}

      {message !== "" && (
        <p className="text-sm px-2 py-1 text-white bg-red-600 rounded">
          {message}
        </p>
      )}

      <button
        onClick={addMemberToProject}
        className="w-fit mx-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 my-2 "
        disabled={processing}
      >
        Add Member
      </button>
    </div>
  );
}
