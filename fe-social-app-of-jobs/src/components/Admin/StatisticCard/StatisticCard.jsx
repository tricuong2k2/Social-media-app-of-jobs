import { Col, Row } from "antd";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import CountUp from "react-countup";

import clsx from "clsx";

import styles from "./StatisticCard.module.css";
import { FaRegQuestionCircle } from "react-icons/fa";

function StatisticCard({ title="Không xác định", role="candidate", icon=<FaRegQuestionCircle />, state="up", percent=0, amount=0 }) {

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Row justify="space-between" align="top" gutter={[18, 0]}>
          <Col><h4 className={styles.title}>{ title }</h4></Col>
          <Col><span className={clsx([styles.icon, styles[role]])}>{ icon }</span></Col>
        </Row>
      </div>

      <div className={styles.content}>
        <div className={styles.amount}>
          <CountUp 
            start={0}
            end={amount}
            duration={2}
          />
        </div>
        <div className={clsx([styles.growth, state === "up" ? styles.growthUp : styles.growthDown])}>
          <div className={styles.growthWrapper}>
            <span className={styles.icon}>{ state === "up" ? <FaArrowTrendUp /> : <FaArrowTrendDown /> }</span>
            <span className={styles.percent}>
              <CountUp 
                start={0}
                end={percent}
                duration={2}
                decimals={2}
                suffix="%"
              />
            </span>
          </div>
          <span className={styles.compare}>So với tháng trước</span>
        </div>
      </div>
    </div>
  );
}

export default StatisticCard;