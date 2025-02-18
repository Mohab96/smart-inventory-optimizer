import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/features/tokenSlice";

const StaffManagement = () => {
  const token = useSelector(selectToken);
  useEffect(() => {
    if (!token) {
      return "Loading...";
    }
  }, [token]);
  console.log(token);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchStaffMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://smart-inventory-optimizer.vercel.app/api/staff?page=${currentPage}&orderBy=${orderBy}&sortOrder=${sortOrder}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const j = await response.json();
        console.log(j.message);
      }
      console.log("Ok");
      const data = await response.json();
      console.log(data.data);
      setTeamMembers(data.data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, [currentPage, orderBy, sortOrder, token]);

  const handleAddMember = () => setShowAddModal(true);

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`/api/staff/${memberToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete member");
      }
      await fetchStaffMembers();
      setShowDeleteModal(false);
      setMemberToDelete(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const DeleteModal = () => (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setShowDeleteModal(false)}
        ></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
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
              onClick={() => setShowDeleteModal(false)}
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
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}
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
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="createdAt">Creation Time</option>
            <option value="id">ID</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={handleAddMember}
          >
            Add Member
          </button>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Add Table Body */}
        {isLoading ? (
          <div className="text-center py-4">Loading team members...</div>
        ) : teamMembers.length > 0 ? (
          teamMembers
            .filter((member) =>
              member.name?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-12 px-6 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
              >
                <div className="col-span-4">
                  <div className="text-sm font-medium text-gray-900">
                    {member.name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </div>
                <div className="col-span-4">{member.username}</div>
                <div className="col-span-3">
                  <span className="text-sm text-gray-900">
                    {member.phoneNumber || "N/A"}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleDeleteClick(member)}
                  >
                    {/* Your existing delete icon SVG */}
                  </button>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-4">No team members found</div>
        )}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={teamMembers.length < 5}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {showDeleteModal && <DeleteModal />}
      {showAddModal && (
        <AddModal
          token={token}
          fetchStaffMembers={fetchStaffMembers}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          initialStaffState={{
            name: "",
            email: "",
            username: "",
            password: "",
            phoneNumber: "",
          }}
        />
      )}
    </div>
  );
};

const AddModal = ({
  token,
  fetchStaffMembers,
  showAddModal,
  setShowAddModal,
  initialStaffState,
}) => {
  const [newStaff, setNewStaff] = useState(initialStaffState);

  // const handleAddStaff = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://smart-inventory-optimizer.vercel.app/api/staff",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           staff: {
  //             name: localStaff.name || undefined,
  //             email: localStaff.email,
  //             username: localStaff.username,
  //             password: localStaff.password,
  //             phoneNumber: localStaff.phoneNumber || undefined,
  //           },
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to create staff");
  //     }

  //     await fetchStaffMembers();
  //     setShowAddModal(false);
  //     setLocalStaff(initialStaffState);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setShowAddModal(false)}
        ></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Add New Staff Member
                </h3>
                <div className="mt-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      value={newStaff.email}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      value={newStaff.username}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, username: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      value={newStaff.password}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, password: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      value={newStaff.name}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      value={newStaff.phoneNumber}
                      onChange={(e) =>
                        setNewStaff({
                          ...newStaff,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={async () => {
                try {
                  const response = await fetch(
                    "https://smart-inventory-optimizer.vercel.app/api/staff",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        staff: {
                          name: newStaff.name || undefined,
                          email: newStaff.email,
                          username: newStaff.username,
                          password: newStaff.password,
                          phoneNumber: newStaff.phoneNumber || undefined,
                        },
                      }),
                    }
                  );
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                      errorData.message || "Failed to create staff"
                    );
                  }
                  await fetchStaffMembers();
                  setShowAddModal(false);
                  setNewStaff({
                    name: "",
                    email: "",
                    username: "",
                    password: "",
                    phoneNumber: "",
                  });
                } catch (error) {
                  setErrorMessage(error.message);
                }
              }}
            >
              Add
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
AddModal.propTypes = {
  token: PropTypes.string.isRequired,
  fetchStaffMembers: PropTypes.func.isRequired,
  showAddModal: PropTypes.bool.isRequired,
  setShowAddModal: PropTypes.func.isRequired,
  initialStaffState: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
    phoneNumber: PropTypes.string,
  }).isRequired,
};

export default StaffManagement;
