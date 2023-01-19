import {
  AiFillAccountBook,
  AiFillCalendar,
  AiFillGift,
  AiFillHome,
  AiOutlineHome,
  AiOutlineLogout,
} from "react-icons/ai/index";

export default function Sidebar() {
  const logout = async () => {
    const data = await fetch("/api/logout").then((data) => data.json());
    if (data.status == "success") {
      router.push("/");
    }
  };

  return (
    <div className="h-fit sm:h-screen w-screen sm:w-20 fixed bottom-0 sm:top-0 left-0 flex flex-row sm:flex-col justify-center sm:justify-between items-center py-2 sm:py-0 bg-gradient-to-b from-cyan-500 to-blue-500 bg-opacity-50">
      {/* Logo */}
      <div className="relative hidden sm:block h-20 w-full">Logo</div>

      {/* Routing */}
      <div className="flex flex-row sm:flex-col gap-4">
        <div
          id="dashboard-sidebar-home"
          data-tooltip-content="Home"
          className="w-fit p-2 hover:bg-orange-400 cursor-pointer rounded-lg transition-all duration-300"
        >
          <AiFillHome className="text-3xl" />
        </div>
        <div
          id="dashboard-sidebar-calender"
          data-tooltip-content="Calender"
          className="w-fit p-2 hover:bg-orange-400 cursor-pointer rounded-lg transition-all duration-300"
        >
          <AiFillCalendar className="text-3xl" />
        </div>
        <div
          id="dashboard-sidebar-expenses"
          data-tooltip-content="Expenses"
          className="w-fit p-2 hover:bg-orange-400 cursor-pointer rounded-lg transition-all duration-300"
        >
          <AiFillAccountBook className="text-3xl" />
        </div>
        <div
          id="dashboard-sidebar-gift"
          data-tooltip-content="Daily Reward"
          className="w-fit p-2 hover:bg-orange-400 cursor-pointer rounded-lg transition-all duration-300"
        >
          <AiFillGift className="text-3xl" />
        </div>
      </div>

      {/* Log Out */}
      <div
        id="dashboard-sidebar-logout"
        data-tooltip-content="Logout"
        className="w-fit ml-2 sm:mb-6 p-2 hover:bg-orange-400 cursor-pointer rounded-lg transition-all duration-300"
        onClick={logout}
      >
        <AiOutlineLogout className="text-3xl" />
      </div>
    </div>
  );
}
