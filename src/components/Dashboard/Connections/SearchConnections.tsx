import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import FuzzySearch from "fuzzy-search";
import { useState } from "react";
import { useQuery } from "react-query";

export default function SearchConnections({ user }) {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);

  const supabase = useSupabaseClient();

  const { isLoading, data, error } = useQuery("users", () =>
    supabase.from("users").select()
  );
  const handleSearchChange = async (event) => {
    if (event.target.value !== "") {
      const searcher = new FuzzySearch(data.data, ["name", "email"], {
        caseSensitive: true,
      });
      const result = searcher.search(event.target.value);
      setResults(result);
    } else {
      setResults([]);
    }
  };

  // Send Connection request function handler
  async function sendConnectionRequest(receiverID: String, event: Object) {
    setProcessing(true);
    const { data } = await supabase
      .from("users")
      .select("name")
      .eq("id", user.id);
    //
    const { error } = await supabase.from("connections_requests").upsert({
      sender_name: data[0].name,
      sender_id: user.id,
      receiver_id: receiverID,
    });

    if (error == null) {
      console.log("Successfully request sent.");
      event.target.style.display = "none";
      setProcessing(false);
    } else {
      event.target.style.display = "block";
    }

    setProcessing(false);
  }

  return (
    <div className="relative m-4 text-sm">
      <div>
        <input
          type={"text"}
          className="w-full px-3 py-2 rounded border-gray-700 border-2 focus:outline-none focus:rounded-lg transition-all duration-400 ease-out"
          placeholder="Search new connections or existing ones"
          onChange={handleSearchChange}
        />
      </div>

      {/* Search Results */}
      <div className="absolute top-[110%] max-h-[75vh] left-0 w-full grid grid-cols-12 auto-rows-auto gap-2 bg-white rounded z-50 overflow-scroll">
        {results.map((ele, ind) => {
          return (
            <div
              key={ind * Math.random() + 45}
              className="relative col-span-6 sm:col-span-6 md:col-span-4 flex flex-col items-center gap-3 p-3 m-2 text-white bg-[#1A120A] rounded"
            >
              <div className="relative h-20 w-20">
                <Image
                  src={
                    "https://images.pexels.com/photos/14208349/pexels-photo-14208349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  }
                  alt="connection-profile"
                  fill={true}
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-center">{ele.name}</p>
                <p>{ele.email}</p>
              </div>

              <div className="">
                {ele.email == user.email ? (
                  <p>You</p>
                ) : (
                  <button
                    onClick={(e) => {
                      sendConnectionRequest(ele.id, e);
                    }}
                    className="px-2 py-1 text-gray-700 bg-[#D5CEA3] hover:bg-[#E5E5CB] rounded font-mono"
                    disabled={processing ? true : false}
                    style={{
                      background: processing ? "gray" : "",
                    }}
                  >
                    Add Connection
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
