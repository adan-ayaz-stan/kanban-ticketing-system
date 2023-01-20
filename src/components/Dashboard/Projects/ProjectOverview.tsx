type componentProp = {
  projectData: {
    currentStatus: String;
    projectName: String;
    projectCreationDate: String;
    totalMembers: number;
  };
};

export default function ProjectOverview({ projectData }: componentProp) {
  return (
    <div className="text-black p-4 bg-gradient-to-r from-green-400 to-cyan-300 rounded-lg">
      {/* Project heading */}
      <div className="flex flex-row justify-between items-center">
        <h2 className="font-bold">{projectData.projectName}</h2>
        <p className="h-fit px-2 text-sm text-black bg-gray-200 rounded">
          {projectData.projectCreationDate}
        </p>
      </div>
      {/* Project Main Information */}
      <div>
        <p>{projectData.currentStatus}</p>
        <p>{projectData.totalMembers}</p>
      </div>
    </div>
  );
}
