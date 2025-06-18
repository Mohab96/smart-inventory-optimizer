import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import TransactionList from "../../components/common/TransactionList";

const Transactions = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto dark:bg-gray-700">
          <TransactionList />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
