import { Line } from "react-chartjs-2";

import styles from "./LineChart.module.css";

function LineChart({ title="Không xác định", chartData }) {
  
  return (
    <div className={styles.lineChart}>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: title
            },
            legend: {
              display: "top"
            },
          }
        }}
      />
    </div>
  );
}

export default LineChart;