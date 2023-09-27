import { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";

import Heading from "@/components/Layout/Heading";

import AsyncSelect from "react-select/async";
import SvgSpinner from "./SvgSpinner";
import { useSetRecoilState } from "recoil";
import { chatWindowAtom } from "@/atoms/chatWindowAtom";
import { requestsWindowAtom } from "@/atoms/requestsWindowAtom";

export default function GroupChats() {
  const supabase = useSupabaseClient();
  const user = useUser();

  const setChatWindowState = useSetRecoilState(chatWindowAtom);

  const [groups, setGroups] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const [isGroupCreatorActive, setGroupCreatorActive] = useState(false);
  const setRequestsWindowState = useSetRecoilState(requestsWindowAtom);

  async function getGroups() {
    setLoading(true);
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("isExclusive", false)
      .contains("members", [user.id]);

    if (error == null) {
      setGroups(data);
    } else {
      console.log(error);
      return;
    }
    setLoading(false);
  }

  useEffect(() => {
    getGroups();
  }, []);

  function openChatOfGroup(
    group_id: string,
    group_name: string,
    group_image: string
  ) {
    setRequestsWindowState(null);
    setChatWindowState({
      name: group_name,
      image: group_image,
      group_id: group_id,
    });
  }

  return (
    <>
      {isGroupCreatorActive && (
        <GroupCreator setGroupCreatorActive={setGroupCreatorActive} />
      )}
      <div className="flex flex-col">
        <button
          onClick={() => setGroupCreatorActive(true)}
          className="p-2 ml-auto bg-purple-200 rounded hover:bg-purple-300 transition-all"
        >
          Create a new group
        </button>

        {/* Search Bar */}
        <div className="flex flex-row">
          <input
            placeholder="Search your groups..."
            type="text"
            name="text"
            className="w-full my-2 h-15 p-2 rounded-12 border-1-5 outline-none transition border-2 rounded-md focus:border-gray-700"
          />
        </div>

        {isLoading && (
          <div className="w-fit mx-auto text-gray-400 rotate-180">
            <SvgSpinner />
          </div>
        )}

        {isLoading ||
          groups.map((ele, ind) => {
            return (
              <div
                key={ele.id}
                onClick={() => {
                  openChatOfGroup(ele.id, ele.group_name, ele.group_image);
                }}
                className="flex p-2 gap-2 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                <Image
                  src={ele.group_image}
                  width={100}
                  height={100}
                  alt="profile-image"
                  className="border-2 h-14 w-14 rounded-lg object-cover"
                />

                <div className="flex flex-col justify-center">
                  <p className="text-sm">{ele.group_name}</p>
                  <p className="text-sm text-gray-400">
                    {ele.members.length} members
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

function GroupCreator({
  setGroupCreatorActive,
}: {
  setGroupCreatorActive: (boolean: boolean) => void;
}) {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [isLoading, setLoading] = useState(false);

  // form option multi-select value
  const [multiSelectValue, setMultiSelectValue] = useState([]);

  type OptionType = {
    label: string;
    value: string;
  };

  const filterColors = async (inputValue: string) => {
    const { data, error } = await supabase
      .from("connections")
      .select("*, users!user2_id(name)")
      .eq("user1_id", user.id);

    return data
      .filter((i) =>
        i.users.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((i) => {
        return {
          label: i.users.name,
          value: i.user2_id,
        };
      });
  };

  const loadOptions = (
    inputValue: string,
    callback: (options: OptionType[]) => void
  ) => {
    setTimeout(async () => {
      callback(await filterColors(inputValue));
      console.log(filterColors(inputValue));
    }, 1000);
  };

  async function formSubmitHandler(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    //   group name
    const groupName = formData.get("groupName");
    // group members
    const groupMembers = multiSelectValue.map((ele) => ele.value);
    //   create group
    const { error } = await supabase.from("groups").insert({
      group_name: groupName,
      members: [...groupMembers, user.id],
      isExclusive: false,
    });

    if (error) {
      console.log(error);
      return;
    }

    setLoading(false);
  }

  return (
    <div
      onClick={(e) => {
        setGroupCreatorActive(false);
      }}
      className="flex justify-center items-center fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50"
    >
      <form
        onClick={(e) => {
          e.stopPropagation();
        }}
        onSubmit={formSubmitHandler}
        className="min-w-[400px] w-fit flex flex-col p-2 bg-white rounded-lg"
      >
        <Heading className={"text-center text-lg"}>Group Creator</Heading>

        <input
          name="groupName"
          placeholder="Group Name"
          className="w-full my-2 h-15 p-2 rounded-12 border-1-5 outline-none transition border-2 rounded-md focus:border-gray-700"
          required
          autoComplete="off"
        />

        <label>Select initial group members to add</label>
        <AsyncSelect
          defaultOptions={true}
          name="option"
          cacheOptions
          loadOptions={loadOptions}
          isMulti={true}
          required
          onChange={(value) => setMultiSelectValue(value)}
        />

        {!isLoading && (
          <button
            type="submit"
            className="p-2 mx-auto my-2 mt-4 bg-green-300 hover:bg-green-400"
          >
            Create group
          </button>
        )}

        {isLoading && (
          <p className="p-2 mx-auto my-2 mt-4">creating group...</p>
        )}
      </form>
    </div>
  );
}
