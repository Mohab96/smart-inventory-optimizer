import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";
import PropTypes from "prop-types";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";

const ImageUpload = ({ isRegistrationFlow = false }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = useSelector(selectToken);

  // Configure dropzone for image files
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size should not exceed 5MB");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      setSuccess(false);
    },
  });

  const handleUpload = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/storage/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      setError(err ? err.response?.data?.message : "Can't replace your image");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/storage/upload/image`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { URL: presignedUrl, signedToken } = response.data;

      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
          Authorization: `Bearer ${signedToken}`,
        },
      });
      setSuccess(true);
    } catch (err) {
      setError(err ? err.response?.data?.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${
            isDragActive
              ? "border-indigo-500 bg-indigo-500/10"
              : "border-gray-600 hover:border-gray-500"
          }
          ${error ? "border-red-500 bg-red-900/10" : ""}
          ${preview ? "border-blue-500 bg-blue-900/10" : ""}`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg object-contain"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <p className="text-white text-sm">
                Click or drag to change image
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-300">
                {isDragActive
                  ? "Drop image here"
                  : "Drag & drop image, or click to select"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Maximum file size: 5MB
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: JPEG, JPG, PNG, WEBP
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="animate-shake bg-red-900/30 text-red-200 rounded-lg p-4 text-sm flex items-center border border-red-700/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 text-green-200 rounded-lg p-4 text-sm flex items-center border border-green-700/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Image uploaded successfully!
        </div>
      )}

      {file && !success && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transform transition-all duration-200 hover:scale-[1.02] ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="flex items-center">
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
            </div>
          ) : (
            "Upload Image"
          )}
        </button>
      )}
    </div>
  );

  // If it's not part of registration flow, show the full page layout
  if (!isRegistrationFlow) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <div className="flex flex-1">
          <div className="flex-1 p-8">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Upload Business Image
                </h2>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For registration flow, return just the content
  return renderContent();
};

ImageUpload.propTypes = {
  isRegistrationFlow: PropTypes.bool,
};

export default ImageUpload;
