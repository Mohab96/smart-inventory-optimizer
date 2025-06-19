import { useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTheme } from "./ThemeContext";

const DeleteModal = ({
  setShowDeleteModal,
  memberToDelete,
  setMemberToDelete,
  fetchStaffMembers,
}) => {
  const token = useSelector(selectToken);
  const { theme } = useTheme();
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
          className={`fixed inset-0 transition-opacity ${theme === 'dark' ? 'bg-gray-900 bg-opacity-90' : 'bg-gray-200 bg-opacity-70'}`}
          onClick={() => setShowDeleteModal(false)}
          role="button"
          aria-label="Close modal"
        />
        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${theme === 'dark' ? 'bg-gray-800 shadow-gray-950' : 'bg-white shadow-gray-300'}`}>
          {errorMessage && (
            <div className={`p-4 mt-2 mx-8 rounded-lg ${theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'}`}>{errorMessage}</div>
          )}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'} sm:mx-0 sm:h-10 sm:w-10`}>
                <svg className={`h-6 w-6 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className={`text-lg leading-6 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Delete team member</h3>
                <div className="mt-2">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Are you sure you want to delete {memberToDelete?.name}? This action cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}>
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 focus:ring-offset-gray-900' : 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 focus:ring-offset-gray-100'}`}
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
            <button
              type="button"
              className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${theme === 'dark' ? 'border-gray-600 bg-gray-600 hover:bg-gray-700 text-gray-200 focus:ring-purple-500 focus:ring-offset-gray-900' : 'border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-purple-400 focus:ring-offset-gray-100'}`}
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
