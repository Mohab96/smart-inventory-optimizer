import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectToken } from "../store/features/authSlice";

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
    if (!file) {
      setError("Please select an image first");
      return;
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

      try {
        // Step 2: Upload directly to cloud storage using pre-signed URL
        await axios.put(presignedUrl, file, {
          headers: {
            "Content-Type": file.type,
            Authorization: `Bearer ${signedToken}`,
          },
        });

        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
        setFile(null);
        setPreview(null);
      } catch (error) {
        console.log(error + "Second");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message + "First" : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Business Image Upload
      </h2>

      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            ${error ? "border-red-500 bg-red-50" : ""}`}
        >
          <input {...getInputProps()} />

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 mx-auto mb-4 rounded-lg object-cover"
            />
          ) : (
            <div>
              <p className="text-gray-600">
                {isDragActive
                  ? "Drop image here"
                  : "Drag & drop image, or click to select"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: JPEG, PNG, WEBP
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {success && (
          <p className="text-green-500 text-sm text-center">
            Image uploaded successfully!
          </p>
        )}

        {file && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white transition-colors
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
