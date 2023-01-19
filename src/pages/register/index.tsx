import RegisterForm from "@/components/Register/RegisterForm";

export default function Register() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-white py-2">
      <div className="h-fit w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 px-4 py-12 border-2 rounded-xl shadow-lg">
        <RegisterForm />
      </div>
    </div>
  );
}
