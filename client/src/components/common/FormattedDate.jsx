import { format, formatDistanceToNow } from "date-fns";
import { Calendar, Clock } from "lucide-react";

const FormattedDate = ({ 
  date, 
  format: dateFormat = "full", 
  showIcon = true,
  showTime = false,
  showRelative = false,
  className = ""
}) => {
  const isValidDate = (d) => d instanceof Date && !isNaN(d);

  const getFormattedDate = () => {
    const dateObj = new Date(date);
    if (!isValidDate(dateObj)) return "N/A";
    switch (dateFormat) {
      case "full":
        return format(dateObj, "MMMM dd, yyyy");
      case "short":
        return format(dateObj, "MMM dd, yyyy");
      case "numeric":
        return format(dateObj, "MM/dd/yyyy");
      case "time":
        return format(dateObj, "hh:mm a");
      case "datetime":
        return format(dateObj, "MMM dd, yyyy hh:mm a");
      default:
        return format(dateObj, "MMMM dd, yyyy");
    }
  };

  const getRelativeTime = () => {
    const dateObj = new Date(date);
    if (!isValidDate(dateObj)) return "";
    return formatDistanceToNow(dateObj, { addSuffix: true });
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && (
        <div className="flex-shrink-0">
          {showTime ? (
            <Clock className="h-4 w-4 text-gray-400" />
          ) : (
            <Calendar className="h-4 w-4 text-gray-400" />
          )}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-200">
          {getFormattedDate()}
        </span>
        {showRelative && (
          <span className="text-xs text-gray-400">
            {getRelativeTime()}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormattedDate; 