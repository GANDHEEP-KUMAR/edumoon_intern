import React from 'react';

const CustomPieChart = ({ title, data, dataKey, nameKey }) => (
  <div className="card mb-4">
    <div className="card-header">{title}</div>
    <div className="card-body">
      <div style={{ width: '100%', height: 300 }}>
        {/* Chart will be rendered here */}
      </div>
    </div>
  </div>
);

export default CustomPieChart;
