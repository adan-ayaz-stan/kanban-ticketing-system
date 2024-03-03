import { Source_Code_Pro } from "@next/font/google";
import Link from "next/link";

const scp = Source_Code_Pro({ subsets: ["latin"], weight: "500" });

export default function ThirdScreen() {
  return (
    <div className="flex flex-col items-center justify-end py-4 text-black">
      <Link
        href="https://github.com/adan-ayaz-stan"
        className={`${scp.className} hover:underline`}
      >
        Spitfire
      </Link>
    </div>
  );
}
