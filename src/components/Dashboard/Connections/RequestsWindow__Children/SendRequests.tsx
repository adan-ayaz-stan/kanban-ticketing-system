import { useEffect, useState } from "react";
import Image from "next/image";

import { useMiniSearch } from "react-minisearch";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import Heading from "@/components/Layout/Heading";
import SvgSpinner from "../Contacts__Children/SvgSpinner";

export default function SendRequests() {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [documents, setDocuments] = useState([]);
  const miniSearchOptions = { fields: ["name"] };

  const { search, searchResults } = useMiniSearch(documents, miniSearchOptions);

  const handleSearchOptions = (event) => {
    search(event.target.value, {
      fields: ["name"],
      fuzzy: 0.1,
      prefix: true,
    });
  };

  async function getUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, image, connections!user2_id(user2_id)")
      .neq("id", user.id)
      .eq("connections.user1_id", user.id);

    if (error == null) {
      console.log(data);
      setDocuments(data);
    } else {
      console.log(error);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  async function sendRequest(reciever_id: string) {
    const { data, error } = await supabase
      .from("connections_requests")
      .select("id")
      .eq("sender_id", user.id)
      .eq("receiver_id", reciever_id)
      .limit(1)
      .single();

    console.log(data, error);

    if (error != null) {
      const { error } = await supabase.from("connections_requests").insert({
        sender_id: user.id,
        receiver_id: reciever_id,
      });
    } else {
      window.alert("Connection request already sent.");
      return;
    }
  }

  return (
    <>
      <Heading className={"text-xl"}>Send connection requests</Heading>

      <input
        name="search"
        autoComplete="off"
        placeholder="Search users across the clouds.."
        onChange={handleSearchOptions}
        className="w-full my-2 h-15 p-2 rounded-12 border-1-5 outline-none transition border-2 rounded-md focus:border-gray-700"
      />

      <div className="flex flex-row flex-wrap gap-2">
        {searchResults &&
          searchResults.map((result, i) => {
            return (
              <Children
                key={result.id + "req-send"}
                result={result}
                sendRequest={sendRequest}
              />
            );
          })}
      </div>
    </>
  );
}

function Children({ result, sendRequest }) {
  const [isProcessing, setProcessing] = useState(false);

  return (
    <div className="p-2 flex flex-row gap-2 bg-gray-50 rounded-lg border-2 border-gray-100">
      <Image
        src={result.image}
        alt="user image"
        className="h-12 w-12 object-cover rounded-full"
        height={100}
        width={100}
      />

      <div className="flex flex-col">
        <p>{result.name}</p>
        {result?.connections[0]?.user2_id == undefined ? (
          <button
            onClick={async () => {
              setProcessing(true);
              await sendRequest(result.id);
              setProcessing(false);
            }}
            disabled={isProcessing}
            className="p-2 text-sm bg-green-300 hover:bg-green-400 rounded-md"
          >
            {isProcessing ? <SvgSpinner /> : "Send connection request"}
          </button>
        ) : (
          <p className="text-sm p-1 px-3 bg-gray-200 rounded-md">
            User is already a connection
          </p>
        )}
      </div>
    </div>
  );
}
