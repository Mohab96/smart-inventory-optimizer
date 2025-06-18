import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  EyeIcon,
  XMarkIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";

const CsvSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedError, setSelectedError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/submission/csv`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch submissions");

        const { data } = await response.json();
        setSubmissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        icon: CheckCircleIcon,
        colors: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-200 dark:border-green-800"
      },
      processing: {
        icon: ArrowPathIcon,
        colors: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-800"
      },
      failed: {
        icon: XCircleIcon,
        colors: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800"
      }
    };

    const config = statusConfig[status.toLowerCase()] || {
      icon: ExclamationTriangleIcon,
      colors: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
      bg: "bg-gray-50 dark:bg-gray-900/20",
      border: "border-gray-200 dark:border-gray-800"
    };

    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${config.colors}`}>
        <IconComponent className="w-4 h-4" />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex justify-center items-center w-full">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading submissions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex justify-center items-center w-full">
            <div className="text-center p-8 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-200/50 dark:border-red-800/50">
              <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Error Loading Data</h2>
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ErrorModal = ({ error, onClose }) => {
    const parseErrors = () => {
      try {
        return JSON.parse(error);
      } catch (e) {
        return error;
      }
    };

    const errors = parseErrors();
    const isArray = Array.isArray(errors);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 via-pink-600 to-red-600 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <XCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Processing Errors
                  </h3>
                  {isArray && (
                    <p className="text-red-100 text-sm">
                      {errors.length} error{errors.length !== 1 ? 's' : ''} found
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-96">
            {isArray ? (
              <div className="space-y-4">
                {errors.map((err, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-700">
                          Row {err.rowNumber}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                          {err.error}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <pre className="whitespace-pre-wrap text-red-800 dark:text-red-300 text-sm font-mono">
                  {typeof errors === 'object' ? JSON.stringify(errors, null, 2) : errors}
                </pre>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col w-full p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <DocumentTextIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    CSV Submissions
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Track your CSV file processing history and status
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {submissions.filter(s => s.status.toLowerCase() === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                    <ArrowPathIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processing</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {submissions.filter(s => s.status.toLowerCase() === 'processing').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {submissions.filter(s => s.status.toLowerCase() === 'failed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Submission History
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Recent CSV file processing records
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Submission ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Upload Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {submissions.map((submission, index) => (
                      <tr
                        key={submission.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                              #{submission.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <ClockIcon className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">
                              {formatDistanceToNow(new Date(submission.uploadedDate))} ago
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(submission.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {submission.errors ? (
                            <button
                              onClick={() => setSelectedError(submission.errors)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                            >
                              <EyeIcon className="w-4 h-4" />
                              View Errors
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800">
                              <CheckCircleIcon className="w-4 h-4" />
                              No errors
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {submissions.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50">
                    <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                      No submissions found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500">
                      CSV submissions will appear here once uploaded
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {selectedError && (
        <ErrorModal
          error={selectedError}
          onClose={() => setSelectedError(null)}
        />
      )}
    </div>
  );
};

export default CsvSubmissions;
