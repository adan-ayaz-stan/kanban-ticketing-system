import { requestsWindowAtom } from "@/atoms/requestsWindowAtom";
import { useRecoilValue } from "recoil";
import SendRequests from "./RequestsWindow__Children/SendRequests";
import SearchConnections from "./RequestsWindow__Children/SearchConnections";
import IncomingRequests from "./RequestsWindow__Children/IncomingRequests";

export default function RequestsWindow() {
  const requestsWindowState = useRecoilValue(requestsWindowAtom);

  return (
    <div className="w-full p-4">
      {requestsWindowState == "send requests" && <SendRequests />}
      {requestsWindowState == "search connections" && <SearchConnections />}
      {requestsWindowState == "recieve requests" && <IncomingRequests />}
    </div>
  );
}
