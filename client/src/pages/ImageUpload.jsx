import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectToken } from "../store/features/authSlice";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const ImageUpload = () => {
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
      setError(err ? err.response.data.message : "Can't Replace your image");
    }
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      // Step 1: Get pre-signed URL from our server
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/storage/upload/image`,
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
      setPreview(null);
    } catch (err) {
      setError(err ? err.response.data.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col w-full dark:bg-gray-900 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full">
            <div className="dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold dark:text-gray-200 mb-6">
                Upload Business Image
              </h2>

              <div className="space-y-4">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${
                      isDragActive
                        ? "dark:border-gray-500 dark:bg-gray-700"
                        : "dark:border-gray-600"
                    }
                    ${error ? "dark:border-red-500 dark:bg-red-900/30" : ""}`}
                >
                  <input {...getInputProps()} />

                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-40 mx-auto mb-4 rounded-lg object-cover dark:border-gray-700"
                    />
                  ) : (
                    <div>
                      <p className="dark:text-gray-400">
                        {isDragActive
                          ? "Drop image here"
                          : "Drag & drop image, or click to select"}
                      </p>
                      <p className="text-sm dark:text-gray-500 mt-2">
                        Supported formats: JPEG, JPG, PNG, WEBP
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="dark:text-red-400 text-sm text-center">
                    {error}
                  </p>
                )}

                {success && (
                  <div className="flex flex-col items-center">
                    <p className="dark:text-green-400 text-sm text-center">
                      Image uploaded successfully!
                    </p>
                    <Link
                      to="/dashboard"
                      className="mt-4 w-full max-w-48 text-center py-2 px-4 rounded-md dark:text-white transition-colors dark:bg-gray-600 dark:hover:bg-gray-700"
                    >
                      Continue
                    </Link>
                  </div>
                )}

                {file && (
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md transition-colors
                      ${
                        loading
                          ? "dark:bg-cyan-700-400 dark:opacity-70 cursor-not-allowed"
                          : "dark:bg-cyan-700 dark:hover:bg-cyan-800 dark:text-white"
                      }`}
                  >
                    {loading ? "Uploading..." : "Upload Image"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
