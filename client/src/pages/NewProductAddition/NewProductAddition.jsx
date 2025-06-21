import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";
import Header from "../../components/common/Header";

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
    <div className="h-auto flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-1">
        <div className="flex flex-col w-full p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <CubeIcon className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Add New Product
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Expand your inventory with new products
                  </p>
                </div>
              </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white/20 dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/30 dark:border-gray-800/70 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <PlusIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Product Information
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Fill in the details below to add a new product
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product Name Field */}
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    >
                      Product Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 hover:border-gray-300 dark:hover:border-gray-500"
                        placeholder="Enter product name"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="group">
                    <label
                      htmlFor="categoryId"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
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
                          categoryId: selectedOption?.value ?? null,
                        })
                      }
                      value={
                        categories.find((cat) => cat.id === formData.categoryId)
                          ? {
                              value: formData.categoryId,
                              label: categories.find(
                                (cat) => cat.id === formData.categoryId
                              )?.name,
                            }
                          : null
                      }
                      placeholder="Select a category"
                      isSearchable
                      menuPortalTarget={document.body} // 👈 Renders dropdown portal into body
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#f9fafb",
                          borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
                          borderWidth: "2px",
                          minHeight: "56px",
                          borderRadius: "12px",
                          boxShadow: state.isFocused
                            ? "0 0 0 4px rgba(59, 130, 246, 0.1)"
                            : "none",
                          "&:hover": {
                            borderColor: state.isFocused
                              ? "#3b82f6"
                              : "#d1d5db",
                            backgroundColor: "#f3f4f6",
                          },
                          transition: "all 0.3s ease",
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "#ffffff",
                          border: "2px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          overflow: "hidden",
                          zIndex: 9999, // 👈 Ensures dropdown is on top
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused
                            ? "#eff6ff"
                            : "#ffffff",
                          color: state.isFocused ? "#1e40af" : "#374151",
                          padding: "12px 16px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "#eff6ff",
                            color: "#1e40af",
                          },
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#374151",
                          fontWeight: "500",
                        }),
                        input: (base) => ({
                          ...base,
                          color: "#374151",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#9ca3af",
                        }),
                      }}
                      className="group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                        isLoading
                          ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-70"
                          : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Adding Product...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <PlusIcon className="w-5 h-5" />
                          <span>Add Product</span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Success Message */}
                  {successMessage && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                      <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-300">
                          Success!
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {successMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                      <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                        <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium text-red-800 dark:text-red-300">
                          Error
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {errorMessage}
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="mt-6 bg-white/10 dark:bg-gray-900 rounded-xl p-6 border border-gray-200/20 dark:border-gray-800/70">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <CubeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Product Management Tips
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>
                      • Choose the most appropriate category for better
                      organization
                    </li>
                    <li>
                      • Use descriptive product names for easy identification
                    </li>
                    <li>
                      • Products will be automatically tracked in your inventory
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductAddition;
