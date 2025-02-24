import { useState } from "react";
import { useDropzone } from "react-dropzone";

const TransactionsFeeding = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
    if (!file) {
      setError("Please select a CSV file first");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/storage/upload/csv`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/csv",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSuccess(true);
      setFile(null);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">CSV Upload</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
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

        {success && (
          <p className="text-green-500 text-sm text-center">
            File uploaded successfully!
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full py-2 px-4 rounded-md text-white transition-colors
            ${
              loading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </form>
    </div>
  );
};

export default TransactionsFeeding;
