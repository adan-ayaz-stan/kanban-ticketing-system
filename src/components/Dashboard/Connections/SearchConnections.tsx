import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import FuzzySearch from "fuzzy-search";
import { useState } from "react";
import { useQuery } from "react-query";
import ConnectionResult from "./minisSearchConnections/ConnectionResult";

export default function SearchConnections({ user }) {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);

  const supabase = useSupabaseClient();

  const { isLoading, data, error } = useQuery("users", () =>
    supabase.from("users").select("*")
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
            <ConnectionResult
              processing={processing}
              setProcessing={setProcessing}
              userSearchResult={ele}
              user={user}
              supabase={supabase}
              key={`${ele.id}-connection-result`}
            />
          );
        })}
      </div>
    </div>
  );
}
