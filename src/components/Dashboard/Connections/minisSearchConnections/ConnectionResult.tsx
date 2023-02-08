import Image from "next/image";

export default function ConnectionResult({
  processing,
  setProcessing,
  userSearchResult,
  user,
  supabase,
}) {
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
    <div className="relative col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col items-center gap-3 p-3 m-2 text-gray-800 bg-white rounded border-2 border-gray-300">
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
        <p className="font-bold text-center text-[12px]">
          {userSearchResult.name}
        </p>
        <p className="text-[12px] font-sans">{userSearchResult.email}</p>
      </div>

      <div className="">
        {userSearchResult.email == user.email ? (
          <p>You</p>
        ) : (
          <button
            onClick={(e) => {
              sendConnectionRequest(userSearchResult.id, e);
            }}
            className="px-2 py-1 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded font-mono"
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
}
