import { useEffect, useState } from "react"; 
import Header from "../../components/common/Header"; 
import Sidebar from "../../components/common/Sidebar"; 
import { useDispatch, useSelector } from "react-redux"; 
import { 
  fetchCategoriesSalesTrends, 
  fetchProductsSalesTrends, 
  fetchCategoriesRevenuesTrends,
  fetchProductsRevenuesTrends
} from "../../store/features/trendSlices/trendSlice"; 
import GenericLineChart from "../../components/charts/GenericLineChart"; 

const TrendVisualizer = () => { 
  const dispatch = useDispatch(); 
  const [selectedYear, setSelectedYear] = useState(2015); 

  const { loading, data, error } = useSelector((state) => state.trend); 

  useEffect(() => { 
    // Fetch data for all trends at once
    dispatch(fetchCategoriesSalesTrends(selectedYear));
    dispatch(fetchProductsSalesTrends(selectedYear));
    dispatch(fetchCategoriesRevenuesTrends(selectedYear));
    dispatch(fetchProductsRevenuesTrends(selectedYear));
  }, [dispatch, selectedYear]); 

  // Log the data to see if it is being fetched correctly
  useEffect(() => {
    console.log("Fetched Data:", data); // Log data after it is updated
  }, [data]);

  // Convert trend data into format compatible with chart
  const trendData = Object.entries(data.vehicle || {}).map( 
    ([month, value]) => ({ 
      month: month.charAt(0).toUpperCase() + month.slice(1), 
      value, 
    }) 
  ); 

  const years = Array.from( 
    { length: new Date().getFullYear() - 2013 + 1 }, 
    (_, i) => 2013 + i 
  ).reverse(); 

  return ( 
    <div className="h-screen flex flex-col"> 
      <Header /> 
      <div className="flex flex-1 overflow-hidden"> 
        <Sidebar /> 
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-900 text-white"> 
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Categories Sales Trend */}
            <GenericLineChart 
              title="Categories Sales Trend" 
              data={trendData} 
              dataKey="value" 
              loading={loading} 
              error={error} 
              selectedYear={selectedYear} 
              onYearChange={setSelectedYear} 
              link="/categories-sales-report" 
              linkText="View Categories Sales Report" 
            />
            {/* Products Sales Trend */}
            <GenericLineChart 
              title="Products Sales Trend" 
              data={trendData} 
              dataKey="value" 
              loading={loading} 
              error={error} 
              selectedYear={selectedYear} 
              onYearChange={setSelectedYear} 
              link="/products-sales-report" 
              linkText="View Products Sales Report" 
            />
            {/* Categories Revenues Trend */}
            <GenericLineChart 
              title="Categories Revenues Trend" 
              data={trendData} 
              dataKey="value" 
              loading={loading} 
              error={error} 
              selectedYear={selectedYear} 
              onYearChange={setSelectedYear} 
              link="/categories-revenues-report" 
              linkText="View Categories Revenues Report" 
            />
            {/* Products Revenues Trend */}
            <GenericLineChart 
              title="Products Revenues Trend" 
              data={trendData} 
              dataKey="value" 
              loading={loading} 
              error={error} 
              selectedYear={selectedYear} 
              onYearChange={setSelectedYear} 
              link="/products-revenues-report" 
              linkText="View Products Revenues Report" 
            />
          </div>
        </div> 
      </div> 
    </div> 
  ); 
}; 

export default TrendVisualizer; 
