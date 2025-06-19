import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";
import DeleteModal from "../../components/common/DeleteModal";
import AddModal from "../../components/common/AddModal";
import { useTheme } from "../../components/common/ThemeContext";

const StaffManagement = () => {
  const { theme } = useTheme();
  // States
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
  const token = useSelector(selectToken);

  const fetchStaffMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/staff?page=${currentPage}&orderBy=${orderBy}&sortOrder=${sortOrder}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch staff members");
      }
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
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        <div className={`flex flex-col w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-6 overflow-y-auto`}>
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-900/30 text-red-300 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className={`text-xl font-semibold lg:text-2xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
              Team Members
            </h2>

            <div className="w-full flex flex-wrap gap-3">
              <div className="relative flex-grow min-w-[260px]">
                <input
                  type="text"
                  placeholder="Search by name"
                  className={`w-full pl-3 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className={`absolute right-3 top-2.5 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
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

              <div className="flex flex-wrap gap-3 flex-grow">
                <select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                  className={`w-full md:w-[160px] pl-3 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="createdAt">Creation Time</option>
                  <option value="id">ID</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className={`w-full md:w-[120px] pl-3 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>

                <button
                  className={`w-full md:w-auto px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-900 text-gray-200' : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'}`}
                  onClick={() => setShowAddModal(true)}
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg overflow-hidden border`}>
            <div className={`grid grid-cols-12 px-6 py-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`col-span-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Name
              </div>
              <div className={`col-span-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Username
              </div>
              <div className={`col-span-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Phone Number
              </div>
              <div className={`col-span-1 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            </div>

            {isLoading ? (
              <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading team members...
              </div>
            ) : teamMembers.length > 0 ? (
              teamMembers
                .filter((member) =>
                  member.name?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((member) => (
                  <div
                    key={member.id}
                    className={`grid grid-cols-12 px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-900' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                  >
                    <div className="col-span-4">
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        {member.name || "N/A"}
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} overflow-auto`}>
                        {member.email}
                      </div>
                    </div>
                    <div className={`col-span-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {member.username}
                    </div>
                    <div className="col-span-3">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {member.phoneNumber || "N/A"}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => {
                          setMemberToDelete(member);
                          setShowDeleteModal(true);
                        }}
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
                ))
            ) : (
              <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                No team members found
              </div>
            )}
          </div>

          <div className={`mt-4 flex justify-between items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : theme === 'dark' 
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Previous
            </button>
            <span className="font-medium">Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            // Handle delete confirmation
            setShowDeleteModal(false);
            setMemberToDelete(null);
          }}
          title="Delete Team Member"
          message={`Are you sure you want to delete ${memberToDelete?.name}? This action cannot be undone.`}
        />
      )}

      {showAddModal && (
        <AddModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onConfirm={(data) => {
            // Handle add confirmation
            setShowAddModal(false);
          }}
          title="Add Team Member"
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "username", label: "Username", type: "text", required: true },
            { name: "phoneNumber", label: "Phone Number", type: "tel" },
          ]}
        />
      )}
    </div>
  );
};

export default StaffManagement;
