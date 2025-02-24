// src/pages/NotFound.jsx
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl font-bold text-green-600 mb-4">Soon</h1>
        <p className="text-2xl font-bold text-gray-800 mb-4">
          Still working on it
        </p>
        <p className="text-gray-600 text-lg font-semibold mb-8">
          {`This feature is under development. We're working hard to bring it to you soon. Stay tuned for updates!`}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Go Back
          </button>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
