import { chatWindowAtom } from "@/atoms/chatWindowAtom";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@supabase/auth-ui-react/dist/esm/common/theming";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { BsFillChatDotsFill } from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import { useRecoilValue } from "recoil";

export default function MainChatWindow() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const chatWindowState = useRecoilValue(chatWindowAtom);

  const [messages, setMessages] = useState([]);

  const inputMessageRef = useRef(null);
  const messageContainerRef = useRef(null);

  async function messageSubmitHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const messageString = formData.get("message");

    if (!messageString) return;

    const newMessage = {
      message: messageString,
      sender_id: user.id,
      reciever_id: chatWindowState.id,
      group_id: chatWindowState.group_id,
      state: "sending",
    };
    // send message in state
    setMessages((value) => [...value, newMessage]);

    // set input to zero
    inputMessageRef.current.value = "";

    // send message to database
    const sendingMessage = await supabase.from("chats").insert({
      sender_id: user.id,
      reciever_id: chatWindowState.id,
      message: messageString,
      group_id: chatWindowState.group_id,
    });

    if (sendingMessage.error != null) {
      console.log(sendingMessage.error);
      setMessages((value) => {
        console.log("Popping message due to error");
        const sArray = value;
        sArray.pop();
        return sArray;
      });
    }
  }

  async function getMessagesFromDatabase() {
    const messagesFromDatabase = await supabase
      .from("chats")
      .select("*")
      .eq("group_id", chatWindowState.group_id)
      .order("created_at", {
        ascending: false,
      })
      .limit(50);

    if (messagesFromDatabase.error == null) {
      setMessages(messagesFromDatabase.data.reverse());
    } else {
      console.log("Error fetching messages");
      return;
    }
  }

  useEffect(() => {
    // Setting up the subscription
    const channel = supabase
      .channel("realtime chat")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
          filter: `group_id=eq.${chatWindowState.group_id}`,
        },
        (payload) => {
          // All actions here
          if (payload.eventType == "INSERT") {
            const newMessage = payload.new;

            setMessages((prevMessages) => {
              // Remove messages with 'sending' status and same ID
              const updatedMessages = prevMessages.filter(
                (message) =>
                  message.id !== newMessage.id && message.state !== "sending"
              );

              // Insert the new message
              return [...updatedMessages, newMessage];
            });
          }
        }
      )
      .subscribe((status, err) => {
        console.log(status, err);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  console.log(messages);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTo(0, container.scrollHeight);
    }
  }, [chatWindowState, messages]);

  useEffect(() => {
    getMessagesFromDatabase();
  }, []);

  return (
    <div className="flex flex-row h-full max-h-screen w-full border-l-2">
      {/* Chat Section */}
      <div className="min-w-[300px] w-[60%] flex flex-col border-r-2">
        {/* Top Bar */}
        <div className="flex flex-row gap-2 px-4 py-3 bg-white rounded-bl-xl shadow-xl">
          <Image
            src={chatWindowState != null && chatWindowState.image}
            alt="profile-image"
            width={100}
            height={100}
            className="w-16 h-16 rounded-lg border-2 inline object-cover"
          />
          <p>{chatWindowState != null && chatWindowState.name}</p>

          <BsFillChatDotsFill
            size={36}
            className="text-gray-300 ml-auto my-auto"
          />
        </div>

        {/* Messages render window */}
        <div
          ref={messageContainerRef}
          className="h-full w-full flex flex-col bg-gray-50 py-2 overflow-y-auto"
        >
          <p className="text-center text-sm text-gray-400 mb-4">
            {"<< "}
            This is the start of your conversation with {chatWindowState.name}
            {" >>"}
          </p>

          <button className="px-2 py-3 mx-auto text-sm text-gray-600 rounded shadow-lg bg-gray-100">
            Load previous messages
          </button>

          {messages.map((ele, ind) => {
            return (
              <p
                key={ind}
                style={{
                  marginLeft: ele.sender_id == user.id ? "auto" : "",
                  opacity:
                    ele.state != undefined && ele.state == "sending" && 0.5,
                  background: ele.sender_id == user.id ? "#f7d7fc" : "",
                }}
                className="w-fit m-1 p-2 bg-white rounded-lg shadow-lg"
              >
                {ele.message}
              </p>
            );
          })}
        </div>

        {/* Chat input box */}
        <form onSubmit={messageSubmitHandler} className="flex flex-row">
          <input
            name="message"
            placeholder="Send message.."
            ref={inputMessageRef}
            autoComplete="off"
            className="w-full bg-gray-100 px-6 py-3 focus:outline-none border-t-2 border-gray-50 focus:border-black rounded-tr-md"
          />
          <button type="submit" className="bg-blue-500 px-3 rounded-lg">
            <RiSendPlaneFill size={24} className="text-white" />
          </button>
        </form>
      </div>
      {/* Information Section */}
      <InformationSection />
    </div>
  );
}

function InformationSection() {
  return (
    <div className="w-[40%] flex flex-col items-center p-4">
      {/* Group Info */}
      <div className="w-full h-[200px] flex flex-col gap-2 bg-gray-50 rounded-2xl border-2 shadow-b">
        {/* Group heading */}
        <div className="flex items-center gap-12 px-12 py-2 bg-white rounded-t-2xl">
          <BiInfoCircle size={20} />
          <h2 className="uppercase">Info Group</h2>
        </div>

        {/* Rest of the info */}
        <div className="flex items-center gap-12 px-12 py-1 rounded-t-2xl">
          <BiInfoCircle size={20} />
          <h2 className="uppercase">group slogan or something</h2>
        </div>
        <div className="flex items-center gap-12 px-12 py-1 rounded-t-2xl">
          <BiInfoCircle size={20} />
          <h2 className="uppercase">no of members</h2>
        </div>
      </div>
    </div>
  );
}
