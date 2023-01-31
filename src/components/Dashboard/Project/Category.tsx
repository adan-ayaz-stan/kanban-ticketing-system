import { Reorder, useDragControls } from "framer-motion";
import { TbGridDots } from "react-icons/tb/index";

interface Props {
  data: string;
}

export default function Category({ data }: Props) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={data}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ cursor: "grab" }}
      className="w-full p-2 border-2 border-dotted border-white rounded shadow-xl backdrop-blur-lg bg-[#ffffff55]"
    >
      <div className="flex justify-center items-center">
        <h1 className="w-fit px-2 py-1 mx-auto font-bold text-[#1A120B] bg-gray-200 rounded">
          {data}
        </h1>
        <span
          onPointerDown={(e) => controls.start(e)}
          className="cursor-pointer"
        >
          <TbGridDots />
        </span>
      </div>
    </Reorder.Item>
  );
}
