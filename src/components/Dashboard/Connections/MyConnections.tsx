import Image from "next/image";

export default function MyConnections() {
  return (
    <div className="px-4 py-3 text-sm">
      <h1 className="w-fit mx-auto text-4xl uppercase border-b-2 border-gray-700">
        My connections
      </h1>

      <div className="grid grid-cols-9 auto-rows-auto p-3">
        {/* Sample Connection */}
        <div className="relative min-w-[20em] flex flex-row items-center gap-3 p-3 text-white bg-[#3C2A21] rounded">
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
            <p>Connection Name</p>
          </div>
        </div>
      </div>
    </div>
  );
}
