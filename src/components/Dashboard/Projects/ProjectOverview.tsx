import Link from "next/link";

type componentProp = {
  projectData: {
    id: number;
    created_at: String;
    name: String;
    ownership: String;
    members: [];
  };
};

export default function ProjectOverview({ projectData }: componentProp) {
  return (
    <Link
      href={`/dashboard/project/${projectData.id}`}
      className="flex flex-col gap-3 text-white p-4 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-lg"
    >
      {/* Project heading */}
      <div className="flex flex-row justify-between items-center">
        <h2 className="font-bold">{projectData.name}</h2>
        <p className="h-fit px-2 text-sm text-blue-500 font-bold bg-gray-200 rounded">
          {projectData.created_at}
        </p>
      </div>
      {/* Project Main Information */}
      <div className="flex flex-col gap-3">
        <p className="text-sm">
          <span className="underline">Project Ownership:</span>{" "}
          <span className="h-fit px-2 text-sm text-blue-500 font-bold bg-gray-200 rounded">
            {projectData.ownership}
          </span>
        </p>
        <p className="text-sm">
          <span>Total Participants:</span>{" "}
          <span className="h-fit px-2 text-sm text-blue-500 font-bold bg-gray-200 rounded">
            {projectData.members.length}
          </span>
        </p>
      </div>
    </Link>
  );
}
