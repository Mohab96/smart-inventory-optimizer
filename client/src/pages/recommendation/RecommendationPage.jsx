import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../../store/features/recommendationSices/recommendationsSlice";

const RecommendationPage = () => {
  const dispatch = useDispatch();
  const { loading, data = {}, error } = useSelector((state) => state.recommendation);

  const numberOfProducts = 2;
  const daysOfForecasting = 5;

  useEffect(() => {
    dispatch(fetchRecommendations({ numberOfProducts, daysOfForecasting }));
  }, [dispatch, numberOfProducts, daysOfForecasting]);

  const recommendations = data.data || [];

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-700 text-white">
          {loading && <p>Loading recommendations...</p>}
          {error && <p className="text-red-400">Error: {error}</p>}
          {!loading && !error && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
              <ul className="space-y-2">
                {recommendations.map((item, index) => (
                  <li key={index} className="bg-gray-600 p-3 rounded-lg shadow">
                    {JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;