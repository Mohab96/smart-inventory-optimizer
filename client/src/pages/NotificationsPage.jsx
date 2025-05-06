import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchNotifications = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/notifications/get-notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch notifications");
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = getAuthToken();
      await axios.delete(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/notifications/delete-notification/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Notification deleted successfully");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to delete notification");
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const renderNotificationContent = (description) => {
    if (typeof description === "string") {
      try {
        const parsedDescription = JSON.parse(description);
        description = parsedDescription;
      } catch {
        console.log("Not a JSON string, using as is");
        return description;
      }
    }

    // Handle structured notification content
    if (description.data) {
      const data = description.data;

      // Identify notification type using alertType
      switch (description.alertType) {
        case "PREDICTION":
          return (
            <div className="space-y-2">
              <p className="font-medium">Top predicted products in demand:</p>
              <ul className="list-disc pl-5 space-y-1">
                {data.map((item, index) => (
                  <li key={index}>
                    {item.productName}: {item.totalAmount} units (
                    {item.categoryName})
                  </li>
                ))}
              </ul>
            </div>
          );

        case "LOW_STOCK":
          return (
            <div className="space-y-2">
              <p className="font-medium">Low stock alert:</p>
              <ul className="list-disc pl-5 space-y-1">
                {data.map((item, index) => (
                  <li key={index}>
                    {item.productName}: Current stock {item.inventoryStock},
                    Predicted need {item.predictedStock}
                    (Shortage: {item.difference} units)
                  </li>
                ))}
              </ul>
            </div>
          );

        case "EXPIRING_SOON":
          return (
            <div className="space-y-2">
              <p className="font-medium">Products expiring soon:</p>
              <ul className="list-disc pl-5 space-y-1">
                {data.map((item, index) => (
                  <li key={index}>
                    {item.productName} ({item.categoryName}): Expires on{" "}
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          );

        default:
          console.log("Unknown notification type:", description.alertType);
          return JSON.stringify(description);
      }
    }

    return JSON.stringify(description);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications found</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-lg shadow-md p-4 flex justify-between items-start"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  {notification.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  {renderNotificationContent(notification.description)}
                </p>
                <p className="text-sm text-gray-400">
                  {formatDate(notification.date)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(notification.id)}
                className="text-red-500 hover:text-red-700 p-2 transition-colors"
                title="Delete notification"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
