import TransactionList from "../../components/common/TransactionList";

const Transactions = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-1 overflow-hidden">

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto dark:bg-gray-700">
          <TransactionList />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
