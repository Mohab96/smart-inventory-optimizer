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
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold dark:text-gray-200 mb-2">
                Upload Transactions
              </h1>
              <p className="dark:text-gray-400">
                Select transaction type and upload your CSV file
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium dark:text-gray-300">
                  Transaction Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["purchases", "sales"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTransactionType(type)}
                      className={`p-4 rounded-lg border-2 transition-all
                        ${
                          transactionType === type
                            ? "border-gray-500 dark:bg-gray-800"
                            : "dark:border-gray-700 hover:dark:border-gray-400"
                        }`}
                    >
                      <span className="block text-sm font-medium capitalize dark:text-gray-200">
                        {type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload Section */}
              <div
                {...getRootProps()}
                className={`group cursor-pointer rounded-xl border-2 border-dashed p-6 md:p-8 text-center transition-colors
                  ${
                    isDragActive
                      ? "dark:border-gray-500 dark:bg-gray-800"
                      : "dark:border-gray-700"
                  }
                  ${error ? "dark:border-red-500 dark:bg-red-900/30" : ""}
                  ${file ? "dark:border-green-500 dark:bg-green-900/30" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="mx-auto dark:text-gray-500 group-hover:dark:text-gray-500 transition-colors">
                    <svg
                      className="w-12 h-12 mx-auto"
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
                      <p className="dark:text-gray-300 font-medium">
                        {file.name}
                      </p>
                      <p className="text-sm dark:text-gray-500 mt-1">
                        Click to replace file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="dark:text-gray-400">
                        {isDragActive ? (
                          <>Drop CSV file here</>
                        ) : (
                          <>Drag & drop CSV file or click to browse</>
                        )}
                      </p>
                      <p className="text-sm dark:text-gray-500 mt-2">
                        Supported format: .csv
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="flex items-center dark:bg-red-900/30 p-4 rounded-lg dark:text-red-300">
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
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center
                    ${
                      loading || !file || !transactionType
                        ? "dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                        : "dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
                    }`}
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
                    "Upload Transactions"
                  )}
                </button>
              )}
            </form>

            {success && (
              <div className="text-center p-6 dark:bg-green-900/30 rounded-xl">
                <div className="inline-block dark:bg-green-800 p-3 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 dark:text-green-400"
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
                <h3 className="text-lg font-medium dark:text-gray-200 mb-2">
                  Upload Successful!
                </h3>
                <p className="dark:text-gray-400 mb-4">
                  Your transaction file has been processed successfully.
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Link
                to="/csvsubmissions"
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-md font-medium rounded-lg dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white transition-colors"
              >
                Submissions Status
              </Link>
              <Link
                to="/dashboard"
                className="w-full inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors"
              >
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
