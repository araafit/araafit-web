export default function StockBar() {
  const stockData = [
    { color: "#00BA00", label: "In Stock", value: 600 },
    { color: "#F3BF02", label: "In Stock", value: 100 },
    { color: "#FF0005", label: "In Stock", value: 50 },
  ];

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
