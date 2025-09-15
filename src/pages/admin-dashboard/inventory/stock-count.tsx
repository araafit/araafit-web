import { useProductMetrics } from "../../../hooks/admin-inventory.hooks";
import { calculateStockDistribution } from "../../../utils/admin-inventory-utils";
import Spinner from "../../../shared-components/spinner";

export default function StockBar() {
  const { data: metrics, isLoading, error } = useProductMetrics();

  if (isLoading) {
    return (
      <section className="flex items-center justify-center h-16">
        <Spinner size="sm" speed="fast" />
      </section>
    );
  }

  if (error || !metrics) {
    return (
      <section className="flex items-center justify-center h-16">
        <span className="text-red-500 text-sm">Failed to load stock data</span>
      </section>
    );
  }

  const stockData = calculateStockDistribution(metrics);
  const total = stockData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section>
      {/* Top Progress Bar */}
      <div className="flex gap-2 w-[360px]">
        {stockData.map((item, index) => {
          const percentage = (item.value / total) * 100;
          return (
            <div
              key={index}
              className="h-2 rounded-full"
              style={{
                width: `${percentage}%`,
                backgroundColor: item.color,
              }}
            />
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex gap-6 items-center text-sm mt-3">
        {stockData.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="h-4 w-1 rounded-full inline-flex mr-2"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[#676767] font-inter font-light mr-1">
              {item.label}:
            </span>
            <span className="text-[#1C1C1C] font-inter">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
