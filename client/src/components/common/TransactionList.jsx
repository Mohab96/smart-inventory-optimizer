import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../store/features/transactionSlices/transactionSlice";
import { data } from "react-router-dom";

const TransactionList = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today

  const {
    loading,
    data: transactions,
    error,
  } = useSelector((state) => state.transaction);

  useEffect(() => {
    dispatch(fetchTransactions(selectedDate)); // Fetch transactions for the selected date
  }, [dispatch, selectedDate]);

  console.log(transactions.data);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Transactions</h2>

      {/* Date Selection */}
      <input
        type="date"
        className="mb-4 p-2 border rounded"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* Loading & Error Handling */}
      {loading && <p>Loading transactions...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && transactions?.data?.length === 0 && (
        <p>No transactions found.</p>
      )}

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Product Name</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.map((transaction) => (
              <tr key={transaction.transactionId} className="border">
                <td className="p-3 border">
                  {transaction.product?.name || "N/A"}
                </td>
                <td className="p-3 border">{transaction.amount}</td>
                <td className="p-3 border">
                  ${transaction.batch.sellingPrice}
                </td>
                <td className="p-3 border">
                  {new Date(transaction.date?.fullDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
