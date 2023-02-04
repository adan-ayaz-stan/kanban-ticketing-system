import { Montserrat } from "@next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "800"] });

export default function ThirdScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-700 via-gray-700 to-black">
      <h2 className={`${montserrat.className} text-white text-4xl font-bold`}>
        Footer
      </h2>
    </div>
  );
}
