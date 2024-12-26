import { LikeOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, List, Space } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./ListJob.module.css";

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const App = ({ handleSearchJob, isSearch, jobs, setJobs, messageApi,
  page, setPage, pageSize, setPageSize, totalItems, setTotalItems }) => {
  const nav = useNavigate();

  const candidate = useSelector(state => state.memberReducer);

  const getJobsSuggestion = async (page = 1, pageSize = 3) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/job/suggestion?page=${page}&size=${pageSize}`,
        { withCredentials: true }
      );
      const data = await res.data;
      // console.log(data);
      setJobs(data.jobs);
      setTotalItems(data.info.total);
      setPage(data.info.page);
      setPageSize(data.info.size);
    } catch (err) {
      console.error(err);
      messageApi.error("Có lối xảy ra: " + err.toString());
    }
  }

  // console.log(messageApi, jobs);

  useEffect(() => {
    getJobsSuggestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        current: page, // Trang hiện tại
        pageSize: pageSize, // Kích thước trang
        total: totalItems, // Tổng số mục
        onChange: async (page, pageSize) => {
          if (isSearch)
            await handleSearchJob(page, pageSize);
          else
            await getJobsSuggestion(page, pageSize);
        },
      }}
      dataSource={jobs}

      renderItem={(item) => {
        const company = item.company;
        return (
          <List.Item
            key={item.title}
            actions={[
              <IconText
                style={{ cursor: "pointer" }}
                icon={StarOutlined}
                text="156"
                key="list-vertical-star-o"
              />,
              <IconText
                icon={LikeOutlined}
                text="156"
                key="list-vertical-like-o"
              />,
            ]}
            extra={
              <img
                width={240}
                height={150}
                style={{ marginLeft: "500px", position: "absolute" }}
                alt="logo"
                src={company.logo || "/company.png"}
              />
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar src="https://www.w3schools.com/howto/img_avatar.png" />
              }
              title={
                <span className={styles.title_job}
                  onClick={() => {
                    // window.open(`/candidate/view-detail-job/${item._id}`, "_blank");
                    nav(candidate.role ? `/candidate/view-detail-job/${item._id}` : `/view-detail-job/${item._id}`);
                  }}
                >{item.title}</span>
              }
              company={company.introduction}
            />
            {item.content}
            <p>Lương: {item.salary} </p>
            <p>Địa chỉ: {company.address}</p>
            Công ty: {company.name}
          </List.Item>
        );
      }}

    />
  );
};

export default App;
