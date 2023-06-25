import { Flamenco } from "@next/font/google";

const flamenco = Flamenco({subsets: ['latin'], weight: '400'})

export default function Heading({ children, className }) {
  return (
    <h1 style={flamenco.style} className={className}>
      {children}
    </h1>
  );
}
