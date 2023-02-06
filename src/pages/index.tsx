import FirstScreen from "@/components/Landing/FirstScreen";
import SecondScreen from "@/components/Landing/SecondScreen";
import ThirdScreen from "@/components/Landing/ThirdScreen";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Kanban System | Adan Ayaz</title>
        <meta name="description" content="Coded by Adan Ayaz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <FirstScreen />
        <SecondScreen />
        <ThirdScreen />
      </main>
    </>
  );
}
