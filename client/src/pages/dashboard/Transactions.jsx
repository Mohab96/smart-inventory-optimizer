import TransactionList from "../../components/common/TransactionList";
import { useTheme } from "../../components/common/ThemeContext";

const Transactions = () => {
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-col">
      <div className="flex flex-1 overflow-hidden">

        {/* Main Content */}
        <div className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <TransactionList />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
