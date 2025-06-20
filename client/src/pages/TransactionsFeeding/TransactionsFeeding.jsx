import axios from "axios";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";
import { Link } from "react-router-dom";

const TransactionsFeeding = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const token = useSelector(selectToken);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setError(null);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/storage/upload/csv`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { URL: presignedUrl, signedToken } = response.data;
      const response1 = await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
          Authorization: `Bearer ${signedToken}`,
        },
      });
      console.log();
      const key = response1.data.Key;
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ack`,
        {
          path: key,
          type: transactionType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFile(null);
      setTransactionType("");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex flex-col w-full dark:bg-gray-900 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-4">
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight mb-2">
                  Upload Transactions
                </h1>
                <p className="text-gray-500 dark:text-gray-300 text-lg font-medium">
                  Select transaction type and upload your CSV file
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Transaction Type Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium dark:text-gray-300">
                  Transaction Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { type: "purchases", icon: (
                      <svg className="w-6 h-6 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" /></svg>
                    )},
                    { type: "sales", icon: (
                      <svg className="w-6 h-6 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    )},
                  ].map(({ type, icon }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTransactionType(type)}
                      className={`flex items-center justify-center p-4 rounded-xl border-2 font-semibold text-lg transition-all duration-200 shadow-md group
                        ${transactionType === type
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500 scale-105 shadow-lg"
                          : "bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:scale-105"}
                      `}
                    >
                      {icon}
                      <span className="capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload Section */}
              <div
                {...getRootProps()}
                className={`group cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 shadow-lg backdrop-blur-lg
                  ${isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" : "border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70"}
                  ${error ? "border-red-500 bg-red-50 dark:bg-red-900/30" : ""}
                  ${file ? "border-green-500 bg-green-50 dark:bg-green-900/30" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="mx-auto text-blue-400 group-hover:text-blue-500 dark:text-blue-300 group-hover:dark:text-blue-400 transition-colors">
                    <svg
                      className="w-16 h-16 mx-auto drop-shadow-lg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  {file ? (
                    <div>
                      <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Click to replace file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 text-lg">
                        {isDragActive ? (
                          <>Drop CSV file here</>
                        ) : (
                          <>Drag & drop CSV file or click to browse</>
                        )}
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        Supported format: .csv
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="flex items-center bg-red-100 dark:bg-red-900/30 p-4 rounded-xl text-red-700 dark:text-red-300 shadow-md transition-all duration-200">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {error}
                </div>
              )}

              {!success && (
                <button
                  type="submit"
                  disabled={loading || !file || !transactionType}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center shadow-lg
                    ${loading || !file || !transactionType
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500"}
                  `}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12l8-8 8 8" /></svg>
                      Upload Transactions
                    </>
                  )}
                </button>
              )}
            </form>

            {success && (
              <div className="text-center p-8 bg-gradient-to-br from-green-400/20 via-green-200/20 to-green-400/20 dark:from-green-900/40 dark:via-green-800/40 dark:to-green-900/40 rounded-2xl shadow-2xl mt-8">
                <div className="inline-block bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-full mb-4 shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                  Upload Successful!
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  Your transaction file has been processed successfully.
                </p>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <Link
                to="/csvsubmissions"
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" /></svg>
                Submissions Status
              </Link>
              <Link
                to="/dashboard"
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-lg font-semibold rounded-xl bg-gradient-to-r from-gray-400 to-gray-700 text-white hover:from-gray-500 hover:to-gray-800 shadow-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsFeeding;
