import { Button, Form, Input, message, Select } from "antd";

import ListJob from "../../ListJob/ListJob";

import styles from "./SearchJob.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
function SearchJob() {
  const [localtion, setLocaltion] = useState("Tất cả địa điểm");
  const [category, setCategory] = useState("Tất cả ngành nghề");

  const [messageApi, contextHolder] = message.useMessage();

  const [localtions, setLocaltions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);

  const [form] = Form.useForm();

  const handleChangeLocation = (value) => {
    setLocaltion(value);
  };

  const handleChangeCategory = (value) => {
    setCategory(value);
  };

  const handleSearchJob = async (page = 1, pageSize = 3) => {
    form
      .validateFields()
      .then(async (values) => {
        const payload = {};
        payload.q = values.q || "";
        payload.location = values.location === "Tất cả địa điểm" ? "" : (values.location || "");
        payload.category = values.category === "Tất cả ngành nghề" ? "" : (values.category || "");
        // console.log(payload);
        await axios.get(`http://localhost:8000/api/job/search?q=${payload.q}&location=${payload.location}&category=${payload.category}&page=${page}&size=${pageSize}`)
          .then(res => {
            setJobs(res.data.jobs);
            setTotalItems(res.data.info.total);
            setPage(res.data.info.page);
            setPageSize(res.data.info.size);
            setIsSearch(true);
          })
          .catch(err => {
            console.log(err);
            messageApi.error("Có lối xảy ra: " + err?.response?.data?.message);
          })
          .finally(() => {
            window.scrollTo({
              top: 284,
              behavior: 'smooth'
            })
          })
      })
  }

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/api/job-category/all"),
      axios.get("https://vapi.vnappmob.com/api/province/"),
    ]).then(([resJobCates, resCities]) => {
      resCities.data.results.push({
        province_name: "Tất cả địa điểm",
      })

      setLocaltions(resCities.data.results.map(city => ({
        label: city.province_name,
        value: city.province_name,
      })));

      resJobCates.data.categories.push({
        _id: 0,
        category: "Tất cả ngành nghề",
      })

      setCategories(resJobCates.data.categories.map(category => ({
        label: category.category,
        value: category._id
      })));
    })
  }, [])

  return (
    <div className={styles.pages_job_search}>
      {contextHolder}
      <div className={styles.section_header}>
        <div className={styles.content}>
          <h1>Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc</h1>
          <p>
            Tiếp cận <span className={styles.highlight}>40,000+</span> tin tuyển
            dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại
            Việt Nam
          </p>

          <Form
            form={form}
          >
            <div className={styles.search_cv}>
              <div className={styles.search_job} style={{ width: "350px" }}>
                <Form.Item
                  name="q"
                  style={{
                    margin: 0,
                  }}
                >
                  <Input
                    placeholder="Vị trí tuyển dụng"
                    className={styles.search_job_input}
                  />
                </Form.Item>
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
                <Form.Item
                  name="location"
                  initialValue={localtion}
                >
                  <Select
                    onChange={handleChangeLocation}
                    className={styles.search_location}
                    style={{ width: "200px" }}
                  >
                    {localtions.map((role) => (
                      <Select.Option key={role.value} value={role.value}>
                        {role.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
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
                <Form.Item
                  name="category"
                  initialValue={category}
                >
                  <Select
                    onChange={handleChangeCategory}
                    className={styles.search_location}
                    style={{ width: "200px" }}
                  >
                    {categories.map((role) => (
                      <Select.Option key={role.value} value={role.value}>
                        {role.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className={styles.search_sub}>
                <Button
                  style={{
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                  className={styles.btn_search_sub}
                  onClick={() => handleSearchJob()}
                >
                  <span className="icon_search material-symbols-outlined">
                    search
                  </span>
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </Form>
          <div
            style={{
              marginTop: "30px",
            }}
            className={styles.img_job_search}
          >
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
        </div>
        <div
          className={styles.list_job_content}
          style={{
            paddingBottom: "30px",
          }}
        >
          <ListJob
            jobs={jobs} setJobs={setJobs}
            page={page} setPage={setPage}
            pageSize={pageSize} setPageSize={setPageSize}
            totalItems={totalItems} setTotalItems={setTotalItems}
            messageApi={messageApi}
            handleSearchJob={handleSearchJob}
            isSearch={isSearch} />
        </div>
      </div>
    </div>
  );
}

export default SearchJob;