import { chatWindowAtom } from "@/atoms/chatWindowAtom";
import { requestsWindowAtom } from "@/atoms/requestsWindowAtom";
import { useSetRecoilState } from "recoil";

export default function Requests() {
  const setChatWindowState = useSetRecoilState(chatWindowAtom);
  const setRequestsWindowState = useSetRecoilState(requestsWindowAtom);

  function openRequestsWindow(state: string) {
    setChatWindowState(null);
    setRequestsWindowState(state);
  }

  return (
    <div className="flex flex-col gap-2 py-4">
      <button
        onClick={() => {
          openRequestsWindow("search connections");
        }}
        className="p-2 font-medium border-2 border-purple-400 rounded shadow-md hover:border-purple-500 transition-colors"
      >
        My Connections
      </button>
      <button
        onClick={() => {
          openRequestsWindow("send requests");
        }}
        className="p-2 font-medium border-2 border-green-400 rounded shadow-md hover:border-green-500 transition-colors"
      >
        Send requests
      </button>
      <button
        onClick={() => {
          openRequestsWindow("recieve requests");
        }}
        className="p-2 font-medium border-2 border-orange-400 rounded shadow-md hover:border-orange-500 transition-colors"
      >
        Check incoming requests
      </button>
    </div>
  );
}
