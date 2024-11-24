import { Pie } from "react-chartjs-2";

import styles from "./PieChart.module.css";

function PieChart({ chartData={} }) {
  
  return (
    <div className={styles.pieChart}>
      <Pie 
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Tương quan giữa ứng viên, nhà tuyển dụng và công việc",
            },
            legend: {
              position: "bottom",
            },
            tooltip: {
              enabled: true,
            }
          }
        }}
      />
    </div>
  )
}

export default PieChart;