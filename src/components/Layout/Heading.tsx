import { Rubik } from "@next/font/google";

const rubik = Rubik({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Heading({ children, className }) {
  return (
    <h1 style={rubik.style} className={className}>
      {children}
    </h1>
  );
}
