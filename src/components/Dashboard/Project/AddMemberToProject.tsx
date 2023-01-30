import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Select from "react-select";

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

    console.log(processedData);
    setOptions(processedData);
  }

  useEffect(() => {
    return () => {
      fetchConnections();
    };
  }, []);

  async function addMemberToProject() {
    setProcessing(true);
    const membersArray: String[] = projectData.members;
    if (!membersArray.includes(memberToAdd.label) || memberToAdd.label !== "") {
      membersArray.push(memberToAdd.label);
      const { data, error } = await supabase
        .from("projects")
        .update({
          members: membersArray,
        })
        .eq("id", projectData.id);

      if (error == null) {
        console.log("Data successfully updated.");
        setModalOpen(false);
      }
    } else {
      setMessage("This user already exists within the project members.");
    }
    setProcessing(false);
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-11/12 sm:w-9/12 md:w-6/12 lg:w-4/12 p-3 flex flex-col gap-2 text-black bg-white border-blue-500 border-2"
    >
      <h1>Add member to project</h1>

      {/* Render the list of connections and add them to the project based on selection */}

      <div>
        <label className="text-sm text-gray-700">
          Only people you are connected to can be added to your project
        </label>
        <Select
          options={options}
          getOptionValue={(value) => setMemberToAdd(value)}
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
        <p className="text-sm px-2 py-1 border-red-500 border-2">{message}</p>
      )}

      <button
        onClick={addMemberToProject}
        className="px-2 py-1 mx-auto font-semibold bg-[#d5cea3] rounded disabled:bg-gray-500"
        disabled={processing}
      >
        Add Member
      </button>
    </div>
  );
}
