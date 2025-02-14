import React, { useState } from "react";

const StaffManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  // Handlers
  const handleAddMember = () => {};

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // API
    setTeamMembers((prevMembers) =>
      prevMembers.filter((member) => member.email !== memberToDelete.email)
    );
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  // Data
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
      username: "Hany",
      phone: "01009109553",
    },
  ];

  const DeleteModal = () => (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleCancelDelete}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                {/* Warning icon */}
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete team member
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete {memberToDelete?.name}? This
                    action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleCancelDelete}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="my-8 mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name"
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={handleAddMember}
          >
            <span>Add Member</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="col-span-4 text-sm font-medium text-gray-500">
            Name
          </div>
          <div className="col-span-4 text-sm font-medium text-gray-500">
            Username
          </div>
          <div className="col-span-3 text-sm font-medium text-gray-500">
            Phone Number
          </div>
          <div className="col-span-1 text-sm font-medium text-gray-500" />
        </div>

        {/* Table Body */}
        {StaffManagement.map((member, index) => (
          <div
            key={index}
            className="grid grid-cols-12 px-6 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
          >
            <div className="col-span-4">
              <div className="text-sm font-medium text-gray-900">
                {member.name}
              </div>
              <div className="text-sm text-gray-500">{member.email}</div>
            </div>
            <div className="col-span-4">{member.username}</div>
            <div className="col-span-3">
              <span className="text-sm text-gray-900">{member.phone}</span>
            </div>
            <div className="col-span-1 flex justify-end">
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => handleDeleteClick(member)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default StaffManagement;
