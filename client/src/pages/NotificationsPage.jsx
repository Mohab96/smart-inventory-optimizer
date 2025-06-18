import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectToken } from "../store/features/authSlice";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector(selectToken);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/notifications/get-notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const result = await response.json();
        setNotifications(result.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const handleDelete = (title, date) => {
    try {
      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            !(notification.title === title && notification.date === date)
        )
      );
      toast.success("Notification removed");
    } catch (error) {
      toast.error("Failed to remove notification");
      console.error("Error deleting notification:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const NotificationItem = ({ notification }) => {
    const { title, data, date } = notification;

    const getNotificationContent = () => {
      if (!data)
        return (
          <div className="text-gray-500 dark:text-gray-400">
            No data available
          </div>
        );

      if (title.includes("Expiring Soon")) {
        return (
          <div className="space-y-3">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              Expiring Products:
            </p>
            <ul className="space-y-2">
              {data.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {item.productName}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({item.categoryName})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Expires:{" "}
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                      {item.quantity && (
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-xs">
                          Qty: {item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      if (title.includes("Demand Prediction")) {
        return (
          <div className="space-y-3">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              High Demand Products:
            </p>
            <ul className="space-y-2">
              {data.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-900 dark:text-gray-100">
                        {item.productName}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({item.categoryName})
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Projected demand:
                      </span>
                      <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 px-2 py-1 rounded-full text-sm">
                        {item.totalAmount} units
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      if (title.includes("Low Stock")) {
        return (
          <div className="space-y-3">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              Stock Alert:
            </p>
            <ul className="space-y-2">
              {data.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-900 dark:text-gray-100">
                        {item.productName}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({item.categoryName})
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Current: {item.inventoryStock}
                      </span>
                      <span className="text-sm text-red-600 dark:text-red-400">
                        Needed: {item.predictedStock}
                      </span>
                      {item.difference && (
                        <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded-full text-sm">
                          Shortage: {item.difference}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <p className="font-medium text-gray-700 dark:text-gray-200">
            Notification details:
          </p>
          <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm overflow-auto text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h3>
            {getNotificationContent()}
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Received: {formatDate(date)}
            </p>
          </div>
          <button
            onClick={() => handleDelete(title, date)}
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 transition-colors"
            title="Delete notification"
          >
            <FaTrash className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col dark:bg-gray-700 min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 dark:bg-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Notifications
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Recent system notifications and alerts
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 rounded-xl bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No notifications available
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  New alerts will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {notifications.map((notification, index) => (
                  <NotificationItem
                    key={`${notification.title}-${notification.date}-${index}`}
                    notification={notification}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
