import Image from "next/image";
import { useRef, useState } from "react";
import { BsFillChatDotsFill } from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";

const dummyData = [
  {
    message: "This is a message not sent by you",
    sender: "not you",
  },
  {
    message: "This is a message not sent by you",
    sender: "not you",
  },
];

export default function MainChatWindow() {
  const [messages, setMessages] = useState(dummyData);

  const inputMessageRef = useRef(null);

  function messageSubmitHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const messageString = formData.get("message");

    if (!messageString) return;

    const newMessage = {
      message: messageString,
      sender: "you",
    };

    setMessages((value) => [...value, newMessage]);
    inputMessageRef.current.value = "";
  }

  return (
    <div className="flex flex-row h-full w-full border-l-2">
      {/* Chat Section */}
      <div className="min-w-[300px] w-[60%] flex flex-col border-r-2">
        {/* Top Bar */}
        <div className="flex flex-row gap-2 px-4 py-3 bg-white rounded-bl-xl shadow-xl">
          <Image
            src={""}
            alt="profile-image"
            className="w-16 h-16 rounded-lg border-2 inline "
          />
          <p>User name</p>

          <BsFillChatDotsFill
            size={36}
            className="text-gray-300 ml-auto my-auto"
          />
        </div>

        {/* Messages render window */}
        <div className="h-full w-full bg-gray-50 py-2">
          {messages.map((ele, ind) => {
            return (
              <p
                key={ind}
                style={{
                  marginLeft: ele.sender == "you" ? "auto" : "",
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
      <div>Information Section</div>
    </div>
  );
}
