import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { chatWindowAtom } from "@/atoms/chatWindowAtom";
import SvgSpinner from "./SvgSpinner";
import { requestsWindowAtom } from "@/atoms/requestsWindowAtom";

export default function PersonalChats() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [chatWindowState, setChatWindowState] = useRecoilState(chatWindowAtom);
  const setRequestsWindowState = useSetRecoilState(requestsWindowAtom);

  const [contacts, setContacts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function getContacts() {
    const { data, error } = await supabase
      .from("connections")
      .select("*, users!user1_id(name, image)")
      .eq("user2_id", user.id);

    if (error == null) {
      setLoading(false);
      setContacts(data);
    }
  }

  async function openChatWithUser(
    reciever_id: string,
    reciever_name: string,
    reciever_image: string
  ) {
    if (chatWindowState != null && chatWindowState.id == reciever_id) {
      return;
    }
    setChatWindowState(null);
    setRequestsWindowState(null);
    console.log("Fetching group");
    // find the group
    const group = await supabase
      .from("groups")
      .select("*")
      .eq("isExclusive", true)
      .contains("members", [user.id, reciever_id])
      .single();
    //
    if (group.error == null) {
      console.log("Group percieved, opening chat");
      setChatWindowState({
        name: reciever_name,
        image: reciever_image,
        group_id: group.data.id,
      });
    } else {
      // means group is not present
      // so we create the group
      console.log("Group not percieved, creating group");
      const createGroup = await supabase
        .from("groups")
        .insert({
          members: [user.id, reciever_id],
          isExclusive: true,
        })
        .select()
        .single();

      //
      if (createGroup.error == null) {
        setChatWindowState(null);
        console.log("Group created successfully");
        setChatWindowState({
          name: reciever_name,
          image: reciever_image,
          group_id: createGroup.data.id,
        });
      } else {
        return;
      }
    }
  }

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <>
      {/* Search Bar */}
      <div className="flex flex-row">
        <input
          placeholder="Search your connections..."
          type="text"
          name="text"
          className="w-full mx-5 my-2 h-15 p-2 rounded-12 border-1-5 outline-none transition border-2 rounded-md focus:border-gray-700"
        />
      </div>

      {isLoading && (
        <div className="w-fit mx-auto text-gray-400 rotate-180">
          <SvgSpinner />
        </div>
      )}

      {isLoading ||
        contacts.map((ele, ind) => {
          return (
            <div
              key={ele.id}
              onClick={() => {
                openChatWithUser(ele.user1_id, ele.users.name, ele.users.image);
              }}
              className="flex p-2 gap-2 hover:bg-gray-100 rounded-md cursor-pointer"
            >
              <Image
                src={ele.users.image}
                width={100}
                height={100}
                alt="profile-image"
                className="border-2 h-14 w-14 rounded-lg object-cover"
              />

              <div className="flex flex-col justify-center">
                <p className="text-sm">{ele.users.name}</p>
              </div>
            </div>
          );
        })}
    </>
  );
}
