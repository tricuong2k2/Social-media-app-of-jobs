import { Col, ConfigProvider, DatePicker, Form, Input, Modal, Row, Select } from "antd";

import { PiBuildingApartmentBold } from "react-icons/pi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { TbBuildingCommunity } from "react-icons/tb";

import moment from "moment";
import axios from "axios";

import Address from "../../Address/Address";

import { useEffect, useState } from "react";
import { adminTableThemes } from "../../../helper";

import styles from "./ModalPostJob.module.css";

const primaryColor = "#00b14f";

function ModalPostJob({ apiUpdate, data, setModalData, handleModalPostJob = () => { }, categories, messageApi }) {
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [form] = Form.useForm();

  const handleUpdate = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        values.categories = values.categories.map(cate => cate.value || cate);
        values.locations = [{
          detail: values.detail,
          ward: values.ward,
          district: values.district,
          province: values.province,
        }]
        await axios.post(apiUpdate, values, {
          withCredentials: true,
        })
          .then(res => {
            const info = res.data.info;
            handleModalPostJob(info);
            messageApi.success("Cập nhật thành công!");
          })
          .catch(err => {
            console.error(err);
            messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
          })
          .finally(() => {
            setLoading(false);
            setModalData(null);
          })
      })
      .catch(error => {
        console.error('Validate Failed:', error);
        messageApi.error(`Có lỗi xảy ra: ${error.message}`);
      });
  }

  const handleCancelForm = () => {
    setModalData(null);
    form.resetFields();
  }

  useEffect(() => {
    axios.get("https://vapi.vnappmob.com/api/province/")
      .then(res => {
        const cities = res.data.results.map((city, index) => ({
          id: index,
          key: city.province_id,
          label: city.province_name,
          value: city.province_name,
        }));

        setCities(cities);
      })
  }, []);

  const handleSelectCitites = (_, option) => {
    setDistricts([]);
    setWards([]);
    axios.get(`https://vapi.vnappmob.com/api/province/district/${option.key}`)
      .then(res => {
        const districts = res.data.results.map((district, index) => ({
          id: index,
          key: district.district_id,
          label: district.district_name,
          value: district.district_name,
        }))

        setDistricts(districts);
      })
      .catch(err => console.error(err))
  }

  const handleSelectDistricts = (_, option) => {
    setWards([]);
    axios.get(`https://vapi.vnappmob.com/api/province/ward/${option.key}`)
      .then(res => {
        const wards = res.data.results.map((ward, index) => ({
          id: index,
          key: ward.ward_id,
          label: ward.ward_name,
          value: ward.ward_name,
        }))

        setWards(wards);
      })
  }

  // console.log(categories);
  return (
    <ConfigProvider
      theme={{
        components: {
          ...adminTableThemes.components,
          DatePicker: {
            activeBorderColor: primaryColor,
            hoverBorderColor: "#04df67",
          }
        }
      }}
    >
      <Modal
        title={<h3 className={styles.heading}>{data.title ? "Chỉnh sửa công việc" : "Đăng tuyển công việc mới"}</h3>}
        maskClosable={false}
        open={data !== null}
        cancelText="Hủy"
        okText={data.title ? "Cập nhật" : "Thêm mới"}
        onCancel={handleCancelForm}
        onOk={handleUpdate}
        confirmLoading={loading}
        width={"100%"}
      >
        <Form
          layout="vertical"
          form={form}
        >
          <Row gutter={[32, 12]}>
            <Col span={16}>
              <Form.Item
                label={<span className={styles.lbForm}>Tiêu đề công việc</span>}
                name="title"
                initialValue={data?.title}
                rules={[{ required: true, message: "Tiêu đề công việc không được bỏ trống" }]}
              >
                <Input type="text" placeholder="Tiêu đề công việc" />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item
                label={<span className={styles.lbForm}>Hạn ứng tuyển</span>}
                name="deadlineForSubmission"
                initialValue={data?.deadlineForSubmission ? moment(data?.deadlineForSubmission) : null}
                rules={[{ required: true, message: "Hạn ứng tuyển không được bỏ trống" }]}
              >
                <DatePicker format={{ format: 'DD-MM-YYYY' }} placeholder="Hạn ứng tuyển" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label={<span className={styles.lbForm}>Cấp bậc</span>}
                name="level"
                initialValue={data?.level}
                rules={[{ required: true, message: "Cấp bậc cần tuyển không được bỏ trống" }]}
              >
                <Select placeholder="Cấp bậc cần tuyển"
                  options={[
                    { value: "Thực tập sinh", label: "Thực tập sinh" },
                    { value: "Nhân viên", label: "Nhân viên" },
                    { value: "Trưởng nhóm", label: "Trưởng nhóm" },
                    { value: "Trưởng / Phó phòng", label: "Trưởng / Phó phòng" },
                    { value: "Quản lí / Giám sát", label: "Quản lí / Giám sát" },
                    { value: "Trưởng chi nhánh", label: "Trưởng chi nhánh" },
                    { value: "Phó giám đốc", label: "Phó giám đốc" },
                    { value: "Giám đốc", label: "Giám đốc" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label={<span className={styles.lbForm}>Kinh nghiệm</span>}
                name="experience"
                initialValue={data?.experience}
                rules={[{ required: true, message: "Kinh nghiệm cần tuyển không được trống" }]}
              >
                <Select placeholder="Kinh nghiệm cần tuyển"
                  options={[
                    { value: "Chưa có kinh nghiệm", label: "Chưa có kinh nghiệm" },
                    { value: "Dưới 1 năm", label: "Dưới 1 năm" },
                    { value: "1 năm", label: "1 năm" },
                    { value: "2 năm", label: "2 năm" },
                    { value: "3 năm", label: "3 năm" },
                    { value: "4 năm", label: "4 năm" },
                    { value: "5 năm", label: "5 năm" },
                    { value: "Trên 5 năm", label: "Trên 5 năm" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label={<span className={styles.lbForm}>Số lượng tuyển</span>}
                name="quantity"
                initialValue={data?.quantity}
                rules={[{
                  required: true,
                  message: "Số lượng tuyển không được trống"
                }, {
                  validator: (_, value) => {
                    const num = Number(value);
                    if ((num || num === 0) && (num <= 0 ||  !Number.isInteger(num)))
                      return Promise.reject("Số lượng cần tuyển không hợp lệ");
                    else
                      return Promise.resolve();
                  }
                }]}
              >
                <Input type="number" placeholder="Số lượng cần tuyển" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label={<span className={styles.lbForm}>Hình thức làm việc</span>}
                name="formOfWork"
                initialValue={data?.formOfWork}
                rules={[{ required: true, message: "Hình thức làm việc không được trống" }]}
              >
                <Select placeholder="Hình thức làm việc"
                  options={[
                    { value: "Toàn thời gian", label: "Toàn thời gian" },
                    { value: "Bán thời gian", label: "Bán thời gian" },
                    { value: "Thực tập", label: "Thực tập" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label={<span className={styles.lbForm}>Giới tính</span>}
                name="gender"
                initialValue={data?.gender}
                rules={[{ required: true, message: "Giới tính không được trống" }]}
              >
                <Select placeholder="Giới tính"
                  options={[
                    { value: "male", label: "Nam" },
                    { value: "female", label: "Nữ" },
                    { value: "all", label: "Không yêu cầu" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label={<span className={styles.lbForm}>Mức lương</span>}
                name="salary"
                initialValue={data?.salary}
                rules={[{ required: true, message: "Mức lương không được để trống" }]}
              >
                <Input placeholder="Mức lương" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                label={<span className={styles.lbForm}>Ngành nghề</span>}
                name="categories"
                initialValue={(data?.categories || []).map(cate => ({
                  value: cate._id,
                  label: cate.category
                }))}
                rules={[{ required: true, message: "Ngành nghề không được để trống" }]}
              >
                <Select 
                  mode="multiple"
                  allowClear
                  placeholder="Ngành nghề liên quan"
                  optionFilterProp="label"
                  options={categories.map(cate => ({
                    value: cate._id,
                    label: cate.category
                  }))}
                  onChange={(value) => form.setFieldValue("categories", value)}
                  maxTagCount="responsive"
                />
              </Form.Item>
            </Col>
            <Col span={8}></Col>
            <Col span={5}>
              <Address
                label="Tỉnh/thành phố"
                initialValue={data?.locations && data?.locations.length > 0 ? data.locations[0]?.province : "Không xác định"}
                type="province" suffixIcon={<PiBuildingApartmentBold />}
                options={cities}
                required={false}
                placeholder="Chọn tỉnh/thành phố"
                onSelect={handleSelectCitites}
              />
            </Col>
            <Col span={5}>
              <Address
                label="Quận/huyện"
                initialValue={data?.locations && data?.locations.length > 0 ? data.locations[0]?.district : "Không xác định"}
                type="district"
                options={districts} suffixIcon={<HiBuildingOffice2 />}
                required={false}
                placeholder="Chọn quận/huyện"
                onSelect={handleSelectDistricts}
              />
            </Col>
            <Col span={4}>
              <Address
                label="Xã/phường"
                initialValue={data?.locations && data?.locations.length > 0 ? data.locations[0]?.ward : "Không xác định"}
                type="ward"
                options={wards} suffixIcon={<TbBuildingCommunity />}
                required={false}
                placeholder="Chọn xã/phường"
              />
            </Col>
            <Col span={10}>
              <Form.Item
                label={<span className={styles.lbForm}>Địa chỉ chi tiết</span>}
                name="detail"
                initialValue={data?.locations && data?.locations.length > 0 ? data.locations[0]?.detail : "Không xác định"}
              >
                <Input placeholder="Địa chỉ chi tiết" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={<span className={styles.lbForm}>Mô tả công việc</span>}
                name="description"
                initialValue={data?.description}
              >
                <Input.TextArea placeholder="Mô tả công việc" autoSize />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={<span className={styles.lbForm}>Yêu cầu ứng viên</span>}
                name="candidateRequirements"
                initialValue={data?.candidateRequirements}
              >
                <Input.TextArea placeholder="Yêu cầu ứng viên" autoSize />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={<span className={styles.lbForm}>Quyền lợi</span>}
                name="rights"
                initialValue={data?.rights}
              >
                <Input.TextArea placeholder="Quyền lợi ứng viên" autoSize />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}

export default ModalPostJob;