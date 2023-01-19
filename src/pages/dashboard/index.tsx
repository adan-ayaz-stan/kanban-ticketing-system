import Sidebar from "@/components/Dashboard/Sidebar";
import { GetServerSideProps, NextPage } from "next";

interface pageProps {
  userData: {
    name: String;
    email: String;
  };
}

const Dashboard: NextPage<pageProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* MAIN PANEL */}
      <div className="relative sm:pl-20">
        <h2 className="w-full text-xl text-center font-bold uppercase p-4">
          Your dashboard
        </h2>

        <div className="m-4 p-4 bg-black bg-opacity-10 rounded-xl backdrop-blur-md"></div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  return {
    props: {},
  };
};

export default Dashboard;
