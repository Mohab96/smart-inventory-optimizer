const StaffManagement2 = () => {
  const StaffManagement = [
    {
      name: "Olivia Rhye",
      email: "olivia@lantern.com",
      username: "Ahmed",
      phone: "01099623788",
    },
    {
      name: "Guy Hawkins",
      email: "guy@lantern.com",
      username: "Ghazal",
      phone: "01005801893",
    },
    {
      name: "Esther Howard",
      email: "esther@lantern.com",
      username: "Soad Mostafa",
      phone: "01009109553",
    },
  ];
  return (
    <div className="max-w-4xl mx-auto my-12 py-4 px-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name"
              className="border border-gray-300 pl-2 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            className="bg-purple-600 hover:bg-purple-700 
          px-4 py-2 rounded-lg text-white "
          >
            Add Member
          </button>
        </div>
      </div>
      <div className="mt-8 border rounded-lg text-gray-500">
        {/* Table Header */}
        <div className="px-4 py-2 grid grid-cols-12 bg-gray-50">
          <div className="ml-2 col-span-3">Name</div>
          <div className="col-span-4">Username</div>
          <div className="col-span-5">Phone Number</div>
        </div>
        {/* Table Body */}
        {StaffManagement.map((member, ind) => {
          return (
            <div
              key={ind}
              className="grid grid-cols-12 px-4 py-4 mb-2 border-b last:border-b-0"
            >
              <div className="col-span-3 ml-2">{member.name}</div>
              <div className="col-span-4">{member.username}</div>
              <div className="col-span-5">{member.phone}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default StaffManagement2;
