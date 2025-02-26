import axios from "axios";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";
  
const TransactionsFeeding = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = useSelector(selectToken);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
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

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Get pre-signed URL from our server
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/storage/upload/csv`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { URL: presignedUrl, signedToken } = response.data;
      // Step 2: Upload directly to cloud storage using pre-signed URL
      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
          Authorization: `Bearer ${signedToken}`,
        },
      });
      setSuccess(true);
      setFile(null);
    } catch (err) {
      setError(err ? err.response.data.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        CSV Upload
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            ${isDragActive ? "border-orange-500 bg-orange-50" : "border-gray-300"}
            ${error ? "border-red-500 bg-red-50" : ""}`}
        >
          <input {...getInputProps()} />

          {file ? (
            <p className="text-gray-600">{file.name}</p>
          ) : (
            <div>
              <p className="text-gray-600">
                {isDragActive
                  ? "Drop CSV here"
                  : "Drag & drop CSV, or click to select"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Only *.csv files accepted
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {!success && (
          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-2 px-4 rounded-md text-white transition-colors
            ${
              loading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? "Uploading..." : "Upload CSV"}
          </button>
        )}
      </form>
      {success && (
        <div className="flex flex-col items-center">
          <p className="text-green-500 text-sm text-center">
            File uploaded successfully!
          </p>
        </div>
      )}
    </div>
  );
};
export default TransactionsFeeding;
