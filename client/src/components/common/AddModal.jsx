import { useState } from "react";
import PropTypes from "prop-types";

const AddModal = ({
  token,
  fetchStaffMembers,
  showAddModal,
  setShowAddModal,
  initialStaffState,
}) => {
  const [newStaff, setNewStaff] = useState(initialStaffState);
  const [errorMessage, setErrorMessage] = useState("");
  const handleAddStaff = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/staff`,
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
        throw new Error(errorData.message || "Failed to create staff");
      }
      setErrorMessage("");
      setShowAddModal(false);
      setNewStaff(initialStaffState);
      await fetchStaffMembers();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 dark:bg-gray-900 dark:bg-opacity-90 transition-opacity"
          onClick={() => setShowAddModal(false)}
        ></div>
        <div className="inline-block align-bottom dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-gray-950 transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {errorMessage && (
            <div className="p-4 mt-2 mx-8 dark:bg-red-900/30 dark:text-red-300 rounded-lg">
              {errorMessage}
            </div>
          )}
          <div className="dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium dark:text-gray-200">
                  Add New Staff Member
                </h3>
                <div className="mt-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium dark:text-gray-300">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="p-2 mt-1 block w-full rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:dark:border-purple-500 focus:dark:ring-purple-500 sm:text-sm"
                      value={newStaff.email}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium dark:text-gray-300">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      className="p-2 mt-1 block w-full rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:dark:border-purple-500 focus:dark:ring-purple-500 sm:text-sm"
                      value={newStaff.username}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, username: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium dark:text-gray-300">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      className="p-2 mt-1 block w-full rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:dark:border-purple-500 focus:dark:ring-purple-500 sm:text-sm"
                      value={newStaff.password}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, password: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium dark:text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      className="p-2 mt-1 block w-full rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:dark:border-purple-500 focus:dark:ring-purple-500 sm:text-sm"
                      value={newStaff.name}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium dark:text-gray-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="p-2 mt-1 block w-full rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:dark:border-purple-500 focus:dark:ring-purple-500 sm:text-sm"
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
          <div className="dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-base font-medium dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:dark:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleAddStaff}
            >
              Add
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border dark:border-gray-600 shadow-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:dark:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default AddModal;
