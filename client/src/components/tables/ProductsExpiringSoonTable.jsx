/* eslint-disable */

import { AlertTriangle } from "lucide-react";
import FormattedDate from "../common/FormattedDate";
import ExpiryCountdown from "../common/ExpiryCountdown";
import QuantityIndicator from "../common/QuantityIndicator";

const ExpiryProductsTable = ({ products }) => {
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (daysUntilExpiry) => {
    if (daysUntilExpiry <= 7) return "critical";
    if (daysUntilExpiry <= 30) return "warning";
    return "normal";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-900/20 text-red-400 border-red-500/50";
      case "warning":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-green-900/20 text-green-400 border-green-500/50";
    }
  };

  return (
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-800/50">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Product Name
          </th>
          <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
            Expiry Date
          </th>
          <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
            Days Until Expiry
          </th>
          <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
            Quantity
          </th>
          <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="bg-gray-800 divide-y divide-gray-700">
        {products.map((product, index) => {
          const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
          const status = getExpiryStatus(daysUntilExpiry);
          const statusColor = getStatusColor(status);

          return (
            <tr
              key={index}
              className="hover:bg-gray-700/50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-left">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">
                      {product.productName}
                    </div>
                    <div className="text-sm text-gray-400">
                      SKU: {product.sku || "N/A"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex flex-col items-center justify-center">
                  {product.expiryDate ? (
                    <FormattedDate 
                      date={product.expiryDate} 
                      format="short"
                      showRelative={true}
                    />
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center">
                  <ExpiryCountdown 
                    expiryDate={product.expiryDate}
                    size="sm"
                    showIcon={false}
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center">
                  <QuantityIndicator 
                    quantity={product.quantity}
                    size="sm"
                    showIcon={false}
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusColor}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ExpiryProductsTable;
