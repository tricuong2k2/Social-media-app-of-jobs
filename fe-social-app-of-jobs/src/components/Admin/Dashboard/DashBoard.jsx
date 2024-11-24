import { Col, message, Row, Tabs } from "antd";
import { FaUserTie } from "react-icons/fa";
import { FaCheckToSlot } from "react-icons/fa6";
import { RiUserSearchFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import {
  ArcElement, CategoryScale, Chart, Legend,
  LinearScale, LineController, LineElement, PieController, PointElement, Title, Tooltip
} from "chart.js";

import axios from "axios";

import PieChart from "../PieChart/PieChart";
import StatisticCard from "../StatisticCard/StatisticCard";
import styles from "./DashBoard.module.css";
import LineChart from "../LineChart/LineChart";
import { useNavigate, useOutletContext } from "react-router-dom";

Chart.register(ArcElement, PieController);
Chart.register(CategoryScale, LinearScale, PointElement, LineController, LineElement);
Chart.register(Legend, Title, Tooltip);

function Dashboard() {
  const { data, getOverviewInfo } = useOutletContext();
  const nav = useNavigate();

  const [datas, setDatas] = useState([]);

  const [labels, setLabels] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/api/admin/statistic/candidate", {
        withCredentials: true,
      }),
      axios.get("http://localhost:8000/api/admin/statistic/employer", {
        withCredentials: true,
      }),
      axios.get("http://localhost:8000/api/admin/statistic/jobs", {
        withCredentials: true,
      }),
      getOverviewInfo(),
    ])
      .then(([candidates, employers, jobs]) => {
        // console.log(candidates, employers);
        setDatas([{
          label: "Số lượng ứng viên",
          data: candidates.data.statistic
        }, {
          label: "Số lượng nhà tuyển dụng",
          data: employers.data.statistic
        }, {
          label: "Số lượng nhà công việc",
          data: jobs.data.statistic
        },]);

        setLabels(candidates.data.labels);
      })
      .catch(err => {
        console.error(err);

        const code = err?.response?.status;
        if (code === 401 || code === 403)
          nav("/login");
        else
          messageApi.error(err.response.data.toString());
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.adminDashboard}>
      {contextHolder}
      <Row>
        <Col span={12}>
          <Row justify="start" align="middle" gutter={[24, 24]}>
            <Col>
              <StatisticCard
                title="Ứng viên mới"
                icon={<FaUserTie />}
                amount={data.candidates.currAmount}
                percent={
                  data.candidates.lastAmount === data.candidates.currAmount ? 0
                    : data.candidates.lastAmount !== 0
                      ? (data.candidates.currAmount !== 0
                        ? (100 * (data.candidates.currAmount - data.candidates.lastAmount) / data.candidates.lastAmount).toFixed(2) : 0) : 100
                }
                state={data.candidates.currAmount >= data.candidates.lastAmount ? "up" : "down"}
              />
            </Col>

            <Col>
              <StatisticCard
                title="Nhà tuyển dụng mới"
                icon={<RiUserSearchFill />}
                amount={data.employers.currAmount}
                percent={
                  data.employers.lastAmount === data.employers.currAmount ? 0
                    : data.employers.lastAmount !== 0
                      ? (data.employers.currAmount !== 0
                        ? (100 * (data.employers.currAmount - data.employers.lastAmount) / data.employers.lastAmount).toFixed(2) : 0) : 100
                }
                state={data.employers.currAmount >= data.employers.lastAmount ? "up" : "down"}
                role="employer"
              />
            </Col>

            <Col>
              <StatisticCard
                title="Công việc được đăng"
                icon={<FaCheckToSlot />}
                amount={data.jobs.currAmount}
                percent={
                  data.jobs.lastAmount === data.jobs.currAmount ? 0
                    : data.jobs.lastAmount !== 0
                      ? (data.jobs.currAmount !== 0
                        ? (100 * (data.jobs.currAmount - data.jobs.lastAmount) / data.jobs.lastAmount).toFixed(2) : 0) : 100
                }
                state={data.jobs.currAmount >= data.jobs.lastAmount ? "up" : "down"}
                role="postedJob"
              />
            </Col>
          </Row>
        </Col>

        <Col span={12}>
          <PieChart chartData={{
            labels: ["Ứng viên", "Nhà tuyển dụng", "Công việc"],
            datasets: [{
              label: "Số lượng",
              data: [data.candidates.currAmount, data.employers.currAmount, data.jobs.currAmount],
              backgroundColor: ["#00b14f", "#ff9800", "#20bbc9"],
            }]
          }} />
        </Col>
      </Row>

      <div className={styles.lineChartStatistic}>
        <h3 className={styles.heading}>Thống kê theo tháng</h3>
        <Tabs
          defaultActiveKey="1"
          items={[{ icon: FaUserTie, role: "Ứng viên", data: datas[0], color: "#01be56" },
          { icon: RiUserSearchFill, role: "Nhà tuyển dụng", data: datas[1], color: "#ff9800" },
          { icon: FaCheckToSlot, role: "Công việc được đăng", data: datas[2], color: "#20bbc9" }].map((info, index) => {
            const Icon = info.icon;
            // const labels = ["January", "February", "March", "April", "May", "June",
            //   "July", "August", "September", "October", "November", "December"];
            return {
              key: index + 1,
              label: info.role,
              children: <LineChart
                title={`Thống kê ${info.role.toLowerCase()} mới theo tháng`}
                chartData={{
                  labels, datasets: [{
                    ...info.data,
                    borderColor: info.color
                  }]
                }}
              />,
              icon: <Icon />
            };
          })}
        />
      </div>
    </div>
  );
}

export default Dashboard;