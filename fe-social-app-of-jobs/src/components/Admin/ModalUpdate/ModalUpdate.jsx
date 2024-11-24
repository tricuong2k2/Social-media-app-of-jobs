import { Col, ConfigProvider, DatePicker, Form, Input, message, Modal, Radio, Row } from "antd";

import moment from "moment";
import axios from "axios";

import { BsFillTelephoneFill, BsFiletypeDocx, BsFiletypeDoc } from "react-icons/bs";
import { TfiEmail } from "react-icons/tfi";
import { FaBirthdayCake } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { PiBuildingApartmentBold } from "react-icons/pi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { TbBuildingCommunity } from "react-icons/tb";
import { FaFilePdf } from "react-icons/fa6";


import Avatar from "../../Avatar/Avatar";
import styles from "./ModalUpdate.module.css";
import Address from "../../Address/Address";
import { useEffect, useState } from "react";
import { adminTableThemes } from "../../../helper";
import { useNavigate } from "react-router-dom";

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

const primaryColor = "#00b14f";

function ModalUpdate({ children=null, apiUpdate, data, setModalData, handleUpdateMember=()=>{} }) {
  const nav = useNavigate();

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const handleUpdate = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        values.address = `${values.detail || "Không xác định"}, ${values.ward}, ${values.district}, ${values.province}`;
        await axios.post(apiUpdate, values, {
          withCredentials: true,
        })
          .then(res => {
            const info = res.data.info;
            handleUpdateMember({
              uid: info._id,
              ...info.member,
              education: info.education,
              status: info.member?.verifiedAt ? true : false,
            });
            messageApi.success("Cập nhật thành công!");
          })
          .catch(err => {
            console.error(err);
            const code = err.response.status;
            if (code === 401 || code === 403)
              nav("/login");
            else
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
  // console.log(data);
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
      { contextHolder }
      <Modal
        title={<div className={styles.avatarWrapper}>
          <Avatar user={data} API={{
              upload: `http://localhost:8000/api/admin/member/avatar/${data._id}`,
              delete: `http://localhost:8000/api/admin/member/avatar/${data._id}`,
            }} 
            handleUpdateMember={handleUpdateMember}
          />
          <div className={styles.info}>
            <p className={styles.address}><IoLocationSharp /><span>{data?.address || "Không xác định"}</span></p>
            <Row justify="center" align="middle" gutter={[24, 0]}>
              <Col>
                <p className={styles.tel}><BsFillTelephoneFill /><span>{data?.tel || "Không xác định"}</span></p>
              </Col>
              <Col>
                <p className={styles.email}><TfiEmail /><span>{data?.email || "Không xác định"}</span></p>
              </Col>
              <Col>
                <p className={styles.dob}><FaBirthdayCake /><span>{data?.dob
                  ? formatDate(data?.dob)
                  : "Không xác định"}</span></p>
              </Col>
            </Row>
          </div>
        </div>}
        // centered
        maskClosable={false}
        open={data !== null}
        cancelText="Hủy"
        okText="Cập nhật"
        onCancel={handleCancelForm}
        onOk={handleUpdate}
        confirmLoading={loading}
      // footer={null}
      >
        <Form
          layout="vertical"
          form={form}
        >
          <Row gutter={[16, 0]}>
            <Col span={14}>
              <Form.Item
                label={<span className={styles.lbUpdateFrm}>Họ tên</span>}
                name="fullName"
                rules={[{
                  required: true,
                  message: 'Vui lòng nhập họ tên',
                }]}
                initialValue={data?.fullName}
              >
                <Input placeholder="Họ tên" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label={<span className={styles.lbUpdateFrm}>Số điện thoại</span>}
                name="tel"
                initialValue={data?.tel}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item
                label={<span className={styles.lbUpdateFrm}>Ngày sinh</span>}
                name="dob"
                initialValue={data?.dob ? moment(data?.dob) : null}
              >
                <DatePicker format={{ format: 'DD-MM-YYYY' }} placeholder="Ngày sinh" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label={<span className={styles.lbUpdateFrm}>Giới tính</span>}
                name="gender"
                initialValue={data?.gender}
              >
                <Radio.Group size="large" >
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Address
                label="Tỉnh/thành phố"
                initialValue={data.address ? data.address.split(", ")[3] : "Không xác định"}
                type="province" suffixIcon={<PiBuildingApartmentBold />}
                options={cities}
                required={false}
                placeholder="Chọn tỉnh/thành phố"
                onSelect={handleSelectCitites}
              />
            </Col>
            <Col lg={12}>
              <Address
                label="Quận/huyện"
                initialValue={data.address ? data.address.split(", ")[2] : "Không xác định"}
                type="district"
                options={districts} suffixIcon={<HiBuildingOffice2 />}
                required={false}
                placeholder="Chọn quận/huyện"
                onSelect={handleSelectDistricts}
              />
            </Col>
            <Col lg={12}>
              <Address
                label="Xã/phường"
                initialValue={data.address ? data.address.split(", ")[1] : "Không xác định"}
                type="ward"
                options={wards} suffixIcon={<TbBuildingCommunity />}
                required={false}
                placeholder="Chọn xã/phường"
              />
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className={styles.lbUpdateFrm}>Địa chỉ chi tiết</span>}
                name="detail"
                initialValue={data.address ? data.address.split(", ")[0] : ""}
              >
                <Input placeholder="Địa chỉ chi tiết" />
              </Form.Item>
            </Col>
            { children }
          </Row>
        </Form>
        { data?.resumes 
        ? (<div className={styles.resumes}>
          {/* <span className={styles.lbUpdateFrm}>CV:</span> */}
          <Row gutter={[12, 12]} justify="space-evenly">
            { data.resumes.map((cv, index) => (
              <Row key={index} span={12}>
                <a href={cv.resume} target="_blank" rel="noreferrer" title={cv.name}>
                  <div className={styles.resume}>
                    { cv.name.lastIndexOf(".pdf") >= 0 ? (
                      <span className={styles.iconPdfFile}><FaFilePdf /></span>
                    ) : ( cv.name.lastIndexOf(".docx") >= 0 ? (
                      <span className={styles.iconDocxFile}><BsFiletypeDocx /></span>
                    ) : (
                      <span className={styles.iconDocFile}><BsFiletypeDoc /></span>
                    ))}
                    <p className={styles.cvName}>{cv.name}</p>
                  </div>
                </a>
              </Row>
            ))}
          </Row>
        </div>) 
        : (<></>) }
      </Modal>
    </ConfigProvider>
  );
}

export default ModalUpdate;