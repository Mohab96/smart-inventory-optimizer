import { useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";
import PropTypes from "prop-types";
import { useState } from "react";

const DeleteModal = ({
  setShowDeleteModal,
  memberToDelete,
  setMemberToDelete,
  fetchStaffMembers,
}) => {
  const token = useSelector(selectToken);
  const [errorMessage, setErrorMessage] = useState("");
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/staff/${memberToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete member");
      }
      setErrorMessage("");
      setShowDeleteModal(false);
      setMemberToDelete(null);
      await fetchStaffMembers();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 dark:bg-gray-900 dark:bg-opacity-90 transition-opacity"
          onClick={() => setShowDeleteModal(false)}
          role="button"
          aria-label="Close modal"
        />
        <div className="inline-block align-bottom dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-gray-950 transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {errorMessage && (
            <div className="p-4 mt-2 mx-8 dark:bg-red-900/30 dark:text-red-300 rounded-lg">
              {errorMessage}
            </div>
          )}
          <div className="dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 dark:text-red-400"
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
                <h3 className="text-lg leading-6 font-medium dark:text-gray-200">
                  Delete team member
                </h3>
                <div className="mt-2">
                  <p className="text-sm dark:text-gray-400">
                    Are you sure you want to delete {memberToDelete?.name}? This
                    action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 text-base font-medium dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:dark:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border dark:border-gray-600 shadow-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:dark:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteModal.propTypes = {
  setShowDeleteModal: PropTypes.func.isRequired,
  memberToDelete: PropTypes.object,
  setMemberToDelete: PropTypes.func.isRequired,
  fetchStaffMembers: PropTypes.func.isRequired,
};

export default DeleteModal;
