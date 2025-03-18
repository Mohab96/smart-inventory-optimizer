import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";

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
    console.log("Data: ",formData);
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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 mb-1"
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
              setFormData({ ...formData, categoryId: selectedOption?.value })
            }
            value={
              (categories.find((cat) => cat.id === formData.categoryId) || null)
                ?.label
            }
            placeholder={"Select a category"}
            isSearchable
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Adding Product..." : "Add Product"}
        </button>

        {successMessage && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
            <XCircleIcon className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewProductAddition;
