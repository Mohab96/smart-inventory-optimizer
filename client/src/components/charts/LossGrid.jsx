import MonthCard from "../cards/MonthCard";
import { TrendingDown, AlertTriangle, CalendarDays } from "lucide-react";

const LossGrid = ({ lowStockProduct, expiringCategory, expiringProduct }) => {
  // Low stock product info
  const lowStockProductName = lowStockProduct?.product?.name || "N/A";
  const lowStockProductQty = lowStockProduct?.currentStock ?? "N/A";

  // Expiring category info
  const firstProductInCategory = expiringCategory?.products?.[0];
  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return "N/A";
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : "Expired";
  };
  const expiringCategoryName = expiringCategory?.categoryName || "N/A";
  const expiringProductName = firstProductInCategory?.productName || "N/A";
  const daysUntilExpiryForCategoryProduct = getDaysUntilExpiry(firstProductInCategory?.batches?.[0]?.expiryDate);

  // Expiring product info
  const expiringProductNameCard = expiringProduct?.productName || "N/A";
  const expiringProductDaysLeft = getDaysUntilExpiry(expiringProduct?.expiryDate);
  const expiringProductQty = expiringProduct?.quantity ?? "N/A";

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-5 bg-transparent">
      <MonthCard
        value={lowStockProductName}
        label={`Stock: ${lowStockProductQty}`}
        percentage={typeof lowStockProductQty === 'number' ? `${lowStockProductQty} units` : "N/A"}
        color={lowStockProductQty <= 5 ? "text-red-400" : lowStockProductQty <= 20 ? "text-yellow-400" : "text-green-400"}
        path="/lowStockProducts"
        cardIcon={AlertTriangle}
        percentageIcon={TrendingDown}
      />

      <MonthCard
        value={expiringCategoryName}
        label={expiringProductName}
        percentage={`${daysUntilExpiryForCategoryProduct} days left`}
        color={daysUntilExpiryForCategoryProduct <= 7 ? "text-red-400" : "text-yellow-400"}
        path="/categoriesExpiringSoon"
        cardIcon={AlertTriangle}
        percentageIcon={CalendarDays}
      />

      <MonthCard
        value={expiringProductNameCard}
        label={`Qty: ${expiringProductQty}`}
        percentage={`${expiringProductDaysLeft} days left`}
        color={expiringProductDaysLeft <= 7 ? "text-red-400" : "text-yellow-400"}
        path="/expiryDateProducts"
        cardIcon={AlertTriangle}
        percentageIcon={CalendarDays}
      />
    </div>
  );
};

export default LossGrid;
