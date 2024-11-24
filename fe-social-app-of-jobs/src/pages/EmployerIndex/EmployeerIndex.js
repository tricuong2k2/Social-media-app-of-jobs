import React from "react";
import Header from "../../components/Header/Header";
import styles from "./EmployeerIndex.module.css";
import { Input, Form, Select, Button, ConfigProvider } from "antd";
import ListJob from "../../components/ListJob/ListJob";
import Footer from "../../components/FooterMain/Footer";
import { useState } from "react";

function EmployeerIndex(changeRole) {
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedRoleJob, setSelectedRoleJob] = useState("all");
  const [searchValue, setSearchValue] = useState({
    jobName: "",
    location: "all",
    category: "all",
  });

  const roles = [
    { label: "Tất cả tỉnh/thành phố", value: "all" },
    { label: "Hà Nội", value: "hanoi" },
    { label: "Đà Nẵng ", value: "danang" },
    { label: "Hồ Chí Minh", value: "HCM" },
    { label: "Cần Thơ", value: "cantho" },
    { label: "Đồng Nai", value: "dongnai" },
    { label: "Bình Dương", value: "binhduong" },
    { label: "Bắc Ninh", value: "bacninh" },
    { label: "Hải Phòng", value: "haiphong" },
    { label: "Quảng Ninh", value: "quangninh" },
    { label: "Khác", value: "other" },
  ];
  const rolesJob = [
    { label: "Tất cả ngành nghề", value: "all" },
    { label: "IT-Phần mềm", value: "it" },
    { label: "Kế toán", value: "accountant" },
    { label: "Bán hàng", value: "sales" },
    { label: "Marketing", value: "marketing" },
    { label: "Nhân sự", value: "hr" },
    { label: "Hành chính", value: "admin" },
    { label: "Xây dựng", value: "construction" },
    { label: "Khác", value: "other" },
  ];

  const handleChange = (value) => {
    setSearchValue({ ...searchValue, location: value });
  };
  const handleChangeJob = (value) => {
    setSearchValue({ ...searchValue, category: value });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultHoverBg: "blue",
          },
          Select: {
            defaultActiveBg: "blue",
          },
        },
      }}
    >
      <div>
        <Header />
        <div className={styles.pages_job_search}>
          <div className={styles.section_header}>
            <div className={styles.content}>
              <h1>Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc</h1>
              <p>
                Tiếp cận <span class={styles.highlight}>40,000+</span> tin tuyển
                dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại
                Việt Nam
              </p>

              <div className={styles.search_cv}>
                <div className={styles.search_job} style={{ width: "350px" }}>
                  <Input
                    placeholder="Vị trí tuyển dụng"
                    className={styles.search_job_input}
                    value={searchValue.jobName}
                    onChange={(e) =>
                      setSearchValue({
                        ...searchValue,
                        jobName: e.target.value,
                      })
                    }
                  ></Input>
                </div>
                <div
                  className={styles.search_job}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingTop: "25px",
                    paddingLeft: "15px",
                  }}
                >
                  <Select
                    defaultValue="all"
                    value={searchValue.location}
                    onChange={handleChange}
                    className={styles.search_location}
                    style={{ width: "200px" }}
                  >
                    {roles.map((role) => (
                      <Select.Option key={role.value} value={role.value}>
                        {role.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div
                  className={styles.search_job}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingTop: "25px",
                    paddingLeft: "15px",
                  }}
                >
                  <Select
                    defaultValue="all"
                    value={searchValue.category}
                    onChange={handleChangeJob}
                    className={styles.search_location}
                    style={{ width: "200px" }}
                  >
                    {rolesJob.map((role) => (
                      <Select.Option key={role.value} value={role.value}>
                        {role.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className={styles.search_sub}>
                  <Button
                    style={{
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    className={styles.btn_search_sub}
                    onClick={() => console.log(123)}
                  >
                    <span class="icon_search material-symbols-outlined">
                      search
                    </span>
                    Tìm kiếm
                  </Button>
                </div>
              </div>
              <div
                style={{
                  marginTop: "30px",
                }}
                className={styles.img_job_search}
              >
                <img
                  src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Tek-Expert-bannerT1.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className={styles.list_job}>
            <div className={styles.title_list_job}>
              <h2>Việc làm tốt nhất</h2>
            </div>
            <div
              className={styles.title_list_job}
              style={{
                paddingBottom: "30px",
              }}
            >
              <Select
                showSearch
                placeholder="Select a person"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { value: "1", label: "Địa điểm" },
                  { value: "2", label: "Mức Lương" },
                  { value: "3", label: "Kinh nghiệm " },
                  { value: "4", label: "Ngành nghề" },
                ]}
              />
            </div>
            <div
              className={styles.list_job_content}
              style={{
                paddingBottom: "30px",
              }}
            >
              <ListJob searchValue={searchValue} />
            </div>
          </div>
          <div
            className={styles.footer_main}
            style={{
              width: "1150px",
              height: "330px",
              margin: "0 auto",
            }}
          >
            <Footer />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default EmployeerIndex;
