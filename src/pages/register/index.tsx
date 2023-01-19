import RegisterForm from "@/components/Register/RegisterForm";
import { supabaseClient } from "@/supabase/supabase.config";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [successfullyRegistered, setSuccessFullyRegistered] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center bg-white p-2">
      {successfullyRegistered ? (
        <div className="flex flex-col px-6 py-12 gap-2 text-black border-2 rounded-xl shadow-lg">
          <h2 className="text-xl text-center font-bold">Confirm your Email</h2>
          <p className="text-center">
            A confirmation email has been sent to your provided mail account.
            <br />
            Confirm your email to continue to use our services.
          </p>

          <Link href="/login" className="underline font-bold text-center mt-4">
            Continue to Login
          </Link>
        </div>
      ) : (
        <div className="h-fit w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 px-4 py-12 border-2 rounded-xl shadow-lg">
          <RegisterForm setSuccessFullyRegistered={setSuccessFullyRegistered} />
        </div>
      )}
    </div>
  );
}

{
  /* */
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
