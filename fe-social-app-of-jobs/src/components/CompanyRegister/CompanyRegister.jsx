import { Col, Form, Input, Radio, Row } from "antd";

import { BsFillTelephoneFill } from "react-icons/bs";
import { FaBuilding } from "react-icons/fa";
import { PiBuildingApartmentBold } from "react-icons/pi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { TbBuildingCommunity } from "react-icons/tb";

import axios from "axios";

import styles from "./CompanyRegister.module.css";
import { useEffect, useState } from "react";
import Address from "../Address/Address";

function CompanyRegister() {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

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

  return (
    <div className={styles.companyRegisterFrm}>
      <h2>Thông tin nhà tuyển dụng</h2>
      <Row justify="space-between" gutter={[32, 0]}>
        <Col lg={12}>
          <Form.Item
            label={<span className={styles.lbSignUpFrm}>Số điện thoại cá nhân</span>}
            name="tel"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số điện thoại của bạn',
              },
              {
                pattern: /^\d{7,15}$/,
                message: 'Số điện thoại không hợp lệ'
              }
            ]}
          >
            <Input size="large" placeholder="Số điện thoại cá nhân" className={styles.field}
              addonBefore={<span className={styles.icon}><BsFillTelephoneFill /></span>} />
          </Form.Item>
        </Col>

        <Col lg={12} flex={1}>
          <Form.Item
            label={<span className={styles.lbSignUpFrm}>Giới tính</span>}
            name="gender"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn giới tính'
              }
            ]}
          >
            <Radio.Group size="large" >
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label={<span className={styles.lbSignUpFrm}>Công ty</span>}
        name="company"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập tên công ty'
          }
        ]}
      >
        <Input size="large" placeholder="Tên công ty" className={styles.field}
          addonBefore={<span className={styles.icon}><FaBuilding /></span>} />
      </Form.Item>

      <Row gutter={[32, 0]}>
        <Col lg={12}>
          <Address
            label="Địa điểm làm việc"
            type="province" size="large" suffixIcon={<PiBuildingApartmentBold />}
            options={cities}
            message="Vui lòng chọn tỉnh/thành phố làm việc"
            placeholder="Chọn tỉnh/thành phố"
            onSelect={handleSelectCitites}
          />
        </Col>
        <Col lg={12}>
          <Address
            label="Quận/huyện"
            type="district" size="large"
            options={districts} suffixIcon={<HiBuildingOffice2 />}
            message="Vui lòng chọn quận/huyện làm việc"
            placeholder="Chọn quận/huyện"
            onSelect={handleSelectDistricts}
          />
        </Col>
        <Col lg={12}>
          <Address
            label="Xã/phường"
            type="ward" size="large"
            options={wards} suffixIcon={<TbBuildingCommunity />}
            message="Vui lòng chọn xã/phường làm việc"
            placeholder="Chọn xã/phường"
          />
        </Col>
      </Row>
    </div>
  );
}

export default CompanyRegister;