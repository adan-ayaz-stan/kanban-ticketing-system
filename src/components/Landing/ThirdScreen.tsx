import { Source_Code_Pro } from "@next/font/google";
import { motion } from "framer-motion";
import { AiFillHeart } from "react-icons/ai";

const scp = Source_Code_Pro({ subsets: ["latin"], weight: "500" });

export default function ThirdScreen() {
  return (
    <div className=" flex flex-col items-center justify-end text-black bg-gradient-to-br from-[#d1c8e4] to-[#ca97d4] py-4">
      <motion.h1
        initial={{ opacity: 0, rotateY: 90 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        whileTap={{
          rotateY: 180,
          transition: {
            duration: 0.7,
          },
        }}
        viewport={{ once: true }}
        style={scp.style}
        className="flex gap-1 item-center font-medium"
      >
        made with <AiFillHeart size={22} className="text-purple-900" /> by{" "}
        <a
          className="font-bold text-purple-900 hover:underline"
          href="https://github.com/adan-ayaz-stan"
        >
          Adan Ayaz
        </a>
      </motion.h1>
    </div>
  );
}
