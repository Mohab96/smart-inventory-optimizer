import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
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
    const statusColors = {
      completed: "dark:bg-green-900/30 dark:text-green-400",
      processing: "dark:bg-yellow-900/30 dark:text-yellow-400",
      failed: "dark:bg-red-900/30 dark:text-red-400",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
          ${
            statusColors[status.toLowerCase()] ||
            "dark:bg-gray-700 dark:text-gray-300"
          }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error)
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="p-10 dark:text-red-400 text-center">{error}</div>;
        </div>
      </div>
    );
  const ErrorModal = ({ error, onClose }) => {
    // Try to parse the error JSON
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">
              Processing Errors {isArray && `(${errors.length} found)`}
            </h3>
            <button
              onClick={onClose}
              className="dark:text-gray-400 hover:dark:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="dark:bg-gray-900 p-4 rounded-md overflow-y-auto max-h-96">
            {isArray ? (
              <div className="space-y-3">
                {errors.map((err, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 dark:bg-gray-800 rounded-md border dark:border-gray-700"
                  >
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-400">
                        Row {err.rowNumber}
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm dark:text-red-300 m-0">
                        {err.error}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="whitespace-pre-wrap dark:text-red-300 text-sm">
                {typeof errors === 'object' ? JSON.stringify(errors, null, 2) : errors}
              </pre>
            )}
          </div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:dark:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col w-full dark:bg-gray-900 p-6 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold dark:text-gray-200">
                  CSV Submissions
                </h1>
                <p className="mt-2 text-sm dark:text-gray-400">
                  Recent CSV file processing history
                </p>
              </div>
            </div>

            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow dark:shadow-gray-700 sm:rounded-lg">
                    <table className="min-w-full dark:divide-gray-700">
                      <thead className="dark:bg-gray-800">
                        <tr>
                          <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold dark:text-gray-300 sm:pl-6">
                            ID
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold dark:text-gray-300">
                            Uploaded
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold dark:text-gray-300">
                            Status
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold dark:text-gray-300">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="dark:divide-gray-700">
                        {submissions.map((submission) => (
                          <tr
                            key={submission.id}
                            className="dark:bg-gray-800 hover:dark:bg-gray-700 transition-colors"
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-gray-200 sm:pl-6">
                              #{submission.id}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-400">
                              <div className="flex items-center">
                                <span className="mr-2">🕒</span>
                                {formatDistanceToNow(
                                  new Date(submission.uploadedDate)
                                )}{" "}
                                ago
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              {getStatusBadge(submission.status)}
                            </td>
                            <td className="px-3 py-4 text-sm">
                              <td className="px-3 py-4 text-sm">
                                {submission.errors ? (
                                  <button
                                    onClick={() =>
                                      setSelectedError(submission.errors)
                                    }
                                    className="dark:text-red-400 hover:dark:text-red-300 underline cursor-pointer"
                                  >
                                    View Errors
                                  </button>
                                ) : (
                                  <span className="dark:text-gray-500">
                                    No errors
                                  </span>
                                )}
                              </td>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {submissions.length === 0 && (
                      <div className="text-center py-8 dark:bg-gray-800">
                        <p className="dark:text-gray-400">
                          No submissions found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
