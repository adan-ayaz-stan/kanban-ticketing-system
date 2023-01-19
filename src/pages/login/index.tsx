import LoginForm from "@/components/Login/LoginForm";
import { supabaseClient } from "@/supabase/supabase.config";
import { GetServerSideProps } from "next";

export default function LogIn() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="h-fit w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 px-4 py-12 border-2 rounded-xl shadow-lg">
        <LoginForm />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const cookies = context.req.cookies;
  const { data, error } = await supabaseClient.auth.setSession({
    access_token: cookies["my-access-token"],
    refresh_token: cookies["my-refresh-token"],
  });

  if (error == null) {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }

  return {
    props: {
      data,
    },
  };
};
