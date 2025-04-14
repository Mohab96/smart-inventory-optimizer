import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import Spinner from "../../components/common/Spinner";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";

const CsvSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          ${statusColors[status.toLowerCase()] || "dark:bg-gray-700 dark:text-gray-300"}`}
      >
        {status}
      </span>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center p-8 dark:bg-gray-900">
        <Spinner size="lg" className="dark:text-white" />
      </div>
    );
  if (error) return <div className="p-4 dark:text-red-400 text-center">{error}</div>;

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
                              {submission.errors ? (
                                <div className="group relative">
                                  <span className="dark:text-red-400 cursor-help border-b border-dashed dark:border-red-600">
                                    View Errors
                                  </span>
                                  <div className="hidden group-hover:block absolute bottom-full left-0 w-64 p-2 text-sm dark:bg-gray-900 dark:text-red-300 shadow-lg rounded-lg dark:border dark:border-gray-700 z-10">
                                    {submission.errors}
                                  </div>
                                </div>
                              ) : (
                                <span className="dark:text-gray-500">No errors</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {submissions.length === 0 && (
                      <div className="text-center py-8 dark:bg-gray-800">
                        <p className="dark:text-gray-400">No submissions found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsvSubmissions;
