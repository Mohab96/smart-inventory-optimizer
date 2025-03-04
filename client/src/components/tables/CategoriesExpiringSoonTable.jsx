/* eslint-disable */

import DateCard from "../cards/DateCard";

const CategoriesExpiringSoonTable = ({ products }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-500 dark:text-gray-900">
          <tr>
            <th scope="col" className="px-6 py-3 ">
              Category name
            </th>
            <th scope="col" className="px-6 py-3">
              Product ID
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Expiry Date
            </th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <tr
                key={product.productId}
                className="bg-white border-b text-xl dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {product.productName}
                </th>
                <td className="px-6 py-4">{product.productId}</td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4 flex justify-center">
                  <DateCard dateString={product.expiryDate} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-white">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesExpiringSoonTable;
