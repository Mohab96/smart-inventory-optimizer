import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";
import { useState } from "react";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = useSelector(selectToken);
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Upload business&apos;s image
      </h2>

      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            ${isDragActive ? "border-orange-500 bg-orange-50" : "border-gray-300"}
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
                Supported formats: JPEG, JPG, PNG, WEBP
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {success && (
          <div className="flex flex-col items-center">
            <p className="text-green-500 text-sm text-center">
              Image uploaded successfully!
            </p>
          </div>
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
                  : "bg-orange-600 hover:bg-orange-700"
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
