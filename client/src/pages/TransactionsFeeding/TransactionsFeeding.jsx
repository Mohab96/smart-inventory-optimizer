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
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg mt-12 border">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Upload Transactions
        </h1>
        <p className="text-gray-500">
          Select transaction type and upload your CSV file
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Transaction Type *
          </label>
          <div className="grid grid-cols-2 gap-4">
            {["purchases", "sales"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTransactionType(type)}
                className={`p-4 rounded-lg border-2 transition-all
                  ${
                    transactionType === type
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
              >
                <span className="block text-sm font-medium capitalize">
                  {type}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* File Upload Section */}
        <div
          {...getRootProps()}
          className={`group cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors
            ${
              isDragActive
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200"
            }
            ${error ? "border-red-500 bg-red-50" : ""}
            ${file ? "border-green-500 bg-green-50" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto text-gray-400 group-hover:text-orange-500 transition-colors">
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
                <p className="text-gray-600 font-medium">{file.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Click to replace file
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600">
                  {isDragActive ? (
                    <>Drop CSV file here</>
                  ) : (
                    <>Drag & drop CSV file or click to browse</>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supported format: .csv
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center bg-red-50 p-4 rounded-lg text-red-700">
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
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
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
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <div className="inline-block bg-green-100 p-3 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-green-600"
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
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Upload Successful!
          </h3>
          <p className="text-gray-600 mb-4">
            Your transaction file has been processed successfully.
          </p>
        </div>
      )}
      <Link
        to="/csvsubmissions"
        className="mt-2 justify-center w-full inline-flex items-center px-6 py-3 border border-transparent text-md font-medium rounded-md text-white bg-orange-500 hover:bg-orange-700 transition-colors"
      >
        Submissions Status
      </Link>
      <Link
        to="/dashboard"
        className="mt-2 justify-center w-full inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-700 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default TransactionsFeeding;
