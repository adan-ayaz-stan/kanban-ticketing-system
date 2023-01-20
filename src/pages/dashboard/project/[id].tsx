type pageProps = {
  data: Object;
};

export default function IndvidualProject({ data }: pageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-[45deg] from-cyan-500 to-pink-500">
      <h1 className="text-xl">Induvidual Project Screen</h1>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context: {
  req: {};
  params: { id: number };
}) {
  const params = context.params.id;

  console.log(params);

  const data = {};
  // Pass data to the page via props
  return { props: { data } };
}
