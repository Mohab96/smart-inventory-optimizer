import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";

const NewProductAddition = () => {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = useSelector(selectToken);
  const [categories, setCategories] = useState([]);
  const selectRef = useRef();
  const getCategories = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/categories`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    console.log("Data: ", formData);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || "Failed to add product");
      }

      selectRef?.current.clearValue();
      setFormData({ name: "", categoryId: null });
      setSuccessMessage("Product added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(
        error.message || "An error occurred while adding the product"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col w-full dark:bg-gray-900 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full">
            <div className="dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold dark:text-gray-200 mb-6">
                Add New Product
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium dark:text-gray-300 mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium dark:text-gray-300 mb-1"
                  >
                    Category
                  </label>
                  <Select
                    ref={selectRef}
                    options={categories.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    }))}
                    onChange={(selectedOption) =>
                      setFormData({
                        ...formData,
                        categoryId: selectedOption?.value,
                      })
                    }
                    value={
                      (
                        categories.find(
                          (cat) => cat.id === formData.categoryId
                        ) || null
                      )?.label
                    }
                    placeholder="Select a category"
                    isSearchable
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#374151",
                        borderColor: "#4b5563",
                        minHeight: "44px",
                        "&:hover": { borderColor: "#6b7280" },
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#374151",
                        color: "#e5e7eb",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                          ? "#4b5563"
                          : "#374151",
                        color: "#e5e7eb",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "#e5e7eb",
                      }),
                      input: (base) => ({
                        ...base,
                        color: "#e5e7eb",
                      }),
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-md font-medium transition 
                    ${
                      isLoading
                        ? "dark:bg-gray-600 dark:opacity-70 cursor-not-allowed"
                        : "dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
                    }`}
                >
                  {isLoading ? "Adding Product..." : "Add Product"}
                </button>

                {successMessage && (
                  <div className="mt-4 p-3 dark:bg-green-900/30 dark:text-green-400 rounded-md flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="mt-4 p-3 dark:bg-red-900/30 dark:text-red-400 rounded-md flex items-center gap-2">
                    <XCircleIcon className="w-5 h-5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductAddition;
